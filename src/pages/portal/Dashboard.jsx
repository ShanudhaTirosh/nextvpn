import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import LocationCard from '../../components/LocationCard';
import SkeletonLoader from '../../components/SkeletonLoader';

const StatCard = ({ label, value, sub, icon, color }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-slate-900/60 border p-5 backdrop-blur-sm ${color.border}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${color.grad} opacity-30 pointer-events-none`} />
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
        <i className={`fa-solid ${icon} ${color.text}`}></i>
      </div>
      <div className={`text-2xl font-bold text-white mb-1 capitalize`}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { userData } = useAuth();
  const { data: servers, loading } = useRealtimeCollection('servers', []);

  const isActive = userData?.isActive && userData?.plan !== 'none';

  const getDaysRemaining = () => {
    if (!userData?.subscriptionExpiry) return 0;
    const diff = userData.subscriptionExpiry.toDate() - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining();
  // We don't store max days, so we assume 30 for monthly and 365 for anything > 30
  const maxDays = userData?.planDurationDays || 30;
  const daysProgress = maxDays > 0 ? Math.min(100, Math.max(0, ((maxDays - daysLeft) / maxDays) * 100)) : 0;

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
            <div key={server.id} className={`relative ${!isActive ? 'opacity-60' : ''}`}>
              <LocationCard server={server} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
