import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, Users, Package, Server,
  MessageSquare, Settings, Webhook, LogOut, Menu, X, Zap,
} from 'lucide-react';
import { signOutUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/plans', label: 'Plans', icon: Package },
  { to: '/admin/servers', label: 'Servers', icon: Server },
  { to: '/admin/chat', label: 'Chat', icon: MessageSquare },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
  { to: '/admin/webhooks', label: 'Webhooks', icon: Webhook },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutUser();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '230px', flexShrink: 0,
        background: 'rgba(5,2,20,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 999,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s',
      }} className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>NovaVPN</div>
              <div style={{ fontSize: '11px', color: '#7c3aed' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
                textDecoration: 'none',
                color: isActive ? '#a78bfa' : '#64748b',
                background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
                fontSize: '14px', fontWeight: 500,
                transition: 'all 0.15s',
              })}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src={user?.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.4)' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName}</div>
              <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600 }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            color: '#64748b', fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '230px', minHeight: '100vh', padding: '28px 28px', maxWidth: 'calc(100% - 230px)', overflowX: 'hidden' }} className="admin-main">
        {/* Mobile header */}
        <div style={{ display: 'none', alignItems: 'center', gap: '12px', marginBottom: '24px' }} className="mobile-header">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <Menu size={20} />
          </button>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>Admin Panel</span>
        </div>

        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0 !important; max-width: 100% !important; }
          .mobile-header { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
