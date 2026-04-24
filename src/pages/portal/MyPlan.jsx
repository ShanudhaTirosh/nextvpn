import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCollection, useDocument } from '../../hooks/useFirestore';
import PricingCard from '../../components/PricingCard';
import PaymentModal from '../../components/PaymentModal';

const statusConfig = {
  approved: { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: 'fa-check-circle', label: 'Paid' },
  pending:  { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: 'fa-clock', label: 'Pending' },
  rejected: { cls: 'bg-red-500/10 text-red-400 border-red-500/30', icon: 'fa-xmark-circle', label: 'Rejected' },
};

const MyPlan = () => {
  const { userData } = useAuth();
  const { data: config } = useDocument('siteSettings', 'config');
  const { data: packages, loading } = useCollection('packages', []);
  const { data: payments } = useCollection('payments', []);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const userPayments = (payments || [])
    .filter(p => p.uid === userData?.uid)
    .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));

  const pendingPayment = userPayments.find(p => p.status === 'pending');
  const isActive = userData?.isActive && userData?.plan !== 'none';

  const getDaysRemaining = () => {
    if (!userData?.subscriptionExpiry) return 0;
    const diff = userData.subscriptionExpiry.toDate() - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining();
  const displayPackages = (packages || []).filter(p => p.isVisible).sort((a, b) => a.order - b.order);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">My Subscription</h1>
        <p className="text-slate-500 text-sm">Manage your plan and view billing history.</p>
      </div>

      {pendingPayment && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
          <i className="fa-solid fa-clock text-amber-400 mt-0.5"></i>
          <div>
            <h3 className="font-semibold text-white text-sm">Payment Under Review</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your payment for <strong className="text-slate-300">{pendingPayment.packageName}</strong> is being verified. This usually takes 1–2 hours.
            </p>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="mb-8 p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Current Status</p>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-white capitalize">{userData?.plan === 'none' || !userData?.plan ? 'Free Plan' : `${userData.plan} Plan`}</h2>
              {isActive
                ? <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>Active</span>
                : <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-400 border border-slate-600 text-xs font-semibold">Inactive</span>
              }
            </div>
            {isActive && (
              <p className="text-sm text-slate-500">
                Expires <span className="text-slate-300 font-medium">{userData.subscriptionExpiry?.toDate().toLocaleDateString()}</span>
                <span className="ml-2 text-cyan-400">({daysLeft} days remaining)</span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => document.getElementById('plans-section')?.scrollIntoView({behavior:'smooth'})}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              <i className="fa-solid fa-arrow-up-right-dots mr-2"></i> Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div id="plans-section">
        <h2 className="text-lg font-bold text-white mb-5">Available Packages</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {displayPackages.map(pkg => (
              <PricingCard key={pkg.id} pkg={pkg} isLoggedIn onSelect={() => { setSelectedPkg(pkg); setShowPayment(true); }} />
            ))}
          </div>
        )}
      </div>

      {/* Billing History */}
      <h2 className="text-lg font-bold text-white mb-5">Billing History</h2>
      <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 overflow-hidden backdrop-blur-sm">
        {userPayments.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <i className="fa-solid fa-receipt text-3xl mb-3 block"></i>
            <p className="text-sm">No billing history yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Package</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {userPayments.slice(0, 10).map(p => {
                  const sc = statusConfig[p.status] || statusConfig.pending;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{p.createdAt?.toDate?.().toLocaleDateString() || '—'}</td>
                      <td className="px-4 py-3.5 font-semibold text-white">{p.packageName}</td>
                      <td className="px-4 py-3.5 text-cyan-400 font-semibold">LKR {p.amount}</td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs capitalize">{p.method}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.cls}`}>
                          <i className={`fa-solid ${sc.icon} text-[10px]`}></i>{sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PaymentModal show={showPayment} onHide={() => setShowPayment(false)} packageData={selectedPkg} siteSettings={config} />
    </div>
  );
};

export default MyPlan;
