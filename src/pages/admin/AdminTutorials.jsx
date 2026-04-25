import React, { useState, useEffect } from 'react';
import { useDocument } from '../../hooks/useFirestore';
import { setDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';
import { logActivity } from '../../hooks/useActivityLog';

const DEFAULT_TUTORIALS = {
  android: {
    title: 'Android Setup',
    steps: "Download v2rayNG from the Google Play Store.\nGo to the Dashboard and copy your server config link.\nOpen v2rayNG and click the + icon in the top right corner.\nSelect Import config from Clipboard.\nSelect the newly added profile and tap the V icon at the bottom right to connect.",
    linkText: 'Get v2rayNG',
    linkUrl: 'https://play.google.com/store/apps/details?id=com.v2ray.ang'
  },
  ios: {
    title: 'iOS / iPhone Setup',
    steps: "Download V2Box or Shadowrocket (Paid) from the App Store.\nGo to the Dashboard and copy your server config link.\nOpen V2Box and click the + icon.\nSelect Import from Clipboard.\nGo back to the Home tab, slide to connect, and allow VPN profile installation.",
    linkText: 'Get V2Box',
    linkUrl: 'https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690'
  },
  windows: {
    title: 'Windows PC Setup (v2rayN)',
    steps: "Download the latest release of v2rayN-Core.zip from GitHub.\nExtract the ZIP file to a folder and run v2rayN.exe.\nGo to the Dashboard and copy your config.\nOpen v2rayN, click on Servers (S) menu, and select Import bulk URL from clipboard (Ctrl+V).\nSelect the server, press Enter, right-click the tray icon at the bottom right, and select Set system proxy.",
    note: "If v2rayN does not open, you may need to install the Microsoft .NET 6.0 Desktop Runtime. Ensure your system time is accurately synced with the internet, otherwise the V2Ray connection will fail.",
    linkText: 'Download v2rayN',
    linkUrl: 'https://github.com/2dust/v2rayN/releases'
  }
};

const F = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
    {children}
  </div>
);
const inp = "w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm";

const AdminTutorials = () => {
  const { data: tutorialsData, loading } = useDocument('siteSettings', 'tutorials');
  const [formData, setFormData] = useState(DEFAULT_TUTORIALS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tutorialsData) {
      setFormData({
        android: { ...DEFAULT_TUTORIALS.android, ...tutorialsData.android },
        ios: { ...DEFAULT_TUTORIALS.ios, ...tutorialsData.ios },
        windows: { ...DEFAULT_TUTORIALS.windows, ...tutorialsData.windows }
      });
    }
  }, [tutorialsData]);

  const handleChange = (platform, field, value) => {
    setFormData(prev => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDocument('siteSettings', 'tutorials', formData);
      await logActivity('system', 'Updated connection tutorials.', 'info');
      showToast.success('Tutorials updated successfully!');
    } catch (err) {
      console.error(err);
      showToast.error('Failed to update tutorials.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24"><i className="fa-solid fa-spinner animate-spin text-cyan-500 text-2xl"></i></div>;
  }

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manage Tutorials</h1>
          <p className="text-slate-500 text-sm">Edit the connection guides shown to clients.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          {isSaving ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : <i className="fa-solid fa-floppy-disk mr-2"></i>}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Android */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <i className="fa-brands fa-android text-2xl text-emerald-400"></i>
            <h2 className="text-lg font-bold text-white">Android Settings</h2>
          </div>
          <F label="Title">
            <input className={inp} value={formData.android.title} onChange={e => handleChange('android', 'title', e.target.value)} />
          </F>
          <F label="Steps (One per line)">
            <textarea rows={6} className={`${inp} font-mono text-xs`} value={formData.android.steps} onChange={e => handleChange('android', 'steps', e.target.value)} placeholder="Step 1...&#10;Step 2..." />
          </F>
          <div className="grid grid-cols-2 gap-4">
            <F label="Button Text"><input className={inp} value={formData.android.linkText} onChange={e => handleChange('android', 'linkText', e.target.value)} /></F>
            <F label="App URL"><input className={inp} value={formData.android.linkUrl} onChange={e => handleChange('android', 'linkUrl', e.target.value)} /></F>
          </div>
        </div>

        {/* iOS */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <i className="fa-brands fa-apple text-2xl text-white"></i>
            <h2 className="text-lg font-bold text-white">iOS Settings</h2>
          </div>
          <F label="Title">
            <input className={inp} value={formData.ios.title} onChange={e => handleChange('ios', 'title', e.target.value)} />
          </F>
          <F label="Steps (One per line)">
            <textarea rows={6} className={`${inp} font-mono text-xs`} value={formData.ios.steps} onChange={e => handleChange('ios', 'steps', e.target.value)} placeholder="Step 1...&#10;Step 2..." />
          </F>
          <div className="grid grid-cols-2 gap-4">
            <F label="Button Text"><input className={inp} value={formData.ios.linkText} onChange={e => handleChange('ios', 'linkText', e.target.value)} /></F>
            <F label="App URL"><input className={inp} value={formData.ios.linkUrl} onChange={e => handleChange('ios', 'linkUrl', e.target.value)} /></F>
          </div>
        </div>

        {/* Windows */}
        <div className="col-span-1 lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <i className="fa-brands fa-windows text-2xl text-blue-400"></i>
            <h2 className="text-lg font-bold text-white">Windows Settings</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <F label="Title">
                <input className={inp} value={formData.windows.title} onChange={e => handleChange('windows', 'title', e.target.value)} />
              </F>
              <F label="Steps (One per line)">
                <textarea rows={6} className={`${inp} font-mono text-xs`} value={formData.windows.steps} onChange={e => handleChange('windows', 'steps', e.target.value)} placeholder="Step 1...&#10;Step 2..." />
              </F>
            </div>
            <div>
              <F label="Important Note (Warning box)">
                <textarea rows={4} className={inp} value={formData.windows.note} onChange={e => handleChange('windows', 'note', e.target.value)} placeholder="Warning message for Windows users..." />
              </F>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <F label="Button Text"><input className={inp} value={formData.windows.linkText} onChange={e => handleChange('windows', 'linkText', e.target.value)} /></F>
                <F label="App URL"><input className={inp} value={formData.windows.linkUrl} onChange={e => handleChange('windows', 'linkUrl', e.target.value)} /></F>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTutorials;
