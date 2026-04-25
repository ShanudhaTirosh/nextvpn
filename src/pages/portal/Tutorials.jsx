import React from 'react';
import GlassCard from '../../components/GlassCard';
import { useDocument } from '../../hooks/useFirestore';

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

const Tutorials = () => {
  const { data: remoteData } = useDocument('siteSettings', 'tutorials');
  const data = remoteData ? {
    android: { ...DEFAULT_TUTORIALS.android, ...remoteData.android },
    ios: { ...DEFAULT_TUTORIALS.ios, ...remoteData.ios },
    windows: { ...DEFAULT_TUTORIALS.windows, ...remoteData.windows }
  } : DEFAULT_TUTORIALS;

  return (
    <div className="animation-fade-in">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1">Setup Tutorials</h2>
          <p className="text-slate-400 mb-0 text-sm">Learn how to configure your device to connect to our network.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Android Tutorial */}
        <div className="col-12 col-md-6">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <i className="fa-brands fa-android fs-1 text-success"></i>
              <h4 className="text-white mb-0">{data.android.title}</h4>
            </div>
            
            <ol className="text-slate-400 ps-3 mb-4 text-sm" style={{ lineHeight: '1.8' }}>
              {data.android.steps.split('\n').filter(s => s.trim()).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            
            <a href={data.android.linkUrl} target="_blank" rel="noreferrer" className="btn-ghost d-inline-flex w-100 justify-content-center border-slate-700 text-white hover:border-cyan-500/50 hover:bg-cyan-500/5">
              {data.android.linkText}
            </a>
          </GlassCard>
        </div>

        {/* iOS Tutorial */}
        <div className="col-12 col-md-6">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <i className="fa-brands fa-apple fs-1 text-white"></i>
              <h4 className="text-white mb-0">{data.ios.title}</h4>
            </div>
            
            <ol className="text-slate-400 ps-3 mb-4 text-sm" style={{ lineHeight: '1.8' }}>
              {data.ios.steps.split('\n').filter(s => s.trim()).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            
            <a href={data.ios.linkUrl} target="_blank" rel="noreferrer" className="btn-ghost d-inline-flex w-100 justify-content-center border-slate-700 text-white hover:border-cyan-500/50 hover:bg-cyan-500/5">
              {data.ios.linkText}
            </a>
          </GlassCard>
        </div>

        {/* Windows PC Tutorial */}
        <div className="col-12">
          <GlassCard className="p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <i className="fa-brands fa-windows fs-1 text-info"></i>
              <h4 className="text-white mb-0">{data.windows.title}</h4>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <ol className="text-slate-400 ps-3 mb-4 text-sm" style={{ lineHeight: '1.8' }}>
                  {data.windows.steps.split('\n').filter(s => s.trim()).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="col-md-6">
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800 h-100 d-flex flex-column">
                  <div>
                    <h6 className="text-amber-400 mb-2 font-bold text-sm"><i className="fa-solid fa-triangle-exclamation me-2"></i> Important Note</h6>
                    <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                      {data.windows.note}
                    </p>
                  </div>
                  
                  {data.windows.linkUrl && (
                    <a href={data.windows.linkUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-auto d-inline-flex w-100 justify-content-center border-slate-700 text-white hover:border-cyan-500/50 hover:bg-cyan-500/5">
                      {data.windows.linkText || 'Download App'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
