import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Shield, Globe, Smartphone, Clock, BarChart2,
  ChevronDown, ChevronUp, Star, Send, Check, ArrowRight,
  Wifi, Users, Server, Activity,
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../services/authService';
import { postContactWebhook } from '../services/webhookService';
import PlanCard from '../components/PlanCard';
import Footer from '../components/Footer';

const ICON_MAP = { Zap, Shield, Globe, Smartphone, Clock, BarChart2, Wifi, Users, Server, Activity };

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  useScrollReveal();

  useEffect(() => {
    getDocs(query(collection(db, 'plans'), where('active', '==', true))).then((snap) => {
      setPlans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const hero = settings.hero;
  const features = settings.features?.items || [];
  const faqItems = settings.faq?.items || [];

  const handleContact = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactLoading(true);
    try {
      await addDoc(collection(db, 'contactSubmissions'), { ...contactForm, createdAt: serverTimestamp() });
      await postContactWebhook(contactForm);
      setContactStatus('success');
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      setContactStatus('error');
    }
    setContactLoading(false);
  };

  const handleCTA = () => {
    if (user) navigate('/plans');
    else signInWithGoogle().then(() => navigate('/plans')).catch(() => {});
  };

  const ISPs = [
    { name: 'SLT', color: '#3b82f6' },
    { name: 'Dialog', color: '#ef4444' },
    { name: 'Mobitel', color: '#22c55e' },
    { name: 'Hutch', color: '#f97316' },
    { name: 'Airtel', color: '#ec4899' },
  ];

  const TESTIMONIALS = [
    { name: 'Kasun P.', location: 'Colombo', rating: 5, text: 'Works flawlessly on Dialog fiber. YouTube 4K no buffering!' },
    { name: 'Dilshan R.', location: 'Kandy', rating: 5, text: 'SLT speeds are amazing now. Setup took 2 minutes.' },
    { name: 'Nimasha S.', location: 'Galle', rating: 5, text: 'Best VPN service in Sri Lanka. Admin support is super fast.' },
  ];

  const STEPS = [
    { step: '01', title: 'Sign Up', desc: 'Create your account with Google in one click' },
    { step: '02', title: 'Choose Plan', desc: 'Pick the data plan that fits your needs' },
    { step: '03', title: 'Pay Easily', desc: 'Bank transfer or QR code payment supported' },
    { step: '04', title: 'Connect', desc: 'Get your config link and connect in minutes' },
  ];

  return (
    <div style={{ minHeight: '100vh', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      {/* Global reveal styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center', position: 'relative', padding: '160px 24px 100px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '9999px', padding: '6px 16px',
            fontSize: '13px', fontWeight: 600, color: '#a78bfa',
            marginBottom: '28px',
            animation: 'float 3s ease-in-out infinite',
          }}>
            <Zap size={13} fill="#a78bfa" /> {hero.badge || '🚀 Next-Gen VPN for Sri Lanka'}
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #f1f5f9 30%, #a78bfa 60%, #38bdf8 90%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 5s ease infinite',
            whiteSpace: 'pre-line',
          }}>
            {hero.title || 'Unrestricted Internet\nFor Sri Lanka'}
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#94a3b8', maxWidth: '540px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            {hero.subtitle}
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleCTA}
              style={{
                padding: '14px 32px', borderRadius: '9999px', border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              {hero.ctaText || 'Get Started'} <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 28px', borderRadius: '9999px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#94a3b8', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
              }}
            >
              View Plans
            </button>
          </div>

          {/* Floating stats */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
            {[['99.9%', 'Uptime'], ['5+', 'Servers'], ['24/7', 'Support'], ['1000+', 'Users']].map(([v, l]) => (
              <div key={l} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px', padding: '14px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#a78bfa' }}>{v}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={sectionHeadStyle}>Why Choose NovaVPN?</h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Everything you need for a fast, private internet experience</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => {
            const Icon = ICON_MAP[f.icon] || Zap;
            return (
              <div key={i} className={`reveal stagger-${(i % 5) + 1}`} style={glassCard}>
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                }}>
                  <Icon size={20} color="#a78bfa" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── PLANS ─── */}
      <section id="plans" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={sectionHeadStyle}>Simple, Transparent Pricing</h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>No hidden fees. Pay once, stay connected.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {plans.map((p, i) => (
            <div key={p.id} className={`reveal stagger-${i + 1}`}>
              <PlanCard plan={p} highlighted={!!p.badge} />
            </div>
          ))}
          {plans.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#475569', padding: '60px' }}>
              Loading plans...
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={sectionHeadStyle}>How It Works</h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Up and running in under 5 minutes</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', position: 'relative' }}>
          {STEPS.map((s, i) => (
            <div key={i} className={`reveal stagger-${i + 1}`} style={{ ...glassCard, textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
                border: '2px solid rgba(124,58,237,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 800, color: '#a78bfa',
              }}>{s.step}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ISPs ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={sectionHeadStyle}>Works On All Sri Lankan ISPs</h2>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {ISPs.map((isp) => (
            <div key={isp.name} className="reveal" style={{
              padding: '12px 28px', borderRadius: '9999px',
              background: `${isp.color}18`,
              border: `1px solid ${isp.color}40`,
              color: isp.color, fontWeight: 700, fontSize: '15px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Wifi size={14} /> {isp.name}
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={sectionHeadStyle}>What Our Users Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '20px' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`reveal stagger-${i + 1}`} style={glassCard}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {Array.from({ length: t.rating }).map((_, s) => <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '16px' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: '#fff',
                }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '720px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={sectionHeadStyle}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqItems.map((f, i) => (
            <div key={i} className="reveal" style={{
              background: 'rgba(10,10,26,0.7)',
              border: `1px solid ${openFaq === i ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '14px', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '18px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#f1f5f9', fontSize: '15px', fontWeight: 600, textAlign: 'left',
                }}
              >
                {f.q}
                {openFaq === i ? <ChevronUp size={16} color="#a78bfa" /> : <ChevronDown size={16} color="#64748b" />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section style={{ padding: '80px 24px', maxWidth: '560px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={sectionHeadStyle}>Get In Touch</h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Have questions? We typically respond within 30 minutes.</p>
        </div>
        <div className="reveal" style={glassCard}>
          <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              value={contactForm.name}
              onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              required
              style={inputStyle}
            />
            <input
              type="email"
              value={contactForm.email}
              onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
              placeholder="Email address"
              required
              style={inputStyle}
            />
            <textarea
              value={contactForm.message}
              onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
              placeholder="Your message..."
              required
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <button
              type="submit"
              disabled={contactLoading}
              style={{
                padding: '13px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#fff', fontWeight: 700, fontSize: '15px', cursor: contactLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: contactLoading ? 0.7 : 1,
              }}
            >
              <Send size={15} /> {contactLoading ? 'Sending...' : 'Send Message'}
            </button>
            {contactStatus === 'success' && (
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Check size={14} /> Message sent! We'll get back to you soon.
              </div>
            )}
            {contactStatus === 'error' && (
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', fontSize: '13px', color: '#fb7185' }}>
                Failed to send. Please try again.
              </div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const sectionHeadStyle = {
  fontSize: 'clamp(26px, 4vw, 40px)',
  fontWeight: 800,
  marginBottom: '12px',
  background: 'linear-gradient(135deg, #f1f5f9, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const glassCard = {
  background: 'rgba(10,10,26,0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '28px',
  backdropFilter: 'blur(12px)',
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f5f9', fontSize: '14px', outline: 'none',
  width: '100%', boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
};
