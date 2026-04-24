import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import GlassCard from '../../components/GlassCard';
import { useCollection } from '../../hooks/useFirestore';
import { updateDocument, getDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const Payments = () => {
  const { data: payments, loading } = useCollection('payments');
  const [filter, setFilter] = useState('pending');
  const [selectedProof, setSelectedProof] = useState(null);

  const filteredPayments = payments?.filter(p => filter === 'all' || p.status === filter).sort((a,b) => b.createdAt - a.createdAt) || [];

  const handleAction = async (paymentId, status, uid, packageName) => {
    try {
      await updateDocument('payments', paymentId, { status });
      
      if (status === 'approved') {
        // Find user and update their plan and expiry
        const userDoc = await getDocument('users', uid);
        if (userDoc) {
          const currentExpiry = userDoc.subscriptionExpiry ? userDoc.subscriptionExpiry.toDate() : new Date();
          const newExpiry = new Date(currentExpiry);
          newExpiry.setDate(newExpiry.getDate() + 30); // Add 30 days
          
          await updateDocument('users', uid, {
            plan: packageName.toLowerCase(),
            isActive: true,
            paymentStatus: 'paid',
            subscriptionExpiry: newExpiry
          });
        }
        showToast.success("Payment approved and user plan updated!");
      } else {
        showToast.error("Payment rejected.");
      }
    } catch (err) {
      showToast.error("Failed to process payment action.");
      console.error(err);
    }
  };

  return (
    <div className="animation-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold mb-1">Manual Payments</h2>
          <p className="text-secondary mb-0">Review user uploaded payment proofs.</p>
        </div>
        <div className="d-flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button 
              key={f}
              className={`btn btn-sm text-capitalize ${filter === f ? 'btn-gradient' : 'btn-ghost bg-dark border-secondary text-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5"><div className="spinner"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Package / Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th className="text-end">Action / Proof</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-5">No payments found.</td></tr>
                ) : (
                  filteredPayments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.createdAt?.toDate().toLocaleString() || 'N/A'}</td>
                      <td className="font-monospace text-warning small">{payment.reference}</td>
                      <td>
                        <div className="text-white fw-bold">{payment.packageName}</div>
                        <div className="text-secondary small">LKR {payment.amount}</div>
                      </td>
                      <td className="text-capitalize">{payment.method}</td>
                      <td>
                        {payment.status === 'approved' && <span className="badge-active bg-success bg-opacity-25 text-success border-success" style={{ fontSize: '0.65rem' }}>Approved</span>}
                        {payment.status === 'pending' && <span className="badge-active bg-warning bg-opacity-25 text-warning border-warning" style={{ fontSize: '0.65rem' }}>Pending</span>}
                        {payment.status === 'rejected' && <span className="badge-active bg-danger bg-opacity-25 text-danger border-danger" style={{ fontSize: '0.65rem' }}>Rejected</span>}
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-info me-2"
                          onClick={() => setSelectedProof(payment.proofBase64)}
                        >
                          <i className="fa-solid fa-image"></i>
                        </button>
                        
                        {payment.status === 'pending' && (
                          <>
                            <button 
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleAction(payment.id, 'approved', payment.uid, payment.packageName)}
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleAction(payment.id, 'rejected', payment.uid, payment.packageName)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Proof Viewer Modal */}
      <Modal show={!!selectedProof} onHide={() => setSelectedProof(null)} centered size="lg" contentClassName="bg-transparent border-0">
        <div className="glass-card position-relative p-2 text-center">
          <button 
            className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3" 
            onClick={() => setSelectedProof(null)}
          ></button>
          <img src={selectedProof} alt="Payment Proof" className="img-fluid rounded" style={{ maxHeight: '80vh' }} />
        </div>
      </Modal>
    </div>
  );
};

export default Payments;
