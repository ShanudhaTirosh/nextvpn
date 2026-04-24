import React, { useState } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { updateDocument, compressImageToBase64 } from '../../firebase/firestore';
import GlassCard from '../../components/GlassCard';
import { showToast } from '../../components/Toast';

const Profile = () => {
  const { currentUser, userData } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
  });
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [photoBase64, setPhotoBase64] = useState(userData?.photoBase64 || '');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      showToast.error("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, { displayName: formData.displayName });
      
      // Update Firestore user document
      await updateDocument('users', currentUser.uid, { 
        displayName: formData.displayName,
        photoBase64: photoBase64
      });
      
      showToast.success("Profile updated successfully!");
    } catch (err) {
      showToast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      showToast.error("Password must be at least 6 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentUser, passwords.newPassword);
      showToast.success("Password updated successfully!");
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        showToast.error("Please log out and log back in to change your password.");
      } else {
        showToast.error(err.message || "Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showToast.error("Please upload an image file.");
      return;
    }

    try {
      const base64 = await compressImageToBase64(file, 200); // 200kb max for avatars
      setPhotoBase64(base64);
    } catch (err) {
      showToast.error(err.message || "Failed to process image.");
    }
  };

  return (
    <div className="animation-fade-in">
      <h2 className="text-white fw-bold mb-4">Profile Settings</h2>

      <div className="row g-4">
        {/* Profile Details Form */}
        <div className="col-12 col-lg-7">
          <GlassCard className="p-4">
            <h5 className="text-white mb-4 border-bottom border-secondary pb-3">Personal Information</h5>
            
            <div className="d-flex align-items-center gap-4 mb-4">
              <div className="position-relative">
                <img 
                  src={photoBase64 || 'https://placehold.co/80x80/121826/00E5FF?text=U'}
                  alt="Avatar" 
                  className="rounded-circle border border-2 border-cyan" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <label 
                  htmlFor="avatar-upload" 
                  className="position-absolute bottom-0 end-0 bg-cyan text-dark rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '28px', height: '28px', cursor: 'pointer', background: 'var(--accent-cyan)' }}
                >
                  <i className="fa-solid fa-camera small"></i>
                </label>
                <input type="file" id="avatar-upload" className="d-none" accept="image/*" onChange={handleAvatarUpload} />
              </div>
              <div>
                <h6 className="text-white mb-1">Profile Avatar</h6>
                <p className="text-muted small mb-0">JPG, GIF or PNG. Max size of 200K.</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.displayName} 
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Email Address <span className="text-muted small">(Cannot be changed)</span></label>
                <input 
                  type="email" 
                  className="form-input text-muted" 
                  value={currentUser?.email || ''} 
                  disabled 
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                />
              </div>
              
              <div className="text-end">
                <button type="submit" className="btn-gradient px-4" disabled={loading}>
                  {loading ? <div className="spinner"></div> : 'Save Changes'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Security Form */}
        <div className="col-12 col-lg-5">
          <GlassCard className="p-4 h-100">
            <h5 className="text-white mb-4 border-bottom border-secondary pb-3">Security & Password</h5>
            
            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  autoComplete="new-password"
                  className="form-input" 
                  placeholder="••••••••"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  autoComplete="new-password"
                  className="form-input" 
                  placeholder="••••••••"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  disabled={loading}
                />
              </div>
              
              <div className="text-end mt-auto">
                <button type="submit" className="btn-ghost border-secondary w-100" disabled={loading || !passwords.newPassword}>
                  Update Password
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-top border-secondary">
              <h6 className="text-danger mb-2">Danger Zone</h6>
              <p className="text-muted small mb-3">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="btn btn-outline-danger w-100 py-2">Delete Account</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
