import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle, resetPassword } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/Toast';

const Inp = ({ icon, label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
    <div className="relative">
      <i className={`fa-solid ${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-sm pointer-events-none`}></i>
      <input className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm disabled:opacity-50" {...props} />
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  if (currentUser) { navigate(location.state?.from?.pathname || '/portal/dashboard', { replace: true }); return null; }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { showToast.error('Please fill in both fields.'); return; }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      showToast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/portal/dashboard', { replace: true });
    } catch (err) {
      showToast.error(['auth/invalid-credential','auth/user-not-found','auth/wrong-password'].includes(err.code) ? 'Invalid email or password.' : err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try { await signInWithGoogle(); navigate('/portal/dashboard', { replace: true }); }
    catch { showToast.error('Google sign-in failed.'); }
    finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) { showToast.error('Enter your email first.'); return; }
    setLoading(true);
    try { await resetPassword(email); showToast.success('Reset email sent!'); setResetMode(false); }
    catch (err) { showToast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Left — Brand panel (hidden mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-slate-950 via-slate-900 to-[#0d1f3c] border-r border-slate-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl" />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <Link to="/" className="no-underline flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="text-white font-black text-sm">N</span>
          </div>
          <span className="text-white font-bold text-lg">ShiftLK<span className="text-cyan-400 font-normal text-sm">™</span></span>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Enterprise VPN Platform
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Fast. Secure.<br/><span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Unrestricted.</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">Access your high-speed V2Ray servers across 5+ global locations. Your privacy, guaranteed.</p>
          <div className="flex flex-col gap-3">
            {[['fa-bolt','Sub-10ms average latency'],['fa-shield-halved','Military-grade AES-256 encryption'],['fa-eye-slash','Strict zero-logs policy']].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-slate-400 text-sm">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <i className={`fa-solid ${icon} text-cyan-400 text-xs`}></i>
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600 text-xs relative z-10">
          <span>© 2024 ShiftLK Netch</span>
          <span>·</span>
          <Link to="/privacy" className="no-underline hover:text-slate-400 transition-colors">Privacy</Link>
          <Link to="/terms" className="no-underline hover:text-slate-400 transition-colors">Terms</Link>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link to="/" className="no-underline flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">N</span>
            </div>
            <span className="text-white font-bold">ShiftLK™</span>
          </Link>

          <h2 className="text-2xl font-black text-white mb-1">{resetMode ? 'Reset Password' : 'Welcome back'}</h2>
          <p className="text-slate-500 text-sm mb-7">{resetMode ? 'Enter your email to receive a reset link.' : 'Sign in to access your dashboard.'}</p>

          {resetMode ? (
            <form onSubmit={handleReset} className="space-y-4">
              <Inp label="Email Address" icon="fa-envelope" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading} />
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Send Reset Link'}
              </button>
              <button type="button" onClick={() => setResetMode(false)} className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"><i className="fa-solid fa-arrow-left mr-2 text-xs"></i>Back to Sign In</button>
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4 mb-5">
                <Inp label="Email Address" icon="fa-envelope" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading} />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-400">Password</label>
                    <button type="button" onClick={() => setResetMode(true)} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-sm pointer-events-none"></i>
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={loading}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm disabled:opacity-50" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                      <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Sign In'}
                </button>
              </form>

              <div className="relative flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="text-xs text-slate-600">or continue with</span>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>

              <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-medium transition-all disabled:opacity-50">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign in with Google
              </button>

              <p className="text-center text-slate-600 text-xs mt-6">
                Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold no-underline transition-colors">Create one →</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
