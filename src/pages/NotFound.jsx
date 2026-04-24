import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page position-relative">
      <div className="hero-grid" style={{ opacity: 0.5 }}></div>
      <div className="hero-blob hero-blob-cyan" style={{ top: '20%', left: '20%' }}></div>
      
      <div className="position-relative z-1 text-center reveal-on-scroll">
        <div className="not-found-code gradient-text">404</div>
        <i className="fa-solid fa-satellite-dish not-found-icon"></i>
        <h2 className="text-white fw-bold mb-3">Connection Lost</h2>
        <p className="text-secondary mb-5 max-w-500 mx-auto">
          The page you are looking for has been moved, deleted, or never existed. Let's get you back to safety.
        </p>
        
        <Link to="/" className="btn-gradient px-4 py-3">
          <i className="fa-solid fa-arrow-left me-2"></i> Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
