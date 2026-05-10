import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { signInWithGoogle, signOutUser } from '../services/authService';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role } = useAuth();
  const { settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const nav = settings.navbar;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleAuth = async () => {
    if (user) {
      await signOutUser();
      navigate('/');
    } else {
      await signInWithGoogle();
    }
  };

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Plans', href: '/plans' },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    ...(role === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: scrolled ? '8px' : '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: scrolled ? 'min(720px, calc(100vw - 32px))' : 'min(900px, calc(100vw - 32px))',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          borderRadius: '9999px',
          background: scrolled ? 'rgba(3,0,20,0.85)' : 'rgba(3,0,20,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.15)' : 'none',
          padding: scrolled ? '8px 20px' : '12px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            {nav.logoBase64 ? (
              <img
                src={`data:image/png;base64,${nav.logoBase64}`}
                alt="logo"
                style={{ height: '28px', width: 'auto', borderRadius: '6px' }}
              />
            ) : (
              <div style={{
                width: 28, height: 28, borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={14} color="#fff" fill="#fff" />
              </div>
            )}
            <span style={{
              fontWeight: 700, fontSize: '16px', color: '#f1f5f9',
              background: 'linear-gradient(90deg, #a78bfa, #38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {nav.brandName || 'NovaVPN'}
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: location.pathname === l.href ? '#f1f5f9' : '#94a3b8',
                  background: location.pathname === l.href ? 'rgba(124,58,237,0.2)' : 'transparent',
                  border: location.pathname === l.href ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth button */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {user && (
              <img
                src={user.photoURL}
                alt="avatar"
                style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.5)' }}
                className="desktop-nav"
              />
            )}
            <button
              onClick={handleAuth}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: user ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#f1f5f9',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              {user ? <><LogOut size={13} /> Sign Out</> : 'Sign In'}
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-nav"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#94a3b8', padding: '4px',
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{
            marginTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '12px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: location.pathname === l.href ? '#a78bfa' : '#94a3b8',
                  background: location.pathname === l.href ? 'rgba(124,58,237,0.1)' : 'transparent',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 640px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 639px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </>
  );
}
