import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCollection, useDocument } from '../../hooks/useFirestore';
import GlassCard from '../../components/GlassCard';
import PricingCard from '../../components/PricingCard';
import PaymentModal from '../../components/PaymentModal';

const MyPlan = () => {
  const { userData } = useAuth();
  const { data: config } = useDocument('siteSettings', 'config');
  const { data: packages, loading } = useCollection('packages', []);
  const { data: payments } = useCollection('payments', [
    // query constraint in a real app: where('uid', '==', userData.uid)
  ]);
  
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  // Filter payments locally since we don't have complex firestore queries setup
  const userPayments = payments?.filter(p => p.uid === userData.uid).sort((a,b) => b.createdAt - a.createdAt) || [];
  const pendingPayment = userPayments.find(p => p.status === 'pending');

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setShowPayment(true);
  };

  const getDaysRemaining = () => {
    if (!userData?.subscriptionExpiry) return 0;
    const expiry = userData.subscriptionExpiry.toDate();
    const diffTime = expiry - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isActive = userData?.isActive && userData?.plan !== 'none';
  const displayPackages = packages?.filter(p => p.isVisible).sort((a,b) => a.order - b.order) || [];

  return (
    <div className="animation-fade-in">
      <h2 className="text-white fw-bold mb-4">Subscription Plan</h2>

      {pendingPayment && (
        <div className="announcement-banner border-warning bg-warning bg-opacity-10 mb-4 rounded d-flex align-items-center">
          <i className="fa-solid fa-clock text-warning mt-1 me-3 fs-4"></i>
          <div>
            <h6 className="text-white fw-bold mb-1">Payment Verification in Progress</h6>
            <p className="text-secondary small mb-0">We are currently verifying your payment for the <strong>{pendingPayment.packageName}</strong> plan. This usually takes 1-2 hours.</p>
          </div>
        </div>
      )}

      {/* Current Plan Details */}
      <GlassCard className="p-4 p-md-5 mb-5 border-cyan" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
        <div className="row align-items-center">
          <div className="col-12 col-md-6 mb-4 mb-md-0">
            <div className="text-muted small text-uppercase fw-bold mb-2">Current Status</div>
            <div className="d-flex align-items-center gap-3 mb-3">
              <h1 className="text-white fw-bold mb-0 text-capitalize">{userData?.plan === 'none' ? 'Free Plan' : userData?.plan}</h1>
              {isActive ? (
                <span className="badge-active bg-success bg-opacity-25 text-success border-success">Active</span>
              ) : (
                <span className="badge-active bg-danger bg-opacity-25 text-danger border-danger">Inactive</span>
              )}
            </div>
            {isActive && (
              <p className="text-secondary mb-0">
                Your subscription expires on <strong>{userData.subscriptionExpiry?.toDate().toLocaleDateString()}</strong> 
                ({getDaysRemaining()} days remaining).
              </p>
            )}
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            <button className="btn-ghost text-secondary border-secondary">
              <i className="fa-solid fa-clock-rotate-left me-2"></i> Billing History
            </button>
            <button className="btn-gradient" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
              <i className="fa-solid fa-arrow-up-right-dots me-2"></i> Upgrade Plan
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Available Plans */}
      <h4 className="text-white fw-bold mb-4">Available Packages</h4>
      {loading ? (
        <div className="d-flex justify-content-center pt-4"><div className="spinner"></div></div>
      ) : (
        <div className="row g-4 mb-5">
          {displayPackages.map((pkg, idx) => (
            <div className="col-12 col-md-6 col-lg-4" key={pkg.id}>
              <PricingCard 
                pkg={pkg} 
                isLoggedIn={true} 
                onSelect={() => handleSelectPackage(pkg)} 
              />
            </div>
          ))}
        </div>
      )}

      {/* Billing History Table */}
      <h4 className="text-white fw-bold mb-4">Recent Invoices</h4>
      <GlassCard className="p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="data-table mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No billing history found.</td>
                </tr>
              ) : (
                userPayments.slice(0, 5).map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                    <td className="text-white fw-bold">{payment.packageName}</td>
                    <td>LKR {payment.amount}</td>
                    <td className="text-capitalize">{payment.method}</td>
                    <td>
                      {payment.status === 'approved' && <span className="text-success"><i className="fa-solid fa-check-circle me-1"></i> Paid</span>}
                      {payment.status === 'pending' && <span className="text-warning"><i className="fa-solid fa-clock me-1"></i> Pending</span>}
                      {payment.status === 'rejected' && <span className="text-danger"><i className="fa-solid fa-xmark-circle me-1"></i> Rejected</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <PaymentModal 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        packageData={selectedPkg}
        siteSettings={config}
      />
    </div>
  );
};

export default MyPlan;
