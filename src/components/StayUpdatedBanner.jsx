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
        <div className="glass-card mb-4 p-4 flex items-center gap-4 reveal-on-scroll border-brand-primary/20">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <i className="fa-solid fa-bullhorn"></i>
          </div>
          <div>
            <h5 className="m-0 font-black text-white text-sm uppercase tracking-wider">{visibleAnnouncements[0].title}</h5>
            <p className="m-0 text-slate-500 text-xs">{visibleAnnouncements[0].body}</p>
          </div>
        </div>
      )}

      {/* Subscribe Box */}
      <div className="glass-card p-6 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-start">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <i className="fa-solid fa-bell text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-1">Stay in the Loop</h3>
              <p className="text-slate-500 text-sm m-0">Get notified about new servers, protocol updates, and special offers.</p>
            </div>
          </div>
          
          <form className="flex items-center gap-2 w-full md:w-auto" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              className="modern-input w-full md:w-64" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn-premium" disabled={loading}>
              {loading ? <div className="spinner"></div> : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default StayUpdatedBanner;
