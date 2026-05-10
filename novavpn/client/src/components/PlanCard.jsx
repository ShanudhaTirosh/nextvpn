import { useRef } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PlanCard({ plan, highlighted = false }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMouseMove = (e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  };

  const handleBuy = () => {
    if (!user) {
      // Trigger Google sign-in via redirect with intent
      sessionStorage.setItem('buyPlanId', plan.id);
      navigate('/plans?signin=1');
    } else {
      navigate(`/checkout?planId=${plan.id}`);
    }
  };

  const accentColor = highlighted ? '#7c3aed' : '#06b6d4';
  const glowColor = highlighted ? 'rgba(124,58,237,0.25)' : 'rgba(6,182,212,0.15)';

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        background: 'rgba(10,10,26,0.8)',
        border: highlighted
          ? '1px solid rgba(124,58,237,0.5)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '32px 28px',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: highlighted
          ? `0 0 40px ${glowColor}, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 4px 24px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
        cursor: 'default',
        willChange: 'transform',
      }}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #7c3aed, #f472b6)',
          borderRadius: '9999px',
          padding: '4px 14px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap',
        }}>
          <Sparkles size={10} /> {plan.badge}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
          {plan.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{
            fontSize: '38px',
            fontWeight: 800,
            background: `linear-gradient(135deg, ${accentColor}, #a78bfa)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Rs.{plan.price}
          </span>
          <span style={{ fontSize: '14px', color: '#64748b' }}>/{plan.duration}d</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
        marginBottom: '20px',
      }} />

      {/* Specs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={specStyle}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data</span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{plan.dataLimitGB} GB</span>
        </div>
        <div style={specStyle}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Duration</span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{plan.duration} Days</span>
        </div>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(plan.features || []).map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#94a3b8' }}>
            <span style={{
              width: 18, height: 18,
              borderRadius: '50%',
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Check size={10} color={accentColor} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={handleBuy}
        style={{
          width: '100%',
          padding: '13px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '15px',
          color: '#fff',
          background: highlighted
            ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
            : `linear-gradient(135deg, ${accentColor}20, ${accentColor}40)`,
          boxShadow: highlighted ? `0 4px 20px ${glowColor}` : 'none',
          border: highlighted ? 'none' : `1px solid ${accentColor}40`,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Get Started →
      </button>
    </div>
  );
}

const specStyle = {
  display: 'flex', flexDirection: 'column', gap: '2px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  padding: '8px 12px',
  flex: 1,
};
