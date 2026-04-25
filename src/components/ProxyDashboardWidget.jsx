import React, { useEffect, useState } from 'react';
import GlassCard from './GlassCard';

const ProxyDashboardWidget = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => {
      setProgress(47.6);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GlassCard className="proxy-widget widget-float">
      {/* Header */}
      <div className="proxy-widget-header">
        <div className="mac-dots">
          <span className="red"></span>
          <span className="yellow"></span>
          <span className="green"></span>
        </div>
        <div className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>Proxy Dashboard</div>
        <div className="badge-active px-2 py-1" style={{ fontSize: '0.65rem' }}>
          <span className="pulse-dot"></span> Active
        </div>
      </div>

      <div className="proxy-widget-body">
        {/* Connected Card */}
        <div className="connected-card">
          <div className="connected-left">
            <div className="shield-circle">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <div className="fw-bold text-white mb-0" style={{ fontSize: '0.9rem' }}>Connected</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Singapore Server</div>
            </div>
          </div>
          <div className="text-end">
            <div className="text-white fw-bold mb-1" style={{ fontSize: '0.75rem' }}>Latency</div>
            <div className="badge-protocol" style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-lock me-1 text-muted"></i> AES-256
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stat-cards-row">
          <div className="mini-stat-card">
            <div className="mini-stat-label">
              <i className="fa-solid fa-arrow-down me-1"></i> Downloaded
            </div>
            <div className="mini-stat-value">1.24 GB</div>
            <div className="mini-stat-sub">This month</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-label" style={{ color: 'var(--accent-purple)' }}>
              <i className="fa-solid fa-arrow-up me-1"></i> Uploaded
            </div>
            <div className="mini-stat-value">321 MB</div>
            <div className="mini-stat-sub">This month</div>
          </div>
        </div>

        {/* Locations Pill */}
        <div className="text-center mb-3">
          <span className="badge-cyan py-2 px-3">
            <i className="fa-solid fa-globe me-2"></i> 5+ Regions Available
          </span>
        </div>

        {/* Bandwidth Section */}
        <div className="bandwidth-section">
          <div className="bandwidth-header">
            <div className="text-white" style={{ fontSize: '0.85rem' }}>Bandwidth</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>143 GB / 300 GB</div>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>47.6%</div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="widget-btn-row">
          <button className="btn-gradient w-100 justify-content-center" style={{ padding: '8px' }}>
            <i className="fa-solid fa-code"></i> Get Config
          </button>
          <button className="btn-ghost w-100 justify-content-center" style={{ padding: '8px', color: 'var(--text-secondary)', borderColor: 'var(--glass-border)' }}>
            <i className="fa-solid fa-server"></i> Servers
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProxyDashboardWidget;
