import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmail, signInWithGoogle } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/Toast';

const Inp = ({ label, icon, right, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      <i className={`fa-solid ${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-sm pointer-events-none`}></i>
      <input className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm disabled:opacity-50" {...props} />
      {right}
    </div>
  </div>
);

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (currentUser) { navigate('/portal/dashboard', { replace: true }); return null; }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) { showToast.error('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { showToast.error('Passwords do not match.'); return; }
    if (form.password.length < 6) { showToast.error('Password must be at least 6 characters.'); return; }
    if (!form.terms) { showToast.error('Please agree to the Terms of Service.'); return; }
    setLoading(true);
    try {
      await registerWithEmail(form.email, form.password, form.name);
      showToast.success('Account created!');
      navigate('/portal/dashboard');
    } catch (err) {
      showToast.error(err.code === 'auth/email-already-in-use' ? 'Email already registered.' : err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!form.terms) { showToast.error('Please agree to the Terms of Service.'); return; }
    setLoading(true);
    try { await signInWithGoogle(); navigate('/portal/dashboard'); }
    catch { showToast.error('Google sign-in failed.'); }
    finally { setLoading(false); }
  };

  const pwEye = (
    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
      <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-slate-950 via-slate-900 to-[#0d1f3c] border-r border-slate-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="g2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#g2)" />
          </svg>
        </div>

        <Link to="/" className="no-underline flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="text-white font-black text-sm">N</span>
          </div>
          <span className="text-white font-bold text-lg">ShiftLK<span className="text-cyan-400 font-normal text-sm">™</span></span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-3">Join <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">5,000+</span> Users</h2>
          <p className="text-slate-400 text-sm mb-8">Experience true internet freedom with blazing fast V2Ray servers across the globe.</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '5+', sub: 'Global Servers', icon: 'fa-server', color: 'text-cyan-400' },
              { label: '99.9%', sub: 'Uptime SLA', icon: 'fa-shield-halved', color: 'text-emerald-400' },
              { label: '<10ms', sub: 'Avg Latency', icon: 'fa-bolt', color: 'text-amber-400' },
              { label: '24/7', sub: 'Expert Support', icon: 'fa-headset', color: 'text-blue-400' },
            ].map(({ label, sub, icon, color }) => (
              <div key={sub} className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                <i className={`fa-solid ${icon} ${color} mb-2 block text-lg`}></i>
                <div className="text-white font-bold text-xl">{label}</div>
                <div className="text-slate-500 text-xs">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-700 text-xs relative z-10">© 2024 ShiftLK Netch · <Link to="/terms" className="no-underline hover:text-slate-500 transition-colors">Terms</Link> · <Link to="/privacy" className="no-underline hover:text-slate-500 transition-colors">Privacy</Link></p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="no-underline flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"><span className="text-white font-black text-xs">N</span></div>
            <span className="text-white font-bold">ShiftLK™</span>
          </Link>

          <h2 className="text-2xl font-black text-white mb-1">Create account</h2>
          <p className="text-slate-500 text-sm mb-7">Join thousands experiencing true internet freedom.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <Inp label="Full Name" icon="fa-user" type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" disabled={loading} />
            <Inp label="Email Address" icon="fa-envelope" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" disabled={loading} />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Password" icon="fa-lock" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" disabled={loading} right={pwEye} />
              <Inp label="Confirm" icon="fa-lock-keyhole" type={showPw ? 'text' : 'password'} value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="••••••••" disabled={loading} />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} className="w-4 h-4 rounded accent-cyan-500 mt-0.5 flex-shrink-0" disabled={loading} />
              <span className="text-xs text-slate-500 leading-relaxed">
                I agree to the <Link to="/terms" className="text-cyan-400 no-underline hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-cyan-400 no-underline hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Create Account'}
            </button>
          </form>

          <div className="relative flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-xs text-slate-600">or register with</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-medium transition-all disabled:opacity-50">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-slate-600 text-xs mt-6">
            Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold no-underline transition-colors">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
