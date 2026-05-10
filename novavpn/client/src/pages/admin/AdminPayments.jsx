import { useEffect, useState } from 'react';
import { doc, updateDoc, serverTimestamp, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, push } from 'firebase/database';
import { db, rtdb } from '../../firebase';
import { Check, X, Eye, Loader } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleAction = async (payment, action) => {
    setActionLoading(payment.id + action);
    try {
      await updateDoc(doc(db, 'payments', payment.id), {
        status: action,
        adminNote: adminNote.trim(),
        reviewedAt: serverTimestamp(),
      });
      await push(ref(rtdb, 'notifications/' + payment.uid), {
        type: action === 'approved' ? 'payment_approved' : 'payment_rejected',
        message: action === 'approved'
          ? 'Your payment for ' + payment.planName + ' has been approved!'
          : 'Your payment for ' + payment.planName + ' was rejected. ' + (adminNote || 'Please contact support.'),
        read: false,
        timestamp: Date.now(),
      });
      if (action === 'approved') {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        await updateDoc(doc(db, 'users', payment.uid), {
          planId: payment.planId,
          planName: payment.planName,
          status: 'active',
          planExpiry: expiryDate,
          updatedAt: serverTimestamp(),
        });
      }
      setSelected(null);
      setAdminNote('');
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
    setActionLoading('');
  };

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  const sColor = (s) => s === 'approved' ? '#34d399' : s === 'rejected' ? '#fb7185' : '#f59e0b';

  return (
    <div>
      <h2 style={pageTitle}>Payments</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: filter === f ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
            border: filter === f ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.07)',
            color: filter === f ? '#a78bfa' : '#64748b',
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '11px' }}>
                {payments.filter(p => p.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={glassCard}>
        {loading ? (
          [1,2,3].map(i => <div key={i} style={{ height: 48, borderRadius: '10px', background: 'rgba(255,255,255,0.04)', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />)
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#475569', fontSize: '14px' }}>No {filter !== 'all' ? filter : ''} payments.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {['User', 'Plan', 'Method', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px', color: '#94a3b8', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.userEmail}</td>
                    <td style={{ padding: '14px', color: '#f1f5f9', fontWeight: 500 }}>{p.planName}</td>
                    <td style={{ padding: '14px', color: '#64748b' }}>{p.method ? p.method.toUpperCase() : '-'}</td>
                    <td style={{ padding: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>{p.createdAt && p.createdAt.toDate ? p.createdAt.toDate().toLocaleDateString() : '-'}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, background: sColor(p.status) + '18', color: sColor(p.status) }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => { setSelected(p); setAdminNote(p.adminNote || ''); }} style={{ width: 28, height: 28, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(6,182,212,0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Eye size={12} />
                        </button>
                        {p.status === 'pending' && (
                          <>
                            <button onClick={() => handleAction(p, 'approved')} disabled={!!actionLoading} style={{ width: 28, height: 28, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(52,211,153,0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {actionLoading === p.id + 'approved' ? <Loader size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Check size={12} />}
                            </button>
                            <button onClick={() => handleAction(p, 'rejected')} disabled={!!actionLoading} style={{ width: 28, height: 28, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(251,113,133,0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {actionLoading === p.id + 'rejected' ? <Loader size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <X size={12} />}
                            </button>
                          </>
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

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setSelected(null)}>
          <div style={{ width: 'min(480px, 100%)', background: 'rgba(10,10,26,0.98)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>Payment Detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', fontSize: '13px' }}>
              {[['User', selected.userEmail], ['Plan', selected.planName], ['Method', selected.method ? selected.method.toUpperCase() : '-'], ['Status', selected.status]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#64748b' }}>{l}</span>
                  <span style={{ color: '#f1f5f9', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            {selected.proofBase64 && (
              <img src={'data:image/jpeg;base64,' + selected.proofBase64} alt="proof" style={{ width: '100%', borderRadius: '12px', maxHeight: '220px', objectFit: 'contain', background: '#0a0a1a', marginBottom: '16px' }} />
            )}
            {selected.status === 'pending' && (
              <>
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Optional note to user..." rows={2} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button onClick={() => handleAction(selected, 'approved')} disabled={!!actionLoading} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: '14px', background: 'linear-gradient(135deg, #059669, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Check size={13} /> Approve
                  </button>
                  <button onClick={() => handleAction(selected, 'rejected')} disabled={!!actionLoading} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: '14px', background: 'linear-gradient(135deg, #be123c, #fb7185)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <X size={13} /> Reject
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <style>{'@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:0.9} }'}</style>
    </div>
  );
}

const pageTitle = { fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '24px' };
const glassCard = { background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' };
