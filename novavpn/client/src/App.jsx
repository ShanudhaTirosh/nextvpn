import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import MeshBackground from './components/MeshBackground';

import Home from './pages/Home';
import Plans from './pages/Plans';
import Checkout from './pages/Checkout';
import Receipt from './pages/Receipt';
import Dashboard from './pages/Dashboard';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminPayments from './pages/admin/AdminPayments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminServers from './pages/admin/AdminServers';
import AdminChat from './pages/admin/AdminChat';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import AdminWebhooks from './pages/admin/AdminWebhooks';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <div style={{ background: '#030014', minHeight: '100vh', position: 'relative' }}>
            <MeshBackground />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Routes>
                {/* Public routes with navbar */}
                <Route path="/" element={<><Navbar /><Home /></>} />
                <Route path="/plans" element={<><Navbar /><Plans /></>} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Navbar />
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/receipt"
                  element={
                    <ProtectedRoute>
                      <Navbar />
                      <Receipt />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navbar />
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes — no public navbar */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="plans" element={<AdminPlans />} />
                  <Route path="servers" element={<AdminServers />} />
                  <Route path="chat" element={<AdminChat />} />
                  <Route path="settings" element={<AdminSiteSettings />} />
                  <Route path="webhooks" element={<AdminWebhooks />} />
                </Route>

                {/* 404 fallback */}
                <Route path="*" element={
                  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: "'Inter', sans-serif", flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '72px', fontWeight: 900, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
                    <p>Page not found</p>
                    <a href="/" style={{ color: '#a78bfa', textDecoration: 'none' }}>← Go Home</a>
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
