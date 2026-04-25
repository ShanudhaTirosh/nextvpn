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
    { name: 'Tutorials', path: '/admin/tutorials', icon: 'fa-book' },
    { name: 'Support Chat', path: '/admin/chat', icon: 'fa-comments' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-40 w-64 h-full bg-[#0d1117] border-r border-amber-900/30 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-amber-900/30">
          <Link to="/" className="flex items-center no-underline">
            <i className="fa-solid fa-crown text-2xl text-amber-500 mr-2"></i>
            <span className="font-bold text-white text-xl">Admin <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Panel</span></span>
          </Link>
          <button className="text-slate-400 hover:text-white md:hidden" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="px-4 py-4 mb-2">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <img 
              src={userData?.photoBase64 || 'https://placehold.co/40x40/121826/FFB020?text=A'}
              alt="Avatar" 
              className="rounded-full w-10 h-10 object-cover border border-amber-500/50" 
            />
            <div className="overflow-hidden">
              <div className="text-amber-400 font-bold truncate text-sm">{userData?.displayName || 'Admin'}</div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-medium mt-1">
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
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
            <Link to="/portal/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-400 hover:bg-slate-800 hover:text-white transition-all" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-arrow-left w-6"></i> Client Portal
            </Link>
            <Link to="/" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-400 hover:bg-slate-800 hover:text-white transition-all">
              <i className="fa-solid fa-globe w-6"></i> View Website
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-amber-900/30 bg-[#0d1117] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="text-slate-300 hover:text-white focus:outline-none" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <span className="font-bold text-amber-400">Admin Console</span>
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
