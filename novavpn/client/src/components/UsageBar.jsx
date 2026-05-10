import { ArrowUp, ArrowDown, Wifi } from 'lucide-react';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export default function UsageBar({ usage, loading }) {
  if (loading) {
    return (
      <div style={cardStyle}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.05)', marginBottom: 12, animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  if (!usage) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}>
        <Wifi size={32} color="#334155" style={{ marginBottom: '12px' }} />
        <p style={{ fontSize: '14px', color: '#64748b' }}>No usage data available</p>
        <p style={{ fontSize: '12px', color: '#475569' }}>UUID not assigned yet</p>
      </div>
    );
  }

  const used = (usage.upload || 0) + (usage.download || 0);
  const total = usage.total || 0;
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const remaining = Math.max(total - used, 0);

  const barColor = pct > 85 ? '#f472b6' : pct > 60 ? '#f59e0b' : '#34d399';

  return (
    <div style={cardStyle}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <StatChip icon={<ArrowUp size={12} />} label="Upload" value={formatBytes(usage.upload)} color="#7c3aed" />
        <StatChip icon={<ArrowDown size={12} />} label="Download" value={formatBytes(usage.download)} color="#06b6d4" />
        <StatChip icon={<Wifi size={12} />} label="Remaining" value={formatBytes(remaining)} color={barColor} />
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '12px', color: '#64748b', marginBottom: '8px',
        }}>
          <span>{formatBytes(used)} used</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div style={{
          height: '8px', borderRadius: '9999px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '9999px',
            background: `linear-gradient(90deg, ${barColor}, ${barColor}99)`,
            transition: 'width 0.6s ease',
            boxShadow: `0 0 8px ${barColor}60`,
          }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#475569', marginTop: '4px' }}>
          of {formatBytes(total)} total
        </div>
      </div>

      {usage.expiryTime && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.03)',
          fontSize: '12px',
          color: '#64748b',
        }}>
          ⏱ Expires: {new Date(usage.expiryTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  );
}

function StatChip({ icon, label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: '100px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color }}>
        {icon}
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
    </div>
  );
}

const cardStyle = {
  background: 'rgba(10,10,26,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '20px',
};
