import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { submitPayment } from '../services/paymentService';
import { postPaymentWebhook } from '../services/webhookService';
import ProofUploader from '../components/ProofUploader';
import { CreditCard, QrCode, Building2, ArrowLeft, Loader, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const [params] = useSearchParams();
  const planId = params.get('planId');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [plan, setPlan] = useState(null);
  const [method, setMethod] = useState('bank');
  const [proofBase64, setProofBase64] = useState(null);
  const [proofMime, setProofMime] = useState('image/jpeg');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!planId) { navigate('/plans'); return; }
    getDoc(doc(db, 'plans', planId)).then((snap) => {
      if (snap.exists()) setPlan({ id: snap.id, ...snap.data() });
      else navigate('/plans');
    });
  }, [planId]);

  const handleSubmit = async () => {
    if (!proofBase64) { setError('Please upload your payment screenshot.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const paymentId = await submitPayment({
        uid: user.uid,
        userEmail: user.email,
        planId: plan.id,
        planName: plan.name,
        method,
        proofBase64,
      });
      await postPaymentWebhook({
        userEmail: user.email,
        planName: plan.name,
        proofBase64,
        method,
        paymentId,
      });
      navigate(`/receipt?paymentId=${paymentId}`);
    } catch (err) {
      setError('Submission failed: ' + err.message);
    }
    setSubmitting(false);
  };

  if (!plan) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={spinnerStyle} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button onClick={() => navigate('/plans')} style={backBtn}>
          <ArrowLeft size={15} /> Back to Plans
        </button>

        <h1 style={pageTitle}>Complete Your Order</h1>

        {/* Plan summary */}
        <div style={{ ...glassCard, marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Selected Plan</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>{plan.name}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{plan.dataLimitGB} GB · {plan.duration} Days</div>
            </div>
            <div style={{
              fontSize: '32px', fontWeight: 800,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Rs.{plan.price}</div>
          </div>
        </div>

        {/* Payment method */}
        <div style={{ ...glassCard, marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', marginBottom: '14px' }}>Payment Method</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <MethodBtn label="Bank Transfer" icon={<Building2 size={16} />} selected={method === 'bank'} onClick={() => setMethod('bank')} />
            <MethodBtn label="QR Code" icon={<QrCode size={16} />} selected={method === 'qr'} onClick={() => setMethod('qr')} />
          </div>

          <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            {method === 'bank' ? (
              <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.8 }}>
                <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>Bank Transfer Details</div>
                <div><span style={{ color: '#64748b' }}>Bank:</span> Commercial Bank of Ceylon</div>
                <div><span style={{ color: '#64748b' }}>Account Name:</span> NovaVPN Services</div>
                <div><span style={{ color: '#64748b' }}>Account No:</span> 0000-0000-0000</div>
                <div><span style={{ color: '#64748b' }}>Branch:</span> Colombo 03</div>
                <div style={{ marginTop: '8px', padding: '8px', borderRadius: '8px', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', fontSize: '12px' }}>
                  ⚠️ Use your email as the payment reference
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                <div style={{ width: 120, height: 120, margin: '0 auto 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={48} color="#475569" />
                </div>
                QR code payment — scan and pay Rs.{plan.price}
              </div>
            )}
          </div>
        </div>

        {/* Proof upload */}
        <div style={{ ...glassCard, marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', marginBottom: '14px' }}>Upload Payment Screenshot</div>
          <ProofUploader
            value={proofBase64}
            onCapture={(b64, mime) => { setProofBase64(b64); if (mime) setProofMime(mime); }}
          />
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !proofBase64}
          style={{
            width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
            background: proofBase64 ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.06)',
            color: '#fff', fontWeight: 700, fontSize: '16px',
            cursor: proofBase64 ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <ShieldCheck size={16} />}
          {submitting ? 'Submitting...' : 'Submit Payment Proof'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#475569', marginTop: '14px' }}>
          Your plan will be activated within 30 minutes of confirmation
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function MethodBtn({ label, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
        background: selected ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
        border: selected ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
        color: selected ? '#a78bfa' : '#64748b',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
      }}
    >
      {icon} {label}
    </button>
  );
}

const glassCard = {
  background: 'rgba(10,10,26,0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '24px',
  backdropFilter: 'blur(12px)',
};

const backBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#64748b', fontSize: '14px', marginBottom: '28px',
  display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
};

const pageTitle = {
  fontSize: '28px', fontWeight: 800,
  background: 'linear-gradient(135deg, #f1f5f9, #a78bfa)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  marginBottom: '28px',
};

const spinnerStyle = {
  width: 32, height: 32, borderRadius: '50%',
  border: '3px solid rgba(124,58,237,0.3)',
  borderTopColor: '#7c3aed',
  animation: 'spin 0.8s linear infinite',
};
