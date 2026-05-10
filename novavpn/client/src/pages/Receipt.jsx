import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { listenPaymentStatus } from '../services/paymentService';
import { Clock, CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    icon: <Clock size={40} color="#f59e0b" />,
    title: 'Payment Under Review',
    subtitle: 'Your payment proof has been submitted. An admin will review it shortly.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  approved: {
    icon: <CheckCircle size={40} color="#34d399" />,
    title: 'Payment Approved! 🎉',
    subtitle: 'Your plan is now active. Head to your dashboard to get your config string.',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
  },
  rejected: {
    icon: <XCircle size={40} color="#fb7185" />,
    title: 'Payment Rejected',
    subtitle: 'Your payment was not approved. Please contact support or try again.',
    color: '#fb7185',
    bg: 'rgba(251,113,133,0.08)',
    border: 'rgba(251,113,133,0.2)',
  },
};

export default function Receipt() {
  const [params] = useSearchParams();
  const paymentId = params.get('paymentId');
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) { navigate('/'); return; }
    const unsub = listenPaymentStatus(paymentId, (data) => {
      setPayment(data);
      setLoading(false);
    });
    return unsub;
  }, [paymentId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={spinStyle} />
        <p style={{ color: '#64748b', marginTop: '16px', fontSize: '14px' }}>Loading receipt...</p>
      </div>
    </div>
  );

  if (!payment) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748b' }}>Payment not found.</p>
    </div>
  );

  const cfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Status card */}
        <div style={{
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <div style={{ marginBottom: '20px' }}>{cfg.icon}</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '12px' }}>{cfg.title}</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{cfg.subtitle}</p>

          {payment.status === 'pending' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
              <RefreshCw size={12} style={{ animation: 'spin 2s linear infinite' }} />
              Auto-refreshing...
            </div>
          )}

          {payment.adminNote && (
            <div style={{ marginTop: '20px', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#94a3b8', textAlign: 'left' }}>
              <span style={{ fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Admin Note:</span>
              {payment.adminNote}
            </div>
          )}
        </div>

        {/* Payment details */}
        <div style={{ ...glassCard, marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Order Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <DetailRow label="Plan" value={payment.planName} />
            <DetailRow label="Method" value={payment.method?.toUpperCase()} />
            <DetailRow label="Payment ID" value={payment.id?.slice(0, 16) + '...'} mono />
            <DetailRow
              label="Submitted"
              value={payment.createdAt?.toDate
                ? payment.createdAt.toDate().toLocaleString()
                : new Date().toLocaleString()}
            />
            <DetailRow label="Status" value={payment.status?.toUpperCase()} color={cfg.color} />
          </div>
        </div>

        {/* Proof image */}
        {payment.proofBase64 && (
          <div style={{ ...glassCard, marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>Uploaded Proof</div>
            <img
              src={`data:image/jpeg;base64,${payment.proofBase64}`}
              alt="Payment proof"
              style={{ width: '100%', borderRadius: '10px', maxHeight: '240px', objectFit: 'contain', background: '#0a0a1a' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          {payment.status === 'approved' && (
            <Link to="/dashboard" style={primaryBtn}>
              Go to Dashboard <ArrowRight size={15} />
            </Link>
          )}
          <Link to="/plans" style={secondaryBtn}>
            {payment.status === 'rejected' ? 'Try Again' : 'View Plans'}
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function DetailRow({ label, value, mono, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: color || '#f1f5f9', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

const glassCard = {
  background: 'rgba(10,10,26,0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '24px',
  backdropFilter: 'blur(12px)',
};

const spinStyle = {
  width: 36, height: 36, borderRadius: '50%',
  border: '3px solid rgba(124,58,237,0.2)',
  borderTopColor: '#7c3aed',
  animation: 'spin 0.8s linear infinite',
  margin: '0 auto',
};

const primaryBtn = {
  flex: 1, padding: '13px', borderRadius: '12px',
  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
  color: '#fff', fontWeight: 700, fontSize: '14px',
  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
};

const secondaryBtn = {
  flex: 1, padding: '13px', borderRadius: '12px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#94a3b8', fontWeight: 600, fontSize: '14px',
  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
