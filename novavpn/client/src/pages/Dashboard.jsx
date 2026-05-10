import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, ExternalLink, ClipboardCopy, RefreshCw, PackageOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserPayments } from '../services/paymentService';
import { fetchClientUsage } from '../services/panelService';
import UsageBar from '../components/UsageBar';
import ChatWidget from '../components/ChatWidget';

function QRCodeDisplay({ text }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(text)}&bgcolor=0a0a1a&color=a78bfa&format=svg`;
  return <img src={url} alt="Config QR" style={{ borderRadius: '12px', background: '#0a0a1a', width: 150, height: 150 }} />;
}

export default function Dashboard() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [payments, setPayments] = useState([]);
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserPayments(user.uid).then(setPayments).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!userProfile?.uuid) return;
    setUsageLoading(true);
    fetchClientUsage(userProfile.uuid)
      .then(setUsage)
      .catch(console.error)
      .finally(() => setUsageLoading(false));
  }, [userProfile?.uuid]);

  const copyConfig = () => {
    if (!userProfile?.configString) return;
    navigator.clipboard.writeText(userProfile.configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const planStatus = userProfile?.status || 'none';
  const planExpiry = userProfile?.planExpiry?.toDate ? userProfile.planExpiry.toDate() : null;
  const isExpired = planExpiry && planExpiry < new Date();
  const statusColor = planStatus === 'active' && !isExpired ? '#34d399' : planStatus === 'none' ? '#64748b' : '#fb7185';

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
              Welcome back, {user?.displayName?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Manage your VPN subscription</p>
          </div>
          <button onClick={refreshProfile} style={iconBtn}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {/* Active plan card */}
          <div style={glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Current Plan</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9' }}>
                  {userProfile?.planId ? (userProfile.planName || userProfile.planId) : 'No Active Plan'}
                </div>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}40`,
              }}>
                {planStatus === 'active' && !isExpired ? '● Active' : planStatus === 'none' ? '○ None' : '✕ Expired'}
              </span>
            </div>
            {planExpiry && (
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {isExpired ? '⚠️ Expired:' : '⏱ Expires:'} {planExpiry.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            )}
            {planStatus === 'none' && (
              <Link to="/plans" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px',
                padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', textDecoration: 'none',
              }}>
                Browse Plans <ExternalLink size={13} />
              </Link>
            )}
          </div>

          {/* Config string card */}
          <div style={glassCard}>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Config String
            </div>
            {userProfile?.configString ? (
              <>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '12px', marginBottom: '14px',
                  fontSize: '11px', fontFamily: 'monospace', color: '#a78bfa',
                  wordBreak: 'break-all', maxHeight: '60px', overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userProfile.configString.slice(0, 80)}...
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={copyConfig} style={{ ...iconBtn, flex: 1 }}>
                    {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
                  <QRCodeDisplay text={userProfile.configString} />
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#475569', fontSize: '13px' }}>
                <ClipboardCopy size={28} style={{ marginBottom: '8px', opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                Config string will appear after plan activation
              </div>
            )}
          </div>
        </div>

        {/* Usage bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px' }}>Data Usage</div>
          <UsageBar usage={usage} loading={usageLoading} />
        </div>

        {/* Payment history */}
        <div style={glassCard}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', marginBottom: '20px' }}>Payment History</div>
          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#475569', fontSize: '13px' }}>
              <PackageOpen size={28} style={{ marginBottom: '8px', opacity: 0.3 }} />
              <p>No payments yet.</p>
              <Link to="/plans" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Browse plans →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {payments.map((p) => {
                const sColor = p.status === 'approved' ? '#34d399' : p.status === 'rejected' ? '#fb7185' : '#f59e0b';
                return (
                  <div key={p.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    flexWrap: 'wrap', gap: '8px',
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{p.planName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : '-'} · {p.method?.toUpperCase()}
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                      background: `${sColor}18`, color: sColor,
                    }}>
                      {p.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ChatWidget />
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

const iconBtn = {
  padding: '8px 14px', borderRadius: '9999px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#94a3b8', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '6px',
};
