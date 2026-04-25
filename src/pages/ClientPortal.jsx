import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Dashboard from './portal/Dashboard';
import MyPlan from './portal/MyPlan';
import Profile from './portal/Profile';
import Tutorials from './portal/Tutorials';
import ChatWidget from '../components/ChatWidget';

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
    <div className="flex h-screen bg-[#0D0D0D] text-slate-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-40 w-64 h-full bg-[#121212] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <Link to="/" className="flex items-center no-underline group">
            <i className="fa-solid fa-shield-halved text-2xl text-brand-primary mr-2 shadow-[0_0_15px_rgba(255,106,0,0.4)]"></i>
            <span className="font-black text-white text-xl tracking-tighter uppercase">ShiftLK <span className="bg-gradient-to-r from-brand-primary to-brand-glow bg-clip-text text-transparent">Netch</span></span>
          </Link>
          <button className="text-slate-400 hover:text-white md:hidden" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="px-4 py-4 mb-2">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
            <img 
              src={userData?.photoBase64 || 'https://placehold.co/40x40/121826/00E5FF?text=U'}
              alt="Avatar" 
              className="rounded-full w-10 h-10 object-cover border border-slate-700" 
            />
            <div className="overflow-hidden">
              <div className="text-white font-bold truncate text-sm">{userData?.displayName || 'User'}</div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-black uppercase tracking-wider mt-1">
                {userData?.plan === 'none' || !userData?.plan ? 'Free User' : `${userData?.plan} Plan`}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 overflow-y-auto custom-scrollbar">
          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2 px-2 mt-2">Menu</div>
          <div className="flex flex-col gap-1">
            {navItems.map(item => {
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

          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2 px-2 mt-6">Support</div>
          <div className="flex flex-col gap-1">
            <Link to="/contact" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-headset w-6"></i> Contact Support
            </Link>
            <a href="https://t.me/shiftlk" target="_blank" rel="noreferrer" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <i className="fa-brands fa-telegram w-6 text-blue-400"></i> Telegram Group
            </a>
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
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-[#121212] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="text-slate-300 hover:text-white focus:outline-none" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <span className="font-bold text-white">Client Portal</span>
          </div>
          <img 
            src={userData?.photoBase64 || 'https://placehold.co/32x32/121826/00E5FF?text=U'}
            alt="Avatar" 
            className="rounded-full w-8 h-8 object-cover border border-slate-700" 
          />
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="plan" element={<MyPlan />} />
              <Route path="profile" element={<Profile />} />
              <Route path="tutorials" element={<Tutorials />} />
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

      {/* Support Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default ClientPortal;
