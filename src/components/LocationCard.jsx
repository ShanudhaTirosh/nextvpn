import React from 'react';
import GlassCard from './GlassCard';
import ProtocolBadge from './ProtocolBadge';

const LocationCard = ({ server, onClick }) => {
  const isFull = server.activeUsers >= server.maxUsers;
  const usagePercentage = Math.round((server.activeUsers / server.maxUsers) * 100) || 0;

  return (
    <div className="reveal-on-scroll h-100" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <GlassCard className="location-card h-100 d-flex flex-column">
        <div className="location-card-top">
          <div className="d-flex align-items-center">
            <span className="location-flag">{server.flagEmoji || '🌐'}</span>
            <div className="location-info">
              <div className="location-name text-white">{server.name}</div>
              <div className="location-city">{server.country}</div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end">
            <div className="d-flex align-items-center gap-2 mb-2">
              {server.isOnline ? (
                <>
                  <span className="text-white" style={{ fontSize: '0.8rem' }}>Online</span>
                  <span className="online-dot"></span>
                </>
              ) : (
                <>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>Offline</span>
                  <span className="online-dot" style={{ background: 'var(--accent-red)', boxShadow: 'none' }}></span>
                </>
              )}
            </div>
            <ProtocolBadge protocol={server.protocol} />
          </div>
        </div>

        <div className="location-stats">
          <div className="d-flex align-items-center gap-1">
            <i className="fa-solid fa-bolt text-warning"></i> 
            <span>{server.latencyMs}ms</span>
          </div>
          <div className="d-flex align-items-center gap-1 ms-auto">
            <i className="fa-solid fa-users text-muted"></i>
            <span className={isFull ? 'text-danger' : 'text-white'}>
              {server.activeUsers} <span className="text-muted">/ {server.maxUsers}</span>
            </span>
          </div>
        </div>

        <div className="progress-track mt-auto mb-3" style={{ height: '6px' }}>
          <div 
            className="progress-fill" 
            style={{ 
              width: `${usagePercentage}%`, 
              background: isFull ? 'var(--accent-red)' : 'var(--gradient-btn)' 
            }}
          ></div>
        </div>

        {server.isDDoSProtected && (
          <div className="badge-active justify-content-center" style={{ fontSize: '0.7rem' }}>
            <i className="fa-solid fa-shield-halved"></i> DDoS Protected
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default LocationCard;
