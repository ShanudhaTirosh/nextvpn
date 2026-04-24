import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCollection } from '../../hooks/useFirestore';
import GlassCard from '../../components/GlassCard';
import LocationCard from '../../components/LocationCard';
import { showToast } from '../../components/Toast';
import SkeletonLoader from '../../components/SkeletonLoader';

const Dashboard = () => {
  const { userData } = useAuth();
  const { data: servers, loading } = useCollection('servers', []);
  const [selectedServer, setSelectedServer] = useState(null);

  const isActive = userData?.isActive && userData?.plan !== 'none';
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!userData?.subscriptionExpiry) return 0;
    const expiry = userData.subscriptionExpiry.toDate();
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCopyConfig = (server) => {
    if (!isActive) {
      showToast.error("You need an active plan to view configs.");
      return;
    }
    // In a real app, you'd generate a specific V2Ray link using the user's UUID
    // Here we just mock it.
    const mockConfig = `${server.protocol.toLowerCase()}://${btoa(`{"v":"2","ps":"ShiftLK-${server.name}","add":"${server.address}","port":"443","id":"${userData.uid}","aid":"0","net":"ws","type":"none","host":"","path":"/shiftlk","tls":"tls"}`)}`;
    
    navigator.clipboard.writeText(mockConfig);
    showToast.success(`Copied config for ${server.name}`);
  };

  return (
    <div className="animation-fade-in">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1">Dashboard</h2>
          <p className="text-secondary mb-0">Welcome back, {userData?.displayName || 'User'}</p>
        </div>
      </div>

      {!isActive && (
        <div className="announcement-banner border-danger bg-danger bg-opacity-10 mb-4 rounded">
          <i className="fa-solid fa-circle-exclamation text-danger mt-1"></i>
          <div>
            <h6 className="text-white fw-bold mb-1">No Active Plan</h6>
            <p className="text-secondary small mb-0">You currently do not have an active subscription. Please purchase a plan to access server configurations.</p>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <GlassCard className="p-4 h-100 position-relative overflow-hidden">
            <div className="hero-blob hero-blob-cyan" style={{ top: '-50%', right: '-50%', width: '150px', height: '150px' }}></div>
            <div className="text-muted small text-uppercase fw-bold mb-1 position-relative z-1">Current Plan</div>
            <h3 className="text-white fw-bold mb-3 position-relative z-1">{userData?.plan === 'none' ? 'Free' : userData?.plan}</h3>
            <div className="d-flex align-items-center gap-2 position-relative z-1">
              {isActive ? (
                <span className="badge-active bg-transparent border border-success"><span className="online-dot"></span> Active</span>
              ) : (
                <span className="badge-active bg-transparent border border-danger text-danger"><i className="fa-solid fa-xmark me-1"></i> Inactive</span>
              )}
            </div>
          </GlassCard>
        </div>
        <div className="col-12 col-md-4">
          <GlassCard className="p-4 h-100">
            <div className="text-muted small text-uppercase fw-bold mb-1">Days Remaining</div>
            <h3 className="text-white fw-bold mb-3">{getDaysRemaining()} <span className="fs-6 text-secondary fw-normal">days</span></h3>
            <div className="progress-track" style={{ height: '6px' }}>
              <div 
                className="progress-fill bg-info" 
                style={{ width: `${Math.min(100, (getDaysRemaining() / 30) * 100)}%` }}
              ></div>
            </div>
          </GlassCard>
        </div>
        <div className="col-12 col-md-4">
          <GlassCard className="p-4 h-100">
            <div className="text-muted small text-uppercase fw-bold mb-1">Total Data Used</div>
            <h3 className="text-white fw-bold mb-3">0.00 <span className="fs-6 text-secondary fw-normal">GB</span></h3>
            <p className="text-success small mb-0"><i className="fa-solid fa-infinity me-1"></i> Unlimited Bandwidth</p>
          </GlassCard>
        </div>
      </div>

      {/* Server List */}
      <h4 className="text-white fw-bold mb-3">Available Servers</h4>
      
      {loading ? (
        <div className="row g-4">
          {[1,2,3].map(i => <div className="col-12 col-md-6 col-lg-4" key={i}><SkeletonLoader type="card" /></div>)}
        </div>
      ) : servers.length === 0 ? (
        <GlassCard className="p-5 text-center">
          <i className="fa-solid fa-server fs-1 text-muted mb-3"></i>
          <h5 className="text-white">No servers available</h5>
          <p className="text-secondary">Please check back later.</p>
        </GlassCard>
      ) : (
        <div className="row g-4">
          {servers.map(server => (
            <div className="col-12 col-md-6 col-lg-4" key={server.id}>
              <div className="position-relative h-100">
                <LocationCard server={server} onClick={() => isActive && setSelectedServer(selectedServer === server.id ? null : server.id)} />
                
                {/* Config Overlay for Active Users */}
                {selectedServer === server.id && isActive && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 rounded-4 d-flex flex-column align-items-center justify-content-center p-4 animation-fade-in" style={{ backdropFilter: 'blur(4px)' }}>
                    <button className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={(e) => { e.stopPropagation(); setSelectedServer(null); }}></button>
                    <h6 className="text-white text-center mb-3">V2Ray Configuration</h6>
                    <button className="btn-gradient w-100 mb-2" onClick={(e) => { e.stopPropagation(); handleCopyConfig(server); }}>
                      <i className="fa-solid fa-copy me-2"></i> Copy Config Link
                    </button>
                    <button className="btn-ghost w-100 border-secondary" onClick={(e) => e.stopPropagation()}>
                      <i className="fa-solid fa-qrcode me-2"></i> Show QR Code
                    </button>
                  </div>
                )}
                
                {/* Overlay for Inactive Users */}
                {!isActive && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 rounded-4" style={{ cursor: 'not-allowed', zIndex: 10 }}></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
