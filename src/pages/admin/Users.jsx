import React, { useState } from 'react';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { updateDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';
import { logActivity } from '../../hooks/useActivityLog';

const Users = () => {
  const { data: users, loading } = useRealtimeCollection('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [configModal, setConfigModal] = useState({ show: false, user: null, config: '' });

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
    return 'text-cyan-400';
  };

  const saveConfig = async () => {
    try {
      await updateDocument('users', configModal.user.id, { vpnConfig: configModal.config });
      await logActivity('user', `VPN Config updated for user "${configModal.user.displayName || configModal.user.email}".`, 'success');
      showToast.success('VPN Config saved successfully!');
      setConfigModal({ show: false, user: null, config: '' });
    } catch {
      showToast.error('Failed to save config.');
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
          <p className="text-slate-500 text-sm">View and manage all registered clients.</p>
        </div>
        <div className="relative max-w-xs w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm"
            placeholder="Search by name, email or UID…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <i className="fa-solid fa-users-slash text-3xl mb-3 block"></i>
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-700 border border-slate-600">
                          {user.photoBase64
                            ? <img src={user.photoBase64} alt="Avatar" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-cyan-400 text-xs font-bold">{(user.displayName || user.email || 'U')[0].toUpperCase()}</div>
                          }
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{user.displayName || 'Unnamed'}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[140px]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-semibold capitalize ${planColor(user.plan)}`}>
                        {!user.plan || user.plan === 'none' ? 'Free' : user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs">
                      {user.subscriptionExpiry ? user.subscriptionExpiry.toDate().toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      {user.isActive
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Active</span>
                        : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-500 border border-slate-700">Inactive</span>
                      }
                    </td>
                    <td className="px-4 py-3.5">
                      {user.isAdmin
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30"><i className="fa-solid fa-crown text-[9px]"></i>Admin</span>
                        : <span className="text-xs text-slate-600">User</span>
                      }
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfigModal({ show: true, user, config: user.vpnConfig || '' })}
                          className="p-1.5 rounded-lg border text-xs transition-colors bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                          title="Set VPN Config"
                        >
                          <i className="fa-solid fa-file-code"></i>
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${user.isActive ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`fa-solid ${user.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button
                          onClick={() => setAdminStatus(user, !user.isAdmin)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${user.isAdmin ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30' : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'}`}
                          title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        >
                          <i className="fa-solid fa-crown text-xs"></i>
                        </button>
                        {user.plan && user.plan !== 'none' && (
                          <button
                            onClick={() => cancelUserPlan(user)}
                            className="p-1.5 rounded-lg border text-xs transition-colors bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                            title="Cancel Plan"
                          >
                            <i className="fa-solid fa-user-minus"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {configModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setConfigModal({ show: false, user: null, config: '' })}>
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">VPN Configuration</h3>
            <p className="text-sm text-slate-400 mb-4">Set the VPN config details for <span className="font-semibold text-white">{configModal.user?.email}</span></p>
            <textarea
              value={configModal.config}
              onChange={e => setConfigModal(prev => ({ ...prev, config: e.target.value }))}
              rows={8}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:border-cyan-500/50 focus:outline-none mb-4"
              placeholder="Paste the VPN configuration text here..."
            ></textarea>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfigModal({ show: false, user: null, config: '' })}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
              >
                Save Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
