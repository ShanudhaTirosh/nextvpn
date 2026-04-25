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
    <GlassCard className={`pricing-card h-100 ${pkg.isRecommended ? 'recommended' : ''}`}>
      {pkg.isRecommended && (
        <div className="pricing-badge">Most Popular</div>
      )}
      
      <div className="feature-icon-wrap mx-auto mt-2">
        <i className={`fa-solid ${pkg.icon || 'fa-server'}`}></i>
      </div>
      
      <h3 className="pricing-name">{pkg.name}</h3>
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
        className={`w-100 mt-auto ${pkg.isRecommended ? 'btn-gradient' : 'btn-ghost'}`}
        onClick={handleAction}
      >
        Get Started
      </button>
    </GlassCard>
  );
};

export default PricingCard;
