import React from 'react';
import GlassCard from './GlassCard';
import ProtocolBadge from './ProtocolBadge';

const LocationCard = ({ server, onClick }) => {
  const isFull = server.activeUsers >= server.maxUsers;
  const usagePercentage = Math.round((server.activeUsers / server.maxUsers) * 100) || 0;

  return (
    <div className="reveal-on-scroll h-full" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <GlassCard className="location-card glass-card h-full flex flex-col p-5 group transition-all duration-500 hover:border-brand-primary/40">
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
                  <span className="text-white font-bold text-[10px] uppercase tracking-widest">Online</span>
                  <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(255,106,0,0.8)] animate-pulse"></span>
                </>
              ) : (
                <>
                  <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Offline</span>
                  <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                </>
              )}
            </div>
            <ProtocolBadge protocol={server.protocol} />
          </div>
        </div>

        <div className="location-stats">
          <div className="d-flex align-items-center gap-1">
            <i className="fa-solid fa-bolt text-brand-primary"></i> 
            <span className="text-white/80 font-bold">{server.latencyMs}ms</span>
          </div>
          <div className="d-flex align-items-center gap-1 ms-auto">
            <i className="fa-solid fa-users text-muted"></i>
            <span className={isFull ? 'text-danger' : 'text-white'}>
              {server.activeUsers} <span className="text-muted">/ {server.maxUsers}</span>
            </span>
          </div>
        </div>

        <div className="w-full h-1 bg-brand-bg rounded-full mt-auto mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-primary to-brand-glow transition-all duration-1000" 
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>

        <div className="d-flex flex-wrap gap-1 mt-2">
          {server.isDDoSProtected && (
            <div className="badge-active justify-content-center" style={{ fontSize: '0.7rem' }}>
              <i className="fa-solid fa-shield-halved"></i> DDoS Protected
            </div>
          )}
          {server.features && Array.isArray(server.features) && server.features.map((feat, i) => (
            <div key={i} className="badge-active justify-content-center" style={{ fontSize: '0.7rem' }}>
              <i className="fa-solid fa-check"></i> {feat}
            </div>
          ))}
          {server.features && typeof server.features === 'string' && server.features.split(',').map((feat, i) => (
            <div key={i} className="badge-active justify-content-center" style={{ fontSize: '0.7rem' }}>
              <i className="fa-solid fa-check"></i> {feat.trim()}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default LocationCard;
