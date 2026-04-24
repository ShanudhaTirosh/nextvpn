import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle, resetPassword } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';
import { showToast } from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Redirect if already logged in
  if (currentUser) {
    const from = location.state?.from?.pathname || '/portal/dashboard';
    navigate(from, { replace: true });
    return null;
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast.error("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      showToast.success("Successfully logged in!");
      const from = location.state?.from?.pathname || '/portal/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        showToast.error("Invalid email or password.");
      } else {
        showToast.error(err.message || "Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast.success("Successfully logged in with Google!");
      const from = location.state?.from?.pathname || '/portal/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      showToast.error("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast.error("Please enter your email address first.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      showToast.success("Password reset email sent! Check your inbox.");
      setResetMode(false);
    } catch (err) {
      showToast.error(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="hero-blob hero-blob-cyan" style={{ top: '10%', left: '10%' }}></div>
      <div className="hero-blob hero-blob-purple" style={{ bottom: '10%', right: '10%' }}></div>

      <GlassCard className="auth-card z-1 reveal-on-scroll">
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-flex align-items-center justify-content-center mb-3">
            <i className="fa-solid fa-shield-halved text-cyan fs-3 me-2" style={{ color: 'var(--accent-cyan)' }}></i>
            <h4 className="text-white fw-bold mb-0">ShiftLK <span className="gradient-text">Netch</span></h4>
          </Link>
          <h3 className="text-white fw-bold mb-1">{resetMode ? 'Reset Password' : 'Welcome Back'}</h3>
          <p className="text-secondary small">{resetMode ? 'Enter your email to receive a reset link.' : 'Sign in to access your dashboard.'}</p>
        </div>

        {resetMode ? (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-gradient w-100 justify-content-center mb-3" disabled={loading}>
              {loading ? <div className="spinner"></div> : 'Send Reset Link'}
            </button>
            <div className="text-center">
              <button type="button" className="btn btn-link text-decoration-none text-muted p-0" onClick={() => setResetMode(false)} disabled={loading}>
                <i className="fa-solid fa-arrow-left me-1"></i> Back to Login
              </button>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleEmailLogin}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <div className="position-relative">
                  <i className="fa-solid fa-envelope position-absolute text-muted" style={{ left: '16px', top: '15px' }}></i>
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: '44px' }}
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0">Password</label>
                  <button type="button" className="btn btn-link text-decoration-none text-muted p-0" style={{ fontSize: '0.8rem' }} onClick={() => setResetMode(true)}>
                    Forgot password?
                  </button>
                </div>
                <div className="position-relative">
                  <i className="fa-solid fa-lock position-absolute text-muted" style={{ left: '16px', top: '15px' }}></i>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    style={{ paddingLeft: '44px', paddingRight: '44px' }}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <i 
                    className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute text-muted`} 
                    style={{ right: '16px', top: '15px', cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>

              <button type="submit" className="btn-gradient w-100 justify-content-center" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider">or continue with</div>

            <button type="button" className="social-btn google" onClick={handleGoogleLogin} disabled={loading}>
              <i className="fa-brands fa-google text-danger"></i> Sign in with Google
            </button>

            <div className="text-center mt-4 text-secondary small">
              Don't have an account? <Link to="/register" className="text-white fw-bold">Register</Link>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default Login;
