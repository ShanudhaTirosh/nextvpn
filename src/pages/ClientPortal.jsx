import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Dashboard from './portal/Dashboard';
import MyPlan from './portal/MyPlan';
import Profile from './portal/Profile';
import Tutorials from './portal/Tutorials';

const ClientPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData, logOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/portal/dashboard', icon: 'fa-table-columns' },
    { name: 'My Plan', path: '/portal/plan', icon: 'fa-id-card' },
    { name: 'Tutorials', path: '/portal/tutorials', icon: 'fa-book-open' },
    { name: 'Profile Settings', path: '/portal/profile', icon: 'fa-user-gear' },
  ];

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="portal-sidebar-header">
          <Link to="/" className="text-decoration-none d-flex align-items-center">
            <i className="fa-solid fa-shield-halved fs-4 text-cyan me-2" style={{ color: 'var(--accent-cyan)' }}></i>
            <span className="fw-bold text-white fs-5">ShiftLK <span className="gradient-text">Netch</span></span>
          </Link>
          <button className="btn btn-link text-white d-md-none" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark fs-4"></i>
          </button>
        </div>

        <div className="px-3 mb-4">
          <div className="glass-card p-3 d-flex align-items-center gap-3 bg-secondary bg-opacity-25">
            <img 
              src={userData?.photoBase64 || 'https://placehold.co/40x40/121826/00E5FF?text=U'}
              alt="Avatar" 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
            <div className="overflow-hidden">
              <div className="text-white fw-bold text-truncate">{userData?.displayName || 'User'}</div>
              <div className="badge-protocol" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                {userData?.plan === 'none' ? 'Free User' : `${userData?.plan} Plan`}
              </div>
            </div>
          </div>
        </div>

        <nav className="portal-nav px-3 flex-grow-1">
          <div className="text-muted small text-uppercase fw-bold mb-2 px-2">Menu</div>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`portal-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`fa-solid ${item.icon} me-3`}></i> {item.name}
            </Link>
          ))}

          <div className="text-muted small text-uppercase fw-bold mb-2 px-2 mt-4">Support</div>
          <Link to="/contact" className="portal-nav-link" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-headset me-3"></i> Contact Support
          </Link>
          <a href="https://t.me/ShiftLK_Support" target="_blank" rel="noreferrer" className="portal-nav-link">
            <i className="fa-brands fa-telegram me-3 text-primary"></i> Telegram Group
          </a>
        </nav>

        <div className="p-3 mt-auto">
          <button className="btn-danger w-100 justify-content-center" onClick={logOut}>
            <i className="fa-solid fa-right-from-bracket me-2"></i> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="portal-main">
        {/* Mobile Header */}
        <div className="portal-topbar d-md-none">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link text-white p-0" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars fs-4"></i>
            </button>
            <span className="fw-bold text-white">Client Portal</span>
          </div>
          <img 
            src={userData?.photoBase64 || 'https://placehold.co/32x32/121826/00E5FF?text=U'}
            alt="Avatar" 
            className="rounded-circle" 
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
        </div>

        {/* Content Wrapper */}
        <div className="portal-content">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="plan" element={<MyPlan />} />
            <Route path="profile" element={<Profile />} />
            <Route path="tutorials" element={<Tutorials />} />
          </Routes>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-2 d-md-none"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ClientPortal;
