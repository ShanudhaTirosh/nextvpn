import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import PlanCard from '../components/PlanCard';
import { signInWithGoogle } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get('signin') && !user) {
      signInWithGoogle().catch(() => {});
    }
  }, []);

  useEffect(() => {
    getDocs(query(collection(db, 'plans'), where('active', '==', true))).then((snap) => {
      const sorted = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.price - b.price);
      setPlans(sorted);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900,
            background: 'linear-gradient(135deg, #f1f5f9, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
          }}>Choose Your Plan</h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>No contracts, cancel anytime. Pay in LKR via bank transfer or QR.</p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '400px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                animation: 'pulse 1.5s infinite',
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {plans.map((p) => <PlanCard key={p.id} plan={p} highlighted={!!p.badge} />)}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:0.8} }`}</style>
    </div>
  );
}
