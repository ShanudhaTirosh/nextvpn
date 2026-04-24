import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useFirestore';
import LocationCard from '../../components/LocationCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { showToast } from '../../components/Toast';

const StatCard = ({ label, value, sub, icon, color }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-slate-900/60 border p-5 backdrop-blur-sm ${color.border}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${color.grad} opacity-30 pointer-events-none`} />
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
        <i className={`fa-solid ${icon} ${color.text}`}></i>
      </div>
      <div className={`text-2xl font-bold text-white mb-1`}>{value}</div>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { userData } = useAuth();
  const { data: servers, loading } = useCollection('servers', []);
  const [selectedServer, setSelectedServer] = useState(null);

  const isActive = userData?.isActive && userData?.plan !== 'none';

  const getDaysRemaining = () => {
    if (!userData?.subscriptionExpiry) return 0;
    const diff = userData.subscriptionExpiry.toDate() - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining();
  const daysProgress = Math.min(100, (daysLeft / 30) * 100);

  const handleCopyConfig = (server) => {
    if (!isActive) { showToast.error('Active plan required to view configs.'); return; }
    const uid = userData?.uid || 'unknown';
    const config = {
      v: '2', ps: `ShiftLK-${server.name}`,
      add: server.address, port: '443',
      id: uid, aid: '0', net: 'ws',
      type: 'none', host: '', path: '/shiftlk', tls: 'tls',
    };
    const link = `vmess://${btoa(JSON.stringify(config))}`;
    navigator.clipboard.writeText(link);
    showToast.success(`Config copied for ${server.name}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back, <span className="text-slate-300 font-medium">{userData?.displayName || 'User'}</span></p>
      </div>

      {!isActive && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-3">
          <i className="fa-solid fa-circle-exclamation text-red-400 mt-0.5"></i>
          <div>
            <h3 className="font-semibold text-white text-sm">No Active Plan</h3>
            <p className="text-xs text-slate-500 mt-1">You don't have an active subscription. Purchase a plan under "My Plan" to access server configs.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Current Plan"
          value={userData?.plan === 'none' || !userData?.plan ? 'Free' : userData.plan}
          sub={isActive ? 'Subscription active' : 'No active plan'}
          icon="fa-id-card"
          color={{ border: 'border-cyan-500/20', grad: 'from-cyan-500/10 to-transparent', text: 'text-cyan-400' }}
        />
        <StatCard
          label="Days Remaining"
          value={`${daysLeft} days`}
          sub={
            <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all" style={{ width: `${daysProgress}%` }}></div>
            </div>
          }
          icon="fa-calendar-days"
          color={{ border: 'border-blue-500/20', grad: 'from-blue-500/10 to-transparent', text: 'text-blue-400' }}
        />
        <StatCard
          label="Data Usage"
          value={`${userData?.dataUsageGB?.toFixed(2) || '0.00'} GB`}
          sub={<span className="text-emerald-400"><i className="fa-solid fa-infinity mr-1"></i>Unlimited bandwidth</span>}
          icon="fa-chart-area"
          color={{ border: 'border-emerald-500/20', grad: 'from-emerald-500/10 to-transparent', text: 'text-emerald-400' }}
        />
      </div>

      {/* Servers */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Available Servers</h2>
        <span className="text-xs text-slate-500">{servers?.length || 0} nodes</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i}><SkeletonLoader type="card" /></div>)}
        </div>
      ) : !servers?.length ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-slate-800">
          <i className="fa-solid fa-server text-3xl text-slate-700 mb-3 block"></i>
          <p className="text-slate-600 text-sm">No servers available. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map(server => (
            <div key={server.id} className="relative">
              <div
                className={`cursor-pointer ${!isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => isActive && setSelectedServer(selectedServer === server.id ? null : server.id)}
              >
                <LocationCard server={server} />
              </div>

              {selectedServer === server.id && isActive && (
                <div className="absolute inset-0 rounded-2xl bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-5 animate-fade-in z-10">
                  <button onClick={() => setSelectedServer(null)} className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                  <i className="fa-solid fa-lock-open text-cyan-400 text-2xl mb-3"></i>
                  <h3 className="text-white font-bold text-sm mb-4 text-center">{server.name} Config</h3>
                  <button
                    onClick={() => handleCopyConfig(server)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm mb-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    <i className="fa-solid fa-copy mr-2"></i> Copy VMess Link
                  </button>
                  <button
                    onClick={() => showToast.info('QR generation coming soon.')}
                    className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-slate-600 hover:text-white transition-all"
                  >
                    <i className="fa-solid fa-qrcode mr-2"></i> Show QR Code
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
