import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerWithEmail, signInWithGoogle } from '../firebase/auth';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';
import { showToast } from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  if (currentUser) {
    const from = location.state?.from?.pathname || '/portal/dashboard';
    navigate(from, { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, agreeTerms } = formData;

    if (!name || !email || !password || !confirmPassword) {
      showToast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showToast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      showToast.error("Password must be at least 6 characters.");
      return;
    }

    if (!agreeTerms) {
      showToast.error("You must agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      showToast.success("Account created successfully!");
      navigate('/portal/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        showToast.error("Email is already registered.");
      } else {
        showToast.error(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!formData.agreeTerms) {
      showToast.error("You must agree to the Terms of Service.");
      return;
    }
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast.success("Successfully logged in with Google!");
      navigate('/portal/dashboard');
    } catch (err) {
      console.error(err);
      showToast.error("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="hero-blob hero-blob-cyan" style={{ top: '10%', left: '10%' }}></div>
      <div className="hero-blob hero-blob-purple" style={{ bottom: '10%', right: '10%' }}></div>

      <GlassCard className="auth-card z-1 reveal-on-scroll" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-flex align-items-center justify-content-center mb-3">
            <i className="fa-solid fa-shield-halved text-cyan fs-3 me-2" style={{ color: 'var(--accent-cyan)' }}></i>
            <h4 className="text-white fw-bold mb-0">ShiftLK <span className="gradient-text">Netch</span></h4>
          </Link>
          <h3 className="text-white fw-bold mb-1">Create Account</h3>
          <p className="text-secondary small">Join thousands of users experiencing true internet freedom.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <div className="position-relative">
              <i className="fa-solid fa-user position-absolute text-muted" style={{ left: '16px', top: '15px' }}></i>
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '44px' }}
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="position-relative">
              <i className="fa-solid fa-envelope position-absolute text-muted" style={{ left: '16px', top: '15px' }}></i>
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '44px' }}
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label">Password</label>
              <div className="position-relative">
                <i className="fa-solid fa-lock position-absolute text-muted" style={{ left: '16px', top: '15px' }}></i>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Confirm Password</label>
              <div className="position-relative">
                <i className="fa-solid fa-lock-check position-absolute text-muted" style={{ left: '16px', top: '15px' }}></i>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
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
          </div>

          <div className="mb-4 form-check">
            <input 
              type="checkbox" 
              className="form-check-input border-secondary bg-dark" 
              id="agreeTerms" 
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={loading}
              style={{ cursor: 'pointer' }}
            />
            <label className="form-check-label text-secondary small" htmlFor="agreeTerms" style={{ cursor: 'pointer' }}>
              I agree to the <Link to="/terms" className="text-white">Terms of Service</Link> and <Link to="/privacy" className="text-white">Privacy Policy</Link>.
            </label>
          </div>

          <button type="submit" className="btn-gradient w-100 justify-content-center" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">or register with</div>

        <button type="button" className="social-btn google" onClick={handleGoogleLogin} disabled={loading}>
          <i className="fa-brands fa-google text-danger"></i> Register with Google
        </button>

        <div className="text-center mt-4 text-secondary small">
          Already have an account? <Link to="/login" className="text-white fw-bold">Sign In</Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Register;
