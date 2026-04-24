import React, { useState } from 'react';
import { useCollection } from '../../hooks/useFirestore';
import { addDocument, updateDocument, deleteDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';
import { logActivity } from '../../hooks/useActivityLog';

const INITIAL = {
  name: '', country: '', flagEmoji: '🌐', protocol: 'VMess',
  address: '', latencyMs: 50, activeUsers: 0, maxUsers: 100,
  region: 'Asia', isOnline: true, isDDoSProtected: true,
};

const ServerCard = ({ server, onEdit, onDelete, onToggle }) => {
  const load = server.maxUsers > 0 ? (server.activeUsers / server.maxUsers) * 100 : 0;
  const loadColor = load > 85 ? 'bg-red-500' : load > 60 ? 'bg-amber-400' : 'bg-emerald-400';

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5 hover:border-slate-600/70 transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{server.flagEmoji}</span>
          <div>
            <h3 className="font-bold text-white text-sm">{server.name}</h3>
            <p className="text-xs text-slate-500">{server.country} · {server.region}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => onEdit(server)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-xs"><i className="fa-solid fa-pen"></i></button>
          <button onClick={() => onToggle(server.id, server.isOnline)} className={`p-1.5 rounded-lg border text-xs transition-colors ${server.isOnline ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            <i className={`fa-solid ${server.isOnline ? 'fa-power-off' : 'fa-plug'}`}></i>
          </button>
          <button onClick={() => onDelete(server.id, server.name)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs"><i className="fa-solid fa-trash"></i></button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">{server.protocol}</span>
        {server.isDDoSProtected && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium"><i className="fa-solid fa-shield-halved mr-1"></i>Protected</span>}
        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${server.isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${server.isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
          {server.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span><i className="fa-solid fa-users mr-1"></i>Load</span>
          <span className={load > 85 ? 'text-red-400' : 'text-white'}>{server.activeUsers} / {server.maxUsers}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${loadColor}`} style={{ width: `${Math.min(100, load)}%` }}></div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800">
        <p className="font-mono text-xs text-slate-600 truncate">{server.address || '—'}</p>
      </div>
    </div>
  );
};

const Servers = () => {
  const { data: servers, loading } = useCollection('servers');
  const [showModal, setShowModal] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [formData, setFormData] = useState(INITIAL);
  const [isSaving, setIsSaving] = useState(false);

  const openModal = (server = null) => {
    setEditingServer(server);
    setFormData(server ? { ...server } : { ...INITIAL });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingServer(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsed = { ...formData, latencyMs: +formData.latencyMs, activeUsers: +formData.activeUsers, maxUsers: +formData.maxUsers };
      if (editingServer) {
        await updateDocument('servers', editingServer.id, parsed);
        await logActivity('server', `Server "${parsed.name}" configuration updated.`, 'info');
        showToast.success('Server updated!');
      } else {
        await addDocument('servers', parsed);
        await logActivity('server', `New server "${parsed.name}" (${parsed.country}) added.`, 'success');
        showToast.success('Server added!');
      }
      closeModal();
    } catch { showToast.error('Failed to save server.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete server "${name}"?`)) {
      await deleteDocument('servers', id);
      await logActivity('server', `Server "${name}" was removed from the network.`, 'danger');
    }
  };

  const toggleStatus = async (id, current) => {
    await updateDocument('servers', id, { isOnline: !current });
    const server = servers?.find(s => s.id === id);
    await logActivity('server', `Server "${server?.name}" was brought ${!current ? 'online' : 'offline'}.`, !current ? 'success' : 'warning');
  };

  const F = ({ label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
  const inp = "w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm";
  const sel = "w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none text-sm";

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Server Nodes</h1>
          <p className="text-slate-500 text-sm">Manage VPN and proxy infrastructure.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
          <i className="fa-solid fa-plus"></i> Add Server
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>
      ) : !servers?.length ? (
        <div className="text-center py-24 text-slate-600"><i className="fa-solid fa-server text-4xl mb-4 block"></i><p>No servers configured yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {servers.map(s => <ServerCard key={s.id} server={s} onEdit={openModal} onDelete={handleDelete} onToggle={toggleStatus} />)}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={closeModal}>
          <div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-slate-950 border border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-bold text-white">{editingServer ? 'Edit Server' : 'New Server'}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1 flex gap-3">
                    <F label="Server Name"><input className={inp} required value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} placeholder="e.g. SG-1 Premium" /></F>
                    <F label="Flag"><input className={inp} value={formData.flagEmoji} onChange={e => setFormData({...formData,flagEmoji:e.target.value})} /></F>
                  </div>
                  <F label="Country"><input className={inp} required value={formData.country} onChange={e => setFormData({...formData,country:e.target.value})} placeholder="Singapore" /></F>
                  <F label="Region">
                    <select className={sel} value={formData.region} onChange={e => setFormData({...formData,region:e.target.value})}>
                      {['Asia','Europe','America','Middle East'].map(r=><option key={r}>{r}</option>)}
                    </select>
                  </F>
                  <F label="Protocol">
                    <select className={sel} value={formData.protocol} onChange={e => setFormData({...formData,protocol:e.target.value})}>
                      {['VMess','VLESS','Trojan','Shadowsocks'].map(p=><option key={p}>{p}</option>)}
                    </select>
                  </F>
                  <F label="Domain / IP"><input className={inp} required value={formData.address} onChange={e => setFormData({...formData,address:e.target.value})} placeholder="sg1.example.net" /></F>
                  <F label="Latency (ms)"><input type="number" className={inp} value={formData.latencyMs} onChange={e => setFormData({...formData,latencyMs:e.target.value})} /></F>
                  <F label="Active Users"><input type="number" className={inp} value={formData.activeUsers} onChange={e => setFormData({...formData,activeUsers:e.target.value})} /></F>
                  <F label="Max Users"><input type="number" className={inp} value={formData.maxUsers} onChange={e => setFormData({...formData,maxUsers:e.target.value})} /></F>
                  
                  <div className="col-span-2 flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isOnline} onChange={e=>setFormData({...formData,isOnline:e.target.checked})} className="w-4 h-4 rounded accent-cyan-500" />
                      <span className="text-sm text-emerald-400 font-semibold">Server Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isDDoSProtected} onChange={e=>setFormData({...formData,isDDoSProtected:e.target.checked})} className="w-4 h-4 rounded accent-cyan-500" />
                      <span className="text-sm text-amber-400 font-semibold">DDoS Protected</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-slate-800 bg-slate-900/60 flex-shrink-0">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50">
                  {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Save Server'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servers;
