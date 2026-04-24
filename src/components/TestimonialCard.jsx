import React from 'react';
import GlassCard from './GlassCard';

const TestimonialCard = ({ testimonial }) => {
  return (
    <GlassCard className="testimonial-card h-100">
      <div className="testimonial-top">
        <img 
          src={testimonial.avatarBase64 || 'https://placehold.co/48x48/121826/00E5FF?text=U'}
          alt={testimonial.name} 
          className="testimonial-avatar" 
        />
        <div>
          <div className="testimonial-name text-white">{testimonial.name}</div>
          {testimonial.plan && (
            <span className="badge-protocol" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>
              {testimonial.plan}
            </span>
          )}
        </div>
      </div>
      
      <div className="testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fa-solid fa-star ${i >= (testimonial.rating || 5) ? 'empty' : ''}`}
          ></i>
        ))}
      </div>
      
      <p className="testimonial-message">"{testimonial.message}"</p>
      
      <div className="testimonial-verified mt-auto pt-2">
        <i className="fa-solid fa-circle-check"></i> Verified User
      </div>
    </GlassCard>
  );
};

export default TestimonialCard;
