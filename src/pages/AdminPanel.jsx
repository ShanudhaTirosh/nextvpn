import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Overview from './admin/Overview';
import Users from './admin/Users';
import Payments from './admin/Payments';
import Servers from './admin/Servers';
import Packages from './admin/Packages';
import Settings from './admin/Settings';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useAuth();
  const location = useLocation();

  const adminNav = [
    { name: 'Overview', path: '/admin/overview', icon: 'fa-chart-pie' },
    { name: 'Payments', path: '/admin/payments', icon: 'fa-money-bill-transfer' },
    { name: 'Users', path: '/admin/users', icon: 'fa-users' },
    { name: 'Servers', path: '/admin/servers', icon: 'fa-server' },
    { name: 'Packages', path: '/admin/packages', icon: 'fa-box-open' },
    { name: 'Settings', path: '/admin/settings', icon: 'fa-gears' },
  ];

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ borderRightColor: 'var(--accent-purple)' }}>
        <div className="portal-sidebar-header">
          <Link to="/" className="text-decoration-none d-flex align-items-center">
            <i className="fa-solid fa-crown fs-4 text-warning me-2"></i>
            <span className="fw-bold text-white fs-5">Admin <span className="gradient-text">Panel</span></span>
          </Link>
          <button className="btn btn-link text-white d-md-none" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark fs-4"></i>
          </button>
        </div>

        <div className="px-3 mb-4">
          <div className="glass-card p-3 d-flex align-items-center gap-3 bg-warning bg-opacity-10 border-warning">
            <img 
              src={userData?.photoBase64 || 'https://placehold.co/40x40/121826/00E5FF?text=U'}
              alt="Avatar" 
              className="rounded-circle border border-warning" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
            <div className="overflow-hidden">
              <div className="text-warning fw-bold text-truncate">{userData?.displayName || 'Admin'}</div>
              <div className="badge-protocol bg-warning bg-opacity-25 text-warning border-warning" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                System Admin
              </div>
            </div>
          </div>
        </div>

        <nav className="portal-nav px-3 flex-grow-1">
          <div className="text-muted small text-uppercase fw-bold mb-2 px-2">Management</div>
          {adminNav.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`portal-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`fa-solid ${item.icon} me-3`}></i> {item.name}
            </Link>
          ))}

          <div className="text-muted small text-uppercase fw-bold mb-2 px-2 mt-4">System</div>
          <Link to="/portal/dashboard" className="portal-nav-link text-info">
            <i className="fa-solid fa-arrow-left me-3"></i> Client Portal
          </Link>
          <Link to="/" className="portal-nav-link text-info">
            <i className="fa-solid fa-globe me-3"></i> View Website
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="portal-main bg-dark">
        {/* Mobile Header */}
        <div className="portal-topbar d-md-none border-bottom border-secondary bg-primary">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link text-white p-0" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars fs-4"></i>
            </button>
            <span className="fw-bold text-warning">Admin Console</span>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="portal-content">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="users" element={<Users />} />
            <Route path="payments" element={<Payments />} />
            <Route path="servers" element={<Servers />} />
            <Route path="packages" element={<Packages />} />
            <Route path="settings" element={<Settings />} />
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

export default AdminPanel;
