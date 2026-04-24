import React from 'react';

const ProtocolBadge = ({ protocol }) => {
  const getProtocolConfig = (p) => {
    const proto = (p || '').toLowerCase();
    switch (proto) {
      case 'vmess':
        return { color: 'var(--accent-cyan)', bg: 'rgba(0,229,255,0.15)', icon: 'fa-network-wired' };
      case 'vless':
        return { color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.15)', icon: 'fa-shield-halved' };
      case 'trojan':
        return { color: 'var(--accent-purple)', bg: 'rgba(139,92,246,0.15)', icon: 'fa-horse' };
      case 'shadowsocks':
        return { color: 'var(--accent-green)', bg: 'rgba(34,197,94,0.15)', icon: 'fa-mask' };
      default:
        return { color: 'var(--text-secondary)', bg: 'var(--bg-panel)', icon: 'fa-link' };
    }
  };

  const config = getProtocolConfig(protocol);

  return (
    <span 
      className="badge-protocol" 
      style={{ 
        color: config.color, 
        backgroundColor: config.bg,
        borderColor: `rgba(${config.color.match(/\d+,\s*\d+,\s*\d+/)?.[0] || '255,255,255'}, 0.3)`
      }}
    >
      <i className={`fa-solid ${config.icon} me-1`}></i> {protocol}
    </span>
  );
};

export default ProtocolBadge;
