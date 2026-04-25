import React, { useState } from 'react';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { updateDocument, getDocument, deleteDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';
import { logActivity } from '../../hooks/useActivityLog';
import { xuiAddClient } from '../../utils/xuiApi';

const StatusBadge = ({ status }) => {
  const config = {
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    pending:  'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  const icons = { approved: 'fa-check-circle', pending: 'fa-clock', rejected: 'fa-xmark-circle' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config[status] || config.pending}`}>
      <i className={`fa-solid ${icons[status] || 'fa-clock'} text-[10px]`}></i>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Payments = () => {
  const { data: payments, loading } = useRealtimeCollection('payments');
  const [filter, setFilter] = useState('pending');
  const [selectedProof, setSelectedProof] = useState(null);
  const [processing, setProcessing] = useState(null);

  const filteredPayments = [...(payments || [])]
    .filter(p => filter === 'all' || p.status === filter)
    .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));

  const handleAction = async (paymentId, status, uid, packageName, amount, durationDays) => {
    setProcessing(paymentId);
    try {
      await updateDocument('payments', paymentId, { status });
      if (status === 'approved') {
        const userDoc = await getDocument('users', uid);
        if (userDoc) {
          const currentExpiry = userDoc.subscriptionExpiry ? userDoc.subscriptionExpiry.toDate() : new Date();
          const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()));
          newExpiry.setDate(newExpiry.getDate() + Number(durationDays || 30));
          let newSubId = null;

          // Attempt to auto-provision in X-UI if enabled
          try {
            // We use inbound ID 1 as default for auto-provisioning. 
            // In a more complex setup, you could map packages to inbounds.
            const result = await xuiAddClient('1', userDoc.email, 0, newExpiry.getTime(), 0, true);
            if (result && result.success && result.subId) {
              newSubId = result.subId;
              showToast.success('User auto-provisioned in X-UI.');
            }
          } catch (xuiErr) {
            console.warn('X-UI Auto-provision skipped or failed:', xuiErr);
            // Non-fatal error, continue with approval
          }

          const updateData = {
            plan: packageName.toLowerCase(),
            isActive: true,
            paymentStatus: 'paid',
            subscriptionExpiry: newExpiry,
            planDurationDays: Number(durationDays || 30),
          };
          if (newSubId) {
            updateData.subscriptionId = newSubId;
            updateData.inboundId = '1';
          }

          await updateDocument('users', uid, updateData);
        }
        await logActivity('payment', `Payment of LKR ${amount} for "${packageName}" approved for UID: ${uid?.slice(0,8)}...`, 'success');
        showToast.success('Payment approved and user plan activated!');
      } else {
        await logActivity('payment', `Payment for "${packageName}" rejected for UID: ${uid?.slice(0,8)}...`, 'danger');
        showToast.error('Payment rejected.');
      }
    } catch (err) {
      showToast.error('Failed to process payment.');
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment record? This action cannot be undone.')) return;
    try {
      await deleteDocument('payments', id);
      showToast.success('Payment record deleted.');
    } catch {
      showToast.error('Failed to delete record.');
    }
  };

  const handleDeleteMonth = async () => {
    const month = window.prompt('Enter the Month and Year to clear (e.g. "April 2024") or leave empty to cancel:');
    if (!month) return;

    const toDelete = (payments || []).filter(p => {
      const d = p.createdAt?.toDate?.();
      if (!d) return false;
      const mStr = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      return mStr.toLowerCase() === month.toLowerCase();
    });

    if (toDelete.length === 0) {
      showToast.error(`No records found for "${month}".`);
      return;
    }

    if (!window.confirm(`Found ${toDelete.length} records for ${month}. Delete all of them permanently?`)) return;

    try {
      setProcessing('bulk');
      for (const p of toDelete) {
        await deleteDocument('payments', p.id);
      }
      showToast.success(`Successfully cleared ${toDelete.length} records for ${month}.`);
    } catch {
      showToast.error('Failed during bulk deletion.');
    } finally {
      setProcessing(null);
    }
  };

  const filters = ['pending', 'approved', 'rejected', 'all'];

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Manual Payments</h1>
            <p className="text-slate-500 text-sm">Review and verify user-submitted payment proofs.</p>
          </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteMonth}
                disabled={processing === 'bulk'}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
                title="Bulk Delete by Month"
              >
                {processing === 'bulk' ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-eraser"></i>}
                Clear Month
              </button>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f
                      ? 'bg-brand-primary text-brand-bg shadow-[0_0_15px_rgba(255,106,0,0.3)]'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {f}
                  {f !== 'all' && (
                    <span className="ml-1.5 opacity-70">
                      ({payments?.filter(p => p.status === f).length || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <i className="fa-solid fa-inbox text-3xl mb-3 block"></i>
              <p className="text-sm">No {filter === 'all' ? '' : filter} payments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Package / Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {payment.createdAt?.toDate?.().toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-white text-xs font-medium truncate max-w-[120px]" title={payment.userEmail}>{payment.userEmail || 'N/A'}</div>
                        <div className="text-[10px] text-slate-600 font-mono">{payment.uid?.slice(0, 8)}...</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-brand-glow text-xs">{payment.reference || '—'}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white">{payment.packageName}</div>
                        <div className="text-xs text-slate-500">LKR {payment.amount}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 capitalize text-xs">{payment.method}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={payment.status} /></td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {payment.proofBase64 && (
                            <button
                              onClick={() => setSelectedProof(payment.proofBase64)}
                              className="p-1.5 rounded-lg bg-brand-glow/10 text-brand-glow border border-brand-glow/20 hover:bg-brand-glow/20 transition-colors text-xs"
                              title="View Proof"
                            >
                              <i className="fa-solid fa-image"></i>
                            </button>
                          )}
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(payment.id, 'approved', payment.uid, payment.packageName, payment.amount, payment.durationDays)}
                                disabled={processing === payment.id}
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-xs disabled:opacity-50"
                                title="Approve"
                              >
                                {processing === payment.id ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-check"></i>}
                              </button>
                              <button
                                onClick={() => handleAction(payment.id, 'rejected', payment.uid, payment.packageName, payment.amount, payment.durationDays)}
                                disabled={processing === payment.id}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs disabled:opacity-50"
                                title="Reject"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(payment.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-500 border border-slate-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 transition-all text-xs"
                            title="Delete Record"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Proof Modal moved outside transformed container */}
      {selectedProof && (
        <div
          className="fixed inset-0 z-[70] flex p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedProof(null)}
        >
          <div className="relative max-w-4xl w-full m-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all shadow-xl hover:scale-110"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <div className="bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
              <img src={selectedProof} alt="Payment Proof" className="w-full rounded-xl max-h-[85vh] object-contain mx-auto" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;
