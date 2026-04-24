import React, { useState } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { updateDocument, compressImageToBase64 } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
    <input
      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/10 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
  </div>
);

const Profile = () => {
  const { currentUser, userData } = useAuth();
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [photoBase64, setPhotoBase64] = useState(userData?.photoBase64 || '');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast.error('Please upload an image file.'); return; }
    setAvatarLoading(true);
    try {
      const b64 = await compressImageToBase64(file, 200);
      setPhotoBase64(b64);
    } catch (err) {
      showToast.error(err.message || 'Failed to process image.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) { showToast.error('Name cannot be empty.'); return; }
    setProfileLoading(true);
    try {
      await updateProfile(currentUser, { displayName });
      await updateDocument('users', currentUser.uid, { displayName, photoBase64 });
      showToast.success('Profile updated!');
    } catch (err) {
      showToast.error(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.new.length < 6) { showToast.error('Password must be at least 6 characters.'); return; }
    if (passwords.new !== passwords.confirm) { showToast.error('Passwords do not match.'); return; }
    setPasswordLoading(true);
    try {
      await updatePassword(currentUser, passwords.new);
      showToast.success('Password changed successfully!');
      setPasswords({ new: '', confirm: '' });
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') showToast.error('Please re-login to change your password.');
      else showToast.error(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = (displayName || currentUser?.email || 'U')[0].toUpperCase();

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Profile Settings</h1>
        <p className="text-slate-500 text-sm">Manage your personal information and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Profile */}
        <div className="lg:col-span-3 space-y-6">
          {/* Avatar */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white mb-5">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-800">
                  {photoBase64
                    ? <img src={photoBase64} alt="Avatar" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-cyan-400 text-2xl font-black">{initials}</div>
                  }
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center cursor-pointer hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30 ${avatarLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {avatarLoading
                    ? <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                    : <i className="fa-solid fa-camera text-xs"></i>
                  }
                </label>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarLoading} />
              </div>
              <div>
                <p className="text-sm text-white font-semibold mb-1">{displayName || 'Your Name'}</p>
                <p className="text-xs text-slate-500">JPG, PNG or GIF · Max 200KB</p>
                <p className="text-xs text-slate-600 mt-1">Click the camera icon to change your photo.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white mb-5">Personal Information</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <FormInput
                label="Full Name"
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                disabled={profileLoading}
                placeholder="Your full name"
              />
              <FormInput
                label="Email Address (read-only)"
                type="email"
                value={currentUser?.email || ''}
                disabled
                style={{ opacity: 0.5 }}
              />
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {profileLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right — Security */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-cyan-400"></i> Security
            </h2>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <FormInput
                label="New Password"
                type="password"
                autoComplete="new-password"
                value={passwords.new}
                onChange={e => setPasswords({...passwords, new: e.target.value})}
                disabled={passwordLoading}
                placeholder="••••••••"
              />
              <FormInput
                label="Confirm New Password"
                type="password"
                autoComplete="new-password"
                value={passwords.confirm}
                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                disabled={passwordLoading}
                placeholder="••••••••"
              />
              <button
                type="submit"
                disabled={passwordLoading || !passwords.new}
                className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {passwordLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-6">
            <h2 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i> Danger Zone
            </h2>
            <p className="text-xs text-slate-600 mb-4">Deleting your account is irreversible. All your data will be permanently removed.</p>
            <button className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold">
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
