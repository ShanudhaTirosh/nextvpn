import React, { useState } from 'react';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { updateDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';
import { logActivity } from '../../hooks/useActivityLog';
import { xuiGetInbounds, xuiResetTraffic, xuiDeleteClient } from '../../utils/xuiApi';
import { formatBytes } from '../../utils/usageService';

const Users = () => {
  const { data: users, loading } = useRealtimeCollection('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [configModal, setConfigModal] = useState({ show: false, user: null, config: '', subId: '', uuid: '', inboundId: '1' });
  const [xuiStats, setXuiStats] = useState({ loading: false, clients: {}, totalUpload: 0, totalDownload: 0, totalActive: 0 });

  const fetchXuiStats = async () => {
    setXuiStats(prev => ({ ...prev, loading: true }));
    try {
      const res = await xuiGetInbounds();
      if (res.success && res.obj) {
        const clientMap = {};
        let tUp = 0, tDown = 0, tActive = 0;
        
        res.obj.forEach(inb => {
          const settings = JSON.parse(inb.settings || '{}');
          const clients = settings.clients || [];

          if (inb.clientStats) {
            inb.clientStats.forEach(cs => {
              const clientDef = clients.find(c => c.email === cs.email);
              
              const usageData = {
                upload: cs.up,
                download: cs.down,
                total: clientDef?.totalGB || 0,
                enable: cs.enable,
                expire: clientDef?.expiryTime
              };

              // 1. Index by Email/Short ID (Lowercase for matching)
              if (cs.email) clientMap[cs.email.toLowerCase().trim()] = usageData;

              // 2. Index by UUID if it exists (e.g. 6fea0f1e...)
              if (clientDef && clientDef.id) {
                clientMap[clientDef.id.toLowerCase().trim()] = usageData;
              }

              tUp += cs.up;
              tDown += cs.down;
              if (cs.enable) tActive++;
            });
          }
        });
        setXuiStats({ loading: false, clients: clientMap, totalUpload: tUp, totalDownload: tDown, totalActive: tActive });
      } else {
        setXuiStats(prev => ({ ...prev, loading: false }));
      }
    } catch (e) {
      console.error('Failed to load X-UI stats', e);
      setXuiStats(prev => ({ ...prev, loading: false }));
    }
  };

  React.useEffect(() => {
    fetchXuiStats();
    const interval = setInterval(fetchXuiStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = (users || []).filter(u =>
    (u.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.uid?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleUserStatus = async (user) => {
    try {
      await updateDocument('users', user.id, { isActive: !user.isActive });
      await logActivity('user', `User "${user.displayName || user.email}" was ${!user.isActive ? 'activated' : 'deactivated'}.`, !user.isActive ? 'success' : 'warning');
      showToast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}.`);
    } catch {
      showToast.error('Failed to update user status.');
    }
  };

  const setAdminStatus = async (user, isAdmin) => {
    try {
      await updateDocument('users', user.id, { isAdmin });
      await logActivity('user', `User "${user.displayName || user.email}" was ${isAdmin ? 'granted' : 'revoked'} admin rights.`, 'warning');
      showToast.success('Admin status updated.');
    } catch {
      showToast.error('Failed to update admin status.');
    }
  };

  const planColor = (plan) => {
    if (!plan || plan === 'none') return 'text-slate-500';
    return 'text-brand-primary';
  };

  const saveConfig = async () => {
    try {
      await updateDocument('users', configModal.user.id, { 
        vpnConfig: configModal.config,
        subscriptionId: configModal.subId,
        v2rayUuid: configModal.uuid,
        inboundId: configModal.inboundId
      });
      await logActivity('user', `Proxy settings updated for user "${configModal.user.displayName || configModal.user.email}".`, 'success');
      showToast.success('Settings saved successfully!');
      setConfigModal({ show: false, user: null, config: '', subId: '' });
    } catch {
      showToast.error('Failed to save settings.');
    }
  };

  const cancelUserPlan = async (user) => {
    if (!window.confirm(`Are you sure you want to cancel the active plan for ${user.displayName || user.email}?`)) return;
    try {
      await updateDocument('users', user.id, { plan: 'none', subscriptionExpiry: null });
      await logActivity('user', `Canceled active plan for user "${user.displayName || user.email}".`, 'warning');
      showToast.success('User plan canceled successfully.');
    } catch {
      showToast.error('Failed to cancel user plan.');
    }
  };



  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-brand-primary/60 text-sm font-black uppercase tracking-widest">Global Client Database</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Download</span>
            <i className="fa-solid fa-download text-brand-primary"></i>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatBytes(xuiStats.totalDownload)}</div>
        </div>
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Upload</span>
            <i className="fa-solid fa-upload text-brand-primary"></i>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatBytes(xuiStats.totalUpload)}</div>
        </div>
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active X-UI Connections</span>
            <i className="fa-solid fa-network-wired text-brand-primary"></i>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{xuiStats.totalActive}</div>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-border/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-brand-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search by name, email or UID..." 
              className="w-full bg-brand-bg border border-brand-border/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-brand-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchXuiStats}
            disabled={xuiStats.loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-bg hover:bg-brand-panel border border-brand-border/50 rounded-xl text-xs font-bold text-slate-300 transition-all disabled:opacity-50"
          >
            <i className={`fa-solid fa-arrows-rotate ${xuiStats.loading ? 'animate-spin' : ''} text-brand-primary`}></i>
            Sync X-UI Data
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <i className="fa-solid fa-users-slash text-3xl mb-3 block"></i>
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-brand-panel/30">
                  <th className="px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plan</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Usage</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {filteredUsers.map(user => {
                  const subId = (user.subscriptionId || "").toLowerCase().trim();
                  const vUuid = (user.v2rayUuid || "").toLowerCase().trim();
                  const emailId = (user.email || "").toLowerCase().trim();
                  const usage = xuiStats.clients[subId] || xuiStats.clients[vUuid] || xuiStats.clients[emailId];
                  
                  const used = usage ? usage.upload + usage.download : 0;
                  const total = usage?.total || 0;
                  const percent = total > 0 ? (used / total) * 100 : 0;

                  return (
                  <tr key={user.id} className="hover:bg-brand-panel/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-brand-bg border border-brand-border">
                          {user.photoBase64
                            ? <img src={user.photoBase64} alt="Avatar" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-brand-primary text-xs font-bold">{(user.displayName || user.email || 'U')[0].toUpperCase()}</div>
                          }
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{user.displayName || 'Unnamed'}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-semibold capitalize ${planColor(user.plan)}`}>
                        {!user.plan || user.plan === 'none' ? 'Free' : user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 w-48">
                      {(!user.plan || user.plan === 'none') ? (
                        <span className="text-[10px] text-slate-600 italic">No Active Plan</span>
                      ) : usage ? (
                        <div className="w-full">
                          <div className="text-[10px] font-bold text-brand-primary mb-1">{Math.round(percent)}% used</div>
                          <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 bg-brand-primary shadow-[0_0_8px_rgba(255,106,0,0.4)]`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                          <div className="mt-1 flex justify-between text-[9px] text-slate-500 font-medium">
                            <span>{formatBytes(used)}</span>
                            <span>{total > 0 ? formatBytes(total) : '∞'}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">No X-UI Data</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {user.isActive
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/30">Active</span>
                        : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-panel text-slate-500">Inactive</span>
                      }
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button
                          onClick={() => setConfigModal({ show: true, user, config: user.vpnConfig || '', subId: user.subscriptionId || '', uuid: user.v2rayUuid || '', inboundId: user.inboundId || '1' })}
                          className="p-2 rounded-lg bg-brand-bg border border-brand-border text-brand-primary hover:bg-brand-panel transition-colors"
                        >
                          <i className="fa-solid fa-server"></i>
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className={`p-2 rounded-lg border ${user.isActive ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'}`}
                        >
                          <i className={`fa-solid ${user.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button
                          onClick={() => setAdminStatus(user, !user.isAdmin)}
                          className={`p-2 rounded-lg border ${user.isAdmin ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/40' : 'bg-brand-bg text-slate-500 border-brand-border'}`}
                        >
                          <i className="fa-solid fa-crown text-xs"></i>
                        </button>
                        {user.plan && user.plan !== 'none' && (
                          <button
                            title="Cancel Active Plan"
                            onClick={() => cancelUserPlan(user)}
                            className="p-2 rounded-lg border bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 transition-all"
                          >
                            <i className="fa-solid fa-calendar-xmark text-xs"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {configModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setConfigModal({ show: false, user: null, config: '', subId: '', uuid: '', inboundId: '1' })}>
          <div className="w-full max-w-lg rounded-2xl bg-brand-surface border border-brand-border shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Proxy & Subscription</h3>
            <p className="text-sm text-slate-400 mb-6">Manage connectivity details for <span className="font-semibold text-white">{configModal.user?.email}</span></p>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">V2Ray UUID</label>
                  <input 
                    type="text"
                    value={configModal.subId}
                    onChange={e => setConfigModal(prev => ({ ...prev, subId: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-brand-bg border border-brand-border text-slate-300 text-sm focus:border-brand-primary/50 focus:outline-none"
                    placeholder="Long ID..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subscription Path</label>
                  <input 
                    type="text"
                    value={configModal.uuid}
                    onChange={e => setConfigModal(prev => ({ ...prev, uuid: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-brand-bg border border-brand-border text-slate-300 text-sm focus:border-brand-primary/50 focus:outline-none"
                    placeholder="Short ID..."
                  />
                </div>
              </div>
              <p className="text-[10px] text-brand-primary/60 italic mt-1">Use the Path for Admin stats and the UUID for the Client Dashboard.</p>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">X-UI Inbound ID</label>
                <input 
                  type="text"
                  value={configModal.inboundId}
                  onChange={e => setConfigModal(prev => ({ ...prev, inboundId: e.target.value }))}
                  className="w-full p-3 rounded-xl bg-brand-bg border border-brand-border text-slate-300 text-sm focus:border-brand-primary/50 focus:outline-none"
                  placeholder="e.g. 1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">VPN Configuration (V2RayNG/v2rayN)</label>
                <textarea 
                  value={configModal.config}
                  onChange={e => setConfigModal(prev => ({ ...prev, config: e.target.value }))}
                  className="w-full p-3 h-32 rounded-xl bg-brand-bg border border-brand-border text-slate-300 text-xs font-mono focus:border-brand-primary/50 focus:outline-none resize-none"
                  placeholder="Paste vless:// or vmess:// link here..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-brand-border/50 pt-6">
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (window.confirm('Reset usage for this user in X-UI?')) {
                      await xuiResetTraffic(configModal.inboundId, configModal.user.email);
                      fetchXuiStats();
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-bg text-brand-primary border border-brand-border hover:bg-brand-panel transition-all"
                >
                  <i className="fa-solid fa-arrows-rotate mr-1.5"></i> Reset Traffic
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this client from X-UI?')) {
                      await xuiDeleteClient(configModal.inboundId, configModal.subId);
                      fetchXuiStats();
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <i className="fa-solid fa-trash mr-1.5"></i> Delete
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfigModal({ show: false, user: null, config: '', subId: '', uuid: '', inboundId: '1' })}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-brand-border hover:bg-brand-panel transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveConfig}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-glow text-white font-bold hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
