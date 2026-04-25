import React, { useState } from 'react';
import PricingCard from '../components/PricingCard';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../hooks/useAuth';
import { useRealtimeCollection, useDocument } from '../hooks/useFirestore';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  
  const { currentUser } = useAuth();
  const { data: config } = useDocument('siteSettings', 'config');
  const { data: packages, loading } = useRealtimeCollection('packages', []);

  const handleSelectPackage = (pkg) => {
    // If yearly, adjust the package data to pass to the modal
    const finalPkg = isYearly 
      ? { ...pkg, price: pkg.price * 12 * 0.9, durationDays: 365, name: `${pkg.name} (Yearly)` }
      : pkg;
      
    setSelectedPkg(finalPkg);
    setShowPayment(true);
  };

  // Fallback data
  const displayPackages = packages?.length > 0 ? packages.filter(p => p.isVisible).sort((a,b) => a.order - b.order) : [
    { id: '1', name: 'Starter', price: 500, durationDays: 30, icon: 'fa-paper-plane', isRecommended: false, features: [{text:'1 Device', included:true}, {text:'Standard Support', included:true}, {text:'Dedicated IP', included:false}] },
    { id: '2', name: 'Pro', price: 800, durationDays: 30, icon: 'fa-rocket', isRecommended: true, features: [{text:'3 Devices', included:true}, {text:'Priority Support', included:true}, {text:'Dedicated IP', included:false}] },
    { id: '3', name: 'Elite', price: 1500, durationDays: 30, icon: 'fa-gem', isRecommended: false, features: [{text:'Unlimited Devices', included:true}, {text:'24/7 VIP Support', included:true}, {text:'Dedicated IP', included:true}] }
  ];

  return (
    <div className="pricing-page position-relative min-vh-100">
      <div className="hero-blob bg-brand-primary/10" style={{ top: '20%', left: '-10%', width: '40rem', height: '40rem', filter: 'blur(100px)' }}></div>
      <div className="hero-blob bg-brand-glow/10" style={{ top: '50%', right: '-10%', width: '30rem', height: '30rem', filter: 'blur(100px)' }}></div>

      <section className="section-padding text-center position-relative z-1">
        <div className="container-main pt-5">
          <div className="section-eyebrow">Pricing Plans</div>
          <h1 className="section-title text-white">Simple, Transparent <span className="gradient-text">Pricing</span></h1>
          <p className="section-subtitle mt-3">Choose the power you need. All plans include 5+ global servers.</p>

          {/* Toggle */}
          <div className="d-flex justify-content-center align-items-center gap-3 mb-5 mt-4 reveal-on-scroll">
            <span className={`fw-bold ${!isYearly ? 'text-white' : 'text-muted'}`}>Monthly</span>
            <div 
              className="glass-card d-flex align-items-center p-1" 
              style={{ width: '60px', height: '32px', borderRadius: '20px', cursor: 'pointer' }}
              onClick={() => setIsYearly(!isYearly)}
            >
              <div 
                className="pulse-dot" 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  background: 'var(--grad-premium)', 
                  transform: isYearly ? 'translateX(28px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease',
                  boxShadow: 'none',
                  animation: 'none'
                }}
              ></div>
            </div>
            <span className={`fw-bold d-flex align-items-center gap-2 ${isYearly ? 'text-white' : 'text-muted'}`}>
              Yearly <span className="badge-active py-1 px-2" style={{ fontSize: '0.65rem' }}>Save 10%</span>
            </span>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center pt-5"><div className="spinner"></div></div>
          ) : (
            <div className="row justify-content-center g-4">
              {displayPackages.map((pkg, idx) => {
                const pkgDisplay = isYearly 
                  ? { ...pkg, price: pkg.price * 12 * 0.9, durationDays: 365 } 
                  : pkg;
                  
                return (
                  <div className="col-12 col-md-6 col-lg-4 reveal-on-scroll" style={{ '--delay': `${idx * 0.1}s` }} key={pkg.id}>
                    <PricingCard 
                      pkg={pkgDisplay} 
                      isLoggedIn={!!currentUser} 
                      onSelect={handleSelectPackage} 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PaymentModal 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        packageData={selectedPkg}
        siteSettings={config}
      />
    </div>
  );
};

export default Pricing;
