import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Overview from './admin/Overview';
import Users from './admin/Users';
import Payments from './admin/Payments';
import Servers from './admin/Servers';
import Packages from './admin/Packages';
import Settings from './admin/Settings';
import SupportChat from './admin/SupportChat';
import AdminTutorials from './admin/AdminTutorials';
import Testimonials from './admin/Testimonials';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData, logOut } = useAuth();
  const location = useLocation();

  const adminNav = [
    { name: 'Overview', path: '/admin/overview', icon: 'fa-chart-pie' },
    { name: 'Payments', path: '/admin/payments', icon: 'fa-money-bill-transfer' },
    { name: 'Users', path: '/admin/users', icon: 'fa-users' },
    { name: 'Servers', path: '/admin/servers', icon: 'fa-server' },
    { name: 'Packages', path: '/admin/packages', icon: 'fa-box-open' },
    { name: 'Settings', path: '/admin/settings', icon: 'fa-gears' },
    { name: 'Tutorials', path: '/admin/tutorials', icon: 'fa-book' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: 'fa-quote-left' },
    { name: 'Support Chat', path: '/admin/chat', icon: 'fa-comments' },
  ];

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-40 w-64 h-full bg-[#121212] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <Link to="/" className="flex items-center no-underline group">
            <i className="fa-solid fa-crown text-2xl text-brand-primary mr-2 shadow-[0_0_15px_rgba(255,106,0,0.3)]"></i>
            <span className="font-black text-white text-xl tracking-tighter uppercase">Admin <span className="bg-gradient-to-r from-brand-primary to-brand-glow bg-clip-text text-transparent">Panel</span></span>
          </Link>
          <button className="text-slate-400 hover:text-white md:hidden" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="px-4 py-4 mb-2">
          <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center gap-3">
            <img 
              src={userData?.photoBase64 || 'https://placehold.co/40x40/121826/FF6A00?text=A'}
              alt="Avatar" 
              className="rounded-full w-10 h-10 object-cover border border-brand-primary/30" 
            />
            <div className="overflow-hidden">
              <div className="text-white font-bold truncate text-sm">{userData?.displayName || 'Admin'}</div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-black uppercase tracking-wider mt-1">
                System Admin
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 overflow-y-auto custom-scrollbar">
          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2 px-2 mt-2">Management</div>
          <div className="flex flex-col gap-1">
            {adminNav.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`fa-solid ${item.icon} w-6`}></i> {item.name}
                </Link>
              );
            })}
          </div>

          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2 px-2 mt-6">System</div>
          <div className="flex flex-col gap-1">
            <Link to="/portal/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-brand-primary hover:bg-white/5 hover:text-white transition-all" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-arrow-left w-6"></i> Client Portal
            </Link>
            <Link to="/" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-brand-primary hover:bg-white/5 hover:text-white transition-all">
              <i className="fa-solid fa-globe w-6"></i> View Website
            </Link>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button className="w-full flex justify-center items-center py-3 px-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/40 transition-all font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.05)]" onClick={logOut}>
            <i className="fa-solid fa-right-from-bracket mr-2 text-sm"></i> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0D0D0D] relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#121212] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="text-slate-300 hover:text-white focus:outline-none" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <span className="font-black text-brand-primary uppercase tracking-widest text-sm">Admin Console</span>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="users" element={<Users />} />
              <Route path="payments" element={<Payments />} />
              <Route path="servers" element={<Servers />} />
              <Route path="packages" element={<Packages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tutorials" element={<AdminTutorials />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="chat" element={<SupportChat />} />
            </Routes>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminPanel;
