import React, { useState } from 'react';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { updateDocument, getDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';
import { logActivity } from '../../hooks/useActivityLog';

const SEVERITY_CONFIG = {
  success: { icon: 'fa-check', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  warning: { icon: 'fa-clock', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  danger:  { icon: 'fa-triangle-exclamation', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  info:    { icon: 'fa-circle-info', color: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20' },
};

const StatCard = ({ label, value, icon, colorClass, sub }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5`}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <i className={`fa-solid ${icon} text-xl ${colorClass}`}></i>
    </div>
    <div className={`text-3xl font-bold text-white mb-1`}>{value}</div>
    {sub && <p className="text-xs text-slate-500">{sub}</p>}
  </div>
);

const Overview = () => {
  const { data: users } = useRealtimeCollection('users');
  const { data: payments } = useRealtimeCollection('payments');
  const { data: servers } = useRealtimeCollection('servers');
  const { data: logs, loading: logsLoading } = useRealtimeCollection('activity_logs');
  const [processing, setProcessing] = useState(null);

  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
  const verifyingPayments = (payments || []).filter(p => p.status === 'verifying');
  const totalRevenue = payments?.filter(p => p.status === 'approved').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const activeUsers = users?.filter(u => u.isActive && u.plan !== 'none').length || 0;
  const onlineServers = servers?.filter(s => s.isOnline).length || 0;

  const recentLogs = [...(logs || [])].sort((a, b) => {
    const aT = a.createdAt?.toDate?.() || 0;
    const bT = b.createdAt?.toDate?.() || 0;
    return bT - aT;
  }).slice(0, 8);

  const formatTime = (ts) => {
    if (!ts?.toDate) return 'just now';
    const d = ts.toDate();
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  // Validate reference format: NX-XXXX-XXXXXXXX
  const isValidRef = (ref) => /^NX-[A-Z0-9]{4}-[A-Z0-9]+$/.test(ref || '');

  const handleAutoApprove = async (payment) => {
    if (!isValidRef(payment.reference)) {
      showToast.error('Invalid reference format. Cannot auto-approve.');
      return;
    }
    setProcessing(payment.id);
    try {
      await updateDocument('payments', payment.id, { status: 'approved' });
      const userDoc = await getDocument('users', payment.uid);
      if (userDoc) {
        const currentExpiry = userDoc.subscriptionExpiry ? userDoc.subscriptionExpiry.toDate() : new Date();
        const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()));
        newExpiry.setDate(newExpiry.getDate() + Number(payment.durationDays || 30));
        await updateDocument('users', payment.uid, {
          plan: payment.packageName.toLowerCase(),
          isActive: true,
          paymentStatus: 'paid',
          subscriptionExpiry: newExpiry,
          planDurationDays: Number(payment.durationDays || 30),
        });
      }
      await logActivity('payment', `Auto-verified ${payment.method} payment of LKR ${payment.amount} for "${payment.packageName}" (Ref: ${payment.reference}).`, 'success');
      showToast.success('Payment auto-approved and plan activated!');
    } catch (err) {
      showToast.error('Failed to auto-approve.');
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (payment) => {
    setProcessing(payment.id);
    try {
      await updateDocument('payments', payment.id, { status: 'rejected' });
      await logActivity('payment', `Payment (Ref: ${payment.reference}) was rejected.`, 'danger');
      showToast.error('Payment rejected.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">System Overview</h1>
        <p className="text-slate-500 text-sm">Real-time metrics from your Firestore database.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Subscribers" value={activeUsers} icon="fa-users" colorClass="text-brand-primary" sub="Plans active now" />
        <StatCard label="Pending Payments" value={pendingPayments} icon="fa-money-bill-wave" colorClass="text-brand-glow" sub="Awaiting review" />
        <StatCard label="Total Revenue" value={`LKR ${totalRevenue.toLocaleString()}`} icon="fa-sack-dollar" colorClass="text-emerald-400" sub="All approved" />
        <StatCard label="Servers Online" value={`${onlineServers} / ${servers?.length || 0}`} icon="fa-server" colorClass="text-brand-primary" sub="Node health" />
      </div>

      {/* Auto-Verify Queue */}
      {verifyingPayments.length > 0 && (
        <div className="mb-8 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-primary/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <i className="fa-solid fa-bolt text-brand-primary text-sm animate-pulse"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Auto-Verification Queue</h2>
              <p className="text-xs text-slate-500">{verifyingPayments.length} HelaPay / eZcash payment{verifyingPayments.length > 1 ? 's' : ''} awaiting verification</p>
            </div>
          </div>
          <div className="divide-y divide-brand-primary/10">
            {verifyingPayments.map(p => (
              <div key={p.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${p.method === 'helapay' ? 'fa-mobile-screen' : 'fa-wallet'} text-brand-primary text-sm`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{p.packageName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs capitalize">{p.method}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">LKR {p.amount}</span>
                      <span className="font-mono text-xs text-amber-400">{p.reference}</span>
                      {isValidRef(p.reference)
                        ? <span className="text-xs text-emerald-400"><i className="fa-solid fa-check-circle mr-1"></i>Valid format</span>
                        : <span className="text-xs text-red-400"><i className="fa-solid fa-xmark-circle mr-1"></i>Invalid ref</span>
                      }
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {p.proofBase64 && (
                    <button
                      onClick={() => window.open(p.proofBase64)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-xs transition-colors"
                    >
                      <i className="fa-solid fa-image mr-1"></i>Proof
                    </button>
                  )}
                  <button
                    onClick={() => handleAutoApprove(p)}
                    disabled={processing === p.id}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs transition-colors font-semibold disabled:opacity-50"
                  >
                    {processing === p.id ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-bolt mr-1"></i>Auto-Approve</>}
                  </button>
                  <button
                    onClick={() => handleReject(p)}
                    disabled={processing === p.id}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs transition-colors disabled:opacity-50"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5 h-full">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bolt-lightning text-brand-primary"></i> Live Activity Feed
            </h2>
            {logsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <i className="fa-solid fa-wave-square text-3xl mb-3 block"></i>
                <p className="text-sm">No activity logged yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentLogs.map(log => {
                  const cfg = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.info;
                  return (
                    <div key={log.id} className={`flex items-start gap-3 p-3 rounded-xl ${cfg.bg} border ${cfg.border}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                        <i className={`fa-solid ${cfg.icon} text-sm ${cfg.color}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300">{log.message}</p>
                        <span className="text-xs text-slate-600">{formatTime(log.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Node Status */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-5 h-full">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-satellite-dish text-brand-glow"></i> Node Status
            </h2>
            {!servers?.length ? (
              <p className="text-slate-600 text-sm text-center py-8">No servers configured.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {servers.slice(0, 8).map(server => {
                  const load = server.maxUsers > 0 ? (server.activeUsers / server.maxUsers) * 100 : 0;
                  const loadColor = load > 85 ? 'bg-red-500' : load > 60 ? 'bg-amber-400' : 'bg-emerald-400';
                  return (
                    <div key={server.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{server.flagEmoji}</span>
                          <span className="text-sm text-slate-300 truncate max-w-[110px]">{server.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{server.activeUsers}/{server.maxUsers}</span>
                          <span className={`w-2 h-2 rounded-full ${server.isOnline ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`}></span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${loadColor}`} style={{ width: `${load}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
