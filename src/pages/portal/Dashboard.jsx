import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import LocationCard from '../../components/LocationCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { formatBytes } from '../../utils/usageService';
import { xuiGetMyStats } from '../../utils/xuiApi';

const StatCard = ({ label, value, sub, icon, color }) => (
  <div className={`glass-card relative overflow-hidden p-5 transition-all duration-500 hover:border-brand-primary/40 ${color.border}`}>
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
  const [usage, setUsage] = React.useState(null);

  React.useEffect(() => {
    let intervalId;

    const fetchUsage = async () => {
      if (!userData?.subscriptionId && !userData?.v2rayUuid) return;

      try {
        const response = await xuiGetMyStats();
        if (response.success) {
          setUsage(response);
        }
      } catch (err) {
        console.error("Dashboard Usage Fetch Error:", err);
      }
    };

    fetchUsage();
    intervalId = setInterval(fetchUsage, 30000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userData?.subscriptionId, userData?.v2rayUuid]);

  const isActive = userData?.isActive && userData?.plan !== 'none';

  const getDaysRemaining = () => {
    if (!userData?.subscriptionExpiry) return 0;
    const diff = userData.subscriptionExpiry.toDate() - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining();
  const maxDays = userData?.planDurationDays || 30;
  const daysProgress = maxDays > 0 ? Math.min(100, Math.max(0, ((maxDays - daysLeft) / maxDays) * 100)) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back, <span className="text-slate-300 font-medium">{userData?.displayName || 'User'}</span></p>
      </div>

      {!isActive && (
        <div className="mb-6 p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 flex items-start gap-3">
          <i className="fa-solid fa-circle-exclamation text-brand-primary mt-0.5"></i>
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
          color={{ border: 'border-brand-primary/20', grad: 'from-brand-primary/10 to-transparent', text: 'text-brand-primary' }}
        />
        <StatCard
          label="Days Remaining"
          value={`${daysLeft} days`}
          sub={
            <div className="w-full h-1 bg-brand-bg rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-primary to-brand-glow rounded-full transition-all" style={{ width: `${daysProgress}%` }}></div>
            </div>
          }
          icon="fa-calendar-days"
          color={{ border: 'border-brand-primary/20', grad: 'from-brand-primary/10 to-transparent', text: 'text-brand-primary' }}
        />
        <StatCard
          label="Data Usage"
          value={usage ? formatBytes(usage.used) : `${userData?.dataUsageGB?.toFixed(2) || '0.00'} GB`}
          sub={usage ? (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Total: {formatBytes(usage.total)}</span>
                <span className="text-brand-primary font-bold">{Math.min(100, Math.round((usage.used / usage.total) * 100))}%</span>
              </div>
              <div className="w-full h-1 bg-brand-bg rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary rounded-full" style={{ width: `${Math.min(100, (usage.used / usage.total) * 100)}%` }}></div>
              </div>
            </div>
          ) : <span className="text-brand-primary"><i className="fa-solid fa-infinity mr-1"></i>Unlimited bandwidth</span>}
          icon="fa-chart-area"
          color={{ border: 'border-brand-primary/20', grad: 'from-brand-primary/10 to-transparent', text: 'text-brand-primary' }}
        />
      </div>

      {usage && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <div className="p-3 rounded-xl bg-brand-surface/40 border border-brand-primary/20 hover:bg-brand-surface/60 transition-colors cursor-default">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Upload</div>
            <div className="text-sm font-bold text-white">{formatBytes(usage.upload)}</div>
          </div>
          <div className="p-3 rounded-xl bg-brand-surface/40 border border-brand-primary/20 hover:bg-brand-surface/60 transition-colors cursor-default">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Download</div>
            <div className="text-sm font-bold text-white">{formatBytes(usage.download)}</div>
          </div>
          <div className="p-3 rounded-xl bg-brand-surface/40 border border-brand-primary/20 hover:bg-brand-surface/60 transition-colors cursor-default">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Remaining</div>
            <div className="text-sm font-bold text-brand-primary">{usage.total > 0 ? formatBytes(usage.total - usage.used) : 'Unlimited'}</div>
          </div>

        </div>
      )}

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
          <i className="fa-solid fa-server text-3xl text-brand-primary mb-3 block"></i>
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
