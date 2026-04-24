import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import { useAuth } from './hooks/useAuth';
import { useAdmin } from './hooks/useAdmin';

// Lazy loaded pages to improve initial load time
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const SLAAgreement = lazy(() => import('./pages/SLAAgreement'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Portals & Admin are complex so we lazy load them as well
const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Protected Route wrappers
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdmin();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const FallbackLoader = () => (
  <div className="container-main pt-5 mt-5">
    <SkeletonLoader type="title" />
    <SkeletonLoader count={4} />
    <div className="row mt-4">
      <div className="col-md-4"><SkeletonLoader type="card" /></div>
      <div className="col-md-4"><SkeletonLoader type="card" /></div>
      <div className="col-md-4"><SkeletonLoader type="card" /></div>
    </div>
  </div>
);

function App() {
  const location = useLocation();
  const isPortalOrAdmin = location.pathname.startsWith('/portal') || location.pathname.startsWith('/admin');

  // Global Scroll Reveal Logic
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const handleMutations = (mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            if (node.classList.contains('reveal-on-scroll')) {
              observer.observe(node);
            }
            const descendants = node.querySelectorAll('.reveal-on-scroll');
            descendants.forEach(el => observer.observe(el));
          }
        });
      });
    };

    const mutationObserver = new MutationObserver(handleMutations);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Initial check for elements already in DOM
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!isPortalOrAdmin && <Navbar />}
      
      {/* pt-20 compensates for the fixed floating capsule navbar height+gap */}
      <main style={{ minHeight: !isPortalOrAdmin ? 'calc(100vh - 350px)' : '100vh' }} className={!isPortalOrAdmin ? 'pt-20' : ''}>
        <Suspense fallback={<FallbackLoader />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Legal */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/sla" element={<SLAAgreement />} />

            {/* Protected Client Portal Routes */}
            <Route path="/portal/*" element={
              <ProtectedRoute>
                <ClientPortal />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isPortalOrAdmin && <Footer />}
    </>
  );
}

export default App;
