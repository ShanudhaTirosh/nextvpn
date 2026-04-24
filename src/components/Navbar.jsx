import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { Dropdown } from 'react-bootstrap';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, userData, logOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Proxy', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <>
      {/* Top gradient bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500" />

      {/* Nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d1117]/95 shadow-lg' : 'bg-[#0d1117]/90'} backdrop-blur-md border-b border-[#1e293b]`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-decoration-none">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">N</div>
            <span className="font-semibold text-white">NetchX</span>
            <span className="text-cyan-400 text-sm"> Hosting™</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`transition-colors text-decoration-none ${location.pathname === link.path ? 'bg-slate-800 text-white px-4 py-1.5 rounded-lg' : 'hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <>
                <Link to="/login" className="hidden md:flex items-center gap-1.5 text-sm text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:text-white hover:border-slate-500 transition-all text-decoration-none">
                  👤 Client Portal ↗
                </Link>
                <Link to="/contact" className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity text-decoration-none border-0">
                  Contact ✦
                </Link>
              </>
            ) : (
              <>
                <Link to="/portal/dashboard" className="hidden md:flex items-center gap-1.5 text-sm text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:text-white hover:border-slate-500 transition-all text-decoration-none">
                  Dashboard ↗
                </Link>
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" bsPrefix="p-0 border-0 bg-transparent cursor-pointer">
                    {userData?.photoBase64 ? (
                      <img src={userData.photoBase64} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                        {getInitials(userData?.displayName || currentUser.email)}
                      </div>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bg-[#0f172a] border border-[#1e293b] shadow-xl rounded-xl mt-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#1e293b] bg-[#0d1117]">
                      <div className="text-white font-semibold text-sm">{userData?.displayName || 'User'}</div>
                      <div className="text-slate-400 text-xs truncate max-w-[200px]">{currentUser.email}</div>
                    </div>
                    <Dropdown.Item as={Link} to="/portal/profile" className="text-slate-300 hover:text-white hover:bg-slate-800 text-sm py-2 px-4"><i className="fa-solid fa-user me-2 text-cyan-400"></i> Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/portal/plan" className="text-slate-300 hover:text-white hover:bg-slate-800 text-sm py-2 px-4"><i className="fa-solid fa-id-card me-2 text-blue-400"></i> My Plan</Dropdown.Item>
                    {isAdmin && (
                      <Dropdown.Item as={Link} to="/admin/overview" className="text-amber-400 hover:text-amber-300 hover:bg-slate-800 text-sm py-2 px-4"><i className="fa-solid fa-crown me-2"></i> Admin Panel</Dropdown.Item>
                    )}
                    <div className="h-[1px] bg-[#1e293b] my-1"></div>
                    <Dropdown.Item onClick={() => logOut()} className="text-red-400 hover:text-red-300 hover:bg-slate-800 text-sm py-2 px-4"><i className="fa-solid fa-right-from-bracket me-2"></i> Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}

            {/* Mobile Toggle */}
            <div className="md:hidden text-slate-400 hover:text-white cursor-pointer px-2" onClick={() => setMenuOpen(!menuOpen)}>
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-[#0d1117] border-b border-[#1e293b] p-4 shadow-2xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`px-4 py-3 rounded-lg text-sm text-decoration-none ${location.pathname === link.path ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] bg-[#1e293b] my-2"></div>
              {!currentUser ? (
                <>
                  <Link to="/login" className="px-4 py-3 text-slate-300 hover:text-white text-sm text-decoration-none">Client Portal ↗</Link>
                  <Link to="/contact" className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg text-center text-sm text-decoration-none">Contact Us ✦</Link>
                </>
              ) : (
                <>
                  <Link to="/portal/dashboard" className="px-4 py-3 text-slate-300 hover:text-white text-sm text-decoration-none">Dashboard ↗</Link>
                  <button onClick={() => logOut()} className="mt-2 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold py-3 rounded-lg text-center text-sm text-decoration-none w-full">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
