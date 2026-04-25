import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';

const PricingCard = ({ pkg, isLoggedIn, onSelect }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (isLoggedIn && onSelect) {
      onSelect(pkg);
    } else {
      navigate('/register');
    }
  };

  return (
    <GlassCard className={`pricing-card h-100 ${pkg.isRecommended ? 'recommended' : ''} glass-card relative group`}>
      {pkg.isRecommended && (
        <div className="absolute -top-3 right-8">
          <span className="badge-orange shadow-[0_0_20px_rgba(255,106,0,0.3)]">Most Popular</span>
        </div>
      )}
      
      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mt-2 group-hover:scale-110 transition-transform duration-500">
        <i className={`fa-solid ${pkg.icon || 'fa-server'} text-brand-primary text-xl`}></i>
      </div>
      
      <h3 className="text-xl font-black text-white mt-4 mb-1">{pkg.name}</h3>
      <div className="pricing-period mb-4 text-muted">Ideal for standard usage</div>
      
      <div className="pricing-price gradient-text">
        LKR {pkg.price}
        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          /{pkg.durationDays === 30 ? 'mo' : `${pkg.durationDays}d`}
        </span>
      </div>
      
      <div className="divider mx-auto" style={{ width: '60%' }}></div>
      
      <ul className="pricing-features">
        {pkg.features?.map((feature, idx) => (
          <li key={idx}>
            <i className={`fa-solid ${feature.included !== false ? 'fa-check' : 'fa-xmark'}`}></i> 
            <span style={{ textDecoration: feature.included === false ? 'line-through' : 'none', opacity: feature.included === false ? 0.5 : 1 }}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      <button 
        className={`w-full mt-auto ${pkg.isRecommended ? 'btn-premium' : 'btn-outline'} text-sm`}
        onClick={handleAction}
      >
        Get Started Now
      </button>
    </GlassCard>
  );
};

export default PricingCard;
