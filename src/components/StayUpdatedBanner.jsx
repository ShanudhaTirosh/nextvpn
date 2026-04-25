import React, { useState } from 'react';
import { addDocument } from '../firebase/firestore';
import { showToast } from './Toast';
import { useRealtimeCollection } from '../hooks/useFirestore';

const StayUpdatedBanner = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: announcements } = useRealtimeCollection('announcements', []);

  const visibleAnnouncements = announcements?.filter(a => a.isVisible) || [];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await addDocument('subscribers', { email });
      showToast.success("Successfully subscribed to updates!");
      setEmail('');
    } catch (err) {
      showToast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-main py-5">
      {/* Announcement Banner */}
      {visibleAnnouncements.length > 0 && (
        <div className="announcement-banner reveal-on-scroll">
          <i className="fa-solid fa-bullhorn"></i>
          <div>
            <h5 className="mb-1 fw-bold text-white">{visibleAnnouncements[0].title}</h5>
            <p className="mb-0 text-secondary small">{visibleAnnouncements[0].body}</p>
          </div>
        </div>
      )}

      {/* Subscribe Box */}
      <div className="stay-updated reveal-on-scroll" style={{ '--delay': '0.1s' }}>
        <div className="d-flex align-items-start gap-3">
          <div className="feature-icon-wrap mb-0" style={{ width: '56px', height: '56px', flexShrink: 0 }}>
            <i className="fa-solid fa-bell fs-4"></i>
          </div>
          <div>
            <h3 className="mb-1 text-white fw-bold">Stay in the Loop</h3>
            <p className="mb-0 text-secondary">Get notified about new servers, protocol updates, and special offers.</p>
          </div>
        </div>
        
        <form className="stay-updated-form" onSubmit={handleSubscribe}>
          <input 
            type="email" 
            className="form-input" 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn-gradient" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default StayUpdatedBanner;
