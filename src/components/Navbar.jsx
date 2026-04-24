import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, userData, logOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Proxy', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
  ];

  const initials = (name) => (name ? name.substring(0, 2).toUpperCase() : 'U');
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 pointer-events-none">
      {/* Capsule Navbar */}
      <nav
        className={`pointer-events-auto w-full max-w-4xl mx-auto px-3 transition-all duration-500 ${
          scrolled
            ? 'max-w-3xl'
            : 'max-w-4xl'
        }`}
      >
        <div className={`relative flex items-center justify-between h-12 px-4 rounded-full border transition-all duration-500 ${
          scrolled
            ? 'bg-slate-950/90 border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(6,182,212,0.05)] backdrop-blur-2xl'
            : 'bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
        }`}>

          {/* Glow ring on scroll */}
          {scrolled && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              <span className="text-white font-black text-xs">N</span>
            </div>
            <span className="font-bold text-white text-sm">NetchX<span className="text-cyan-400 font-normal ml-0.5">™</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`no-underline px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 no-underline text-slate-400 hover:text-white text-xs font-medium border border-slate-700/60 hover:border-slate-600 px-3 py-1.5 rounded-full transition-all"
                >
                  <i className="fa-solid fa-user text-[10px]"></i> Portal
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 no-underline text-slate-950 font-bold text-xs bg-gradient-to-r from-cyan-400 to-blue-500 px-3.5 py-1.5 rounded-full hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] transition-all"
                >
                  Contact <span className="text-[10px]">✦</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/portal/dashboard"
                  className="hidden md:flex items-center gap-1.5 no-underline text-slate-400 hover:text-white text-xs font-medium border border-slate-700/60 hover:border-slate-600 px-3 py-1.5 rounded-full transition-all"
                >
                  Dashboard
                </Link>

                {/* Avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-8 h-8 rounded-full border-2 border-slate-700 hover:border-cyan-500/50 overflow-hidden bg-slate-800 flex items-center justify-center transition-all focus:outline-none"
                  >
                    {userData?.photoBase64
                      ? <img src={userData.photoBase64} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-white text-xs font-bold">{initials(userData?.displayName || currentUser.email)}</span>
                    }
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-10 w-52 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden animate-fade-in">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                        <div className="text-white font-semibold text-sm truncate">{userData?.displayName || 'User'}</div>
                        <div className="text-slate-500 text-xs truncate">{currentUser.email}</div>
                      </div>
                      {/* Menu items */}
                      <div className="py-1">
                        <Link to="/portal/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm no-underline transition-colors">
                          <i className="fa-solid fa-user text-cyan-400 w-4 text-center text-xs"></i> Profile
                        </Link>
                        <Link to="/portal/plan" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm no-underline transition-colors">
                          <i className="fa-solid fa-id-card text-blue-400 w-4 text-center text-xs"></i> My Plan
                        </Link>
                        {isAdmin && (
                          <Link to="/admin/overview" className="flex items-center gap-2.5 px-4 py-2.5 text-amber-400 hover:text-amber-300 hover:bg-slate-800/60 text-sm no-underline transition-colors">
                            <i className="fa-solid fa-crown w-4 text-center text-xs"></i> Admin Panel
                          </Link>
                        )}
                        <div className="h-px bg-slate-800 my-1"></div>
                        <button
                          onClick={() => logOut()}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-slate-800/60 text-sm transition-colors"
                        >
                          <i className="fa-solid fa-right-from-bracket w-4 text-center text-xs"></i> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu — drops below capsule */}
        {menuOpen && (
          <div className="mt-2 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden animate-fade-in">
            <div className="p-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all ${
                    isActive(link.path)
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-800 my-1"></div>
              {!currentUser ? (
                <>
                  <Link to="/login" className="px-4 py-3 text-slate-300 hover:text-white text-sm no-underline">
                    <i className="fa-solid fa-user mr-2 text-cyan-400 text-xs"></i> Client Portal
                  </Link>
                  <Link to="/contact" className="mt-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold py-3 rounded-xl text-center text-sm no-underline">
                    Contact Us ✦
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/portal/dashboard" className="px-4 py-3 text-slate-300 hover:text-white text-sm no-underline">
                    <i className="fa-solid fa-gauge mr-2 text-cyan-400 text-xs"></i> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/overview" className="px-4 py-3 text-amber-400 text-sm no-underline">
                      <i className="fa-solid fa-crown mr-2 text-xs"></i> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => logOut()} className="mt-1 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold py-3 rounded-xl text-center text-sm w-full">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
