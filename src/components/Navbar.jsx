import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, userData, logOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { settings } = useSiteSettings();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Proxy', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const initials = (name) => (name ? name.substring(0, 1).toUpperCase() : 'U');
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] flex flex-col items-center pt-4 pointer-events-none">
      <nav className={`pointer-events-auto w-full px-3 transition-all duration-500 ${scrolled ? 'max-w-3xl' : 'max-w-5xl'}`}>
        
        {/* Main Capsule */}
        <div className={`relative flex items-center justify-between h-14 px-5 rounded-full border transition-all duration-500 ${
          scrolled 
            ? 'bg-black/80 border-brand-primary/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl' 
            : 'bg-white/5 border-white/5 backdrop-blur-md'
        }`}>
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
            <div className="relative flex items-center justify-center">
              {settings?.branding?.logoUrl ? (
                <img src={settings.branding.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.3)] group-hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] transition-all duration-500 overflow-hidden">
                  <span className="text-brand-bg font-black text-xs">{settings?.siteName?.[0] || 'S'}</span>
                </div>
              )}
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-white font-black text-xs tracking-tighter uppercase">{settings?.siteName || 'ShiftLK'}</span>
              <span className="text-[8px] text-brand-primary font-bold tracking-[0.2em] uppercase opacity-80">Elite VPN</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[10px] font-bold uppercase tracking-widest no-underline transition-all hover:text-brand-primary ${
                  isActive(link.path) ? 'text-brand-primary' : 'text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400 no-underline hover:text-white transition-colors px-2">Login</Link>
                <Link to="/contact" className="btn-premium py-1.5 px-4 text-[10px] rounded-full no-underline">
                  Contact <span className="animate-pulse ml-1 text-xs">✦</span>
                </Link>
              </div>
            ) : (
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <Link to={isAdmin ? "/admin/overview" : "/portal/dashboard"} className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-brand-primary no-underline hover:text-white transition-colors">Dashboard</Link>
                
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 rounded-full border border-white/10 hover:border-brand-primary overflow-hidden bg-brand-surface flex items-center justify-center transition-all focus:outline-none shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                  {userData?.photoBase64 
                    ? <img src={userData.photoBase64} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-white text-xs font-bold">{initials(userData?.displayName || currentUser.email)}</span>
                  }
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-52 glass-card border-brand-primary/20 overflow-hidden animate-fade-in no-hover">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <div className="text-white font-bold text-xs truncate">{userData?.displayName || 'User'}</div>
                      <div className="text-slate-500 text-[10px] truncate">{currentUser.email}</div>
                    </div>
                    <div className="py-1">
                      <Link to="/portal/profile" className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 text-xs no-underline transition-colors">
                        <i className="fa-solid fa-user text-brand-primary text-[10px] w-4"></i> Profile
                      </Link>
                      {isAdmin && (
                        <Link to="/admin/overview" className="flex items-center gap-2 px-4 py-2.5 text-brand-primary hover:text-brand-hover hover:bg-white/5 text-xs no-underline transition-colors">
                          <i className="fa-solid fa-crown text-[10px] w-4"></i> Admin Panel
                        </Link>
                      )}
                      <div className="h-px bg-white/5 my-1"></div>
                      <button onClick={() => logOut()} className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 text-xs transition-colors">
                        <i className="fa-solid fa-right-from-bracket text-[10px] w-4"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xs`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="mt-2 glass-card border-brand-primary/10 overflow-hidden animate-fade-in no-hover">
            <div className="p-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest no-underline transition-all ${
                    isActive(link.path) ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-1"></div>
              {!currentUser ? (
                <Link to="/login" className="px-4 py-3 text-brand-primary text-xs font-bold uppercase tracking-widest no-underline">
                  <i className="fa-solid fa-right-to-bracket mr-2"></i> Sign In
                </Link>
              ) : (
                <button onClick={() => logOut()} className="px-4 py-3 text-red-400 text-xs font-bold uppercase tracking-widest text-left">
                  <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                </button>
              )}
            </div>
          </div>
        )}

      </nav>
    </div>
  );
};

export default Navbar;
