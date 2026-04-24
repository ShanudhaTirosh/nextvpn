import React from 'react';

import GlassCard from '../../components/GlassCard';

const Tutorials = () => {
  return (
    <div className="animation-fade-in">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="text-white fw-bold mb-1">Setup Tutorials</h2>
          <p className="text-secondary mb-0">Learn how to configure your device to connect to our network.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Android Tutorial */}
        <div className="col-12 col-md-6">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <i className="fa-brands fa-android fs-1 text-success"></i>
              <h4 className="text-white mb-0">Android Setup</h4>
            </div>
            
            <ol className="text-secondary ps-3 mb-4" style={{ lineHeight: '1.8' }}>
              <li>Download <strong>v2rayNG</strong> from the Google Play Store.</li>
              <li>Go to the <a href="/portal/dashboard" className="text-cyan text-decoration-none">Dashboard</a> and copy your server config link.</li>
              <li>Open v2rayNG and click the <strong>+</strong> icon in the top right corner.</li>
              <li>Select <strong>Import config from Clipboard</strong>.</li>
              <li>Select the newly added profile and tap the <strong>V</strong> icon at the bottom right to connect.</li>
            </ol>
            
            <a href="https://play.google.com/store/apps/details?id=com.v2ray.ang" target="_blank" rel="noreferrer" className="btn-ghost d-inline-flex w-100 justify-content-center border-secondary text-white">
              Get v2rayNG
            </a>
          </GlassCard>
        </div>

        {/* iOS Tutorial */}
        <div className="col-12 col-md-6">
          <GlassCard className="p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <i className="fa-brands fa-apple fs-1 text-white"></i>
              <h4 className="text-white mb-0">iOS / iPhone Setup</h4>
            </div>
            
            <ol className="text-secondary ps-3 mb-4" style={{ lineHeight: '1.8' }}>
              <li>Download <strong>V2Box</strong> or <strong>Shadowrocket</strong> (Paid) from the App Store.</li>
              <li>Go to the <a href="/portal/dashboard" className="text-cyan text-decoration-none">Dashboard</a> and copy your server config link.</li>
              <li>Open V2Box and click the <strong>+</strong> icon.</li>
              <li>Select <strong>Import from Clipboard</strong>.</li>
              <li>Go back to the Home tab, slide to connect, and allow VPN profile installation.</li>
            </ol>
            
            <a href="https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690" target="_blank" rel="noreferrer" className="btn-ghost d-inline-flex w-100 justify-content-center border-secondary text-white">
              Get V2Box
            </a>
          </GlassCard>
        </div>

        {/* Windows PC Tutorial */}
        <div className="col-12">
          <GlassCard className="p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <i className="fa-brands fa-windows fs-1 text-info"></i>
              <h4 className="text-white mb-0">Windows PC Setup (v2rayN)</h4>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <ol className="text-secondary ps-3 mb-4" style={{ lineHeight: '1.8' }}>
                  <li>Download the latest release of <strong>v2rayN-Core.zip</strong> from GitHub.</li>
                  <li>Extract the ZIP file to a folder and run <code>v2rayN.exe</code>.</li>
                  <li>Go to the <a href="/portal/dashboard" className="text-cyan text-decoration-none">Dashboard</a> and copy your config.</li>
                  <li>Open v2rayN, click on <strong>Servers (S)</strong> menu, and select <strong>Import bulk URL from clipboard (Ctrl+V)</strong>.</li>
                  <li>Select the server, press Enter, right-click the tray icon at the bottom right, and select <strong>Set system proxy</strong>.</li>
                </ol>
              </div>
              <div className="col-md-6">
                <div className="bg-dark rounded-3 p-3 border border-secondary h-100">
                  <h6 className="text-warning mb-2"><i className="fa-solid fa-triangle-exclamation me-2"></i> Important Note</h6>
                  <p className="text-secondary small mb-0">
                    If v2rayN does not open, you may need to install the Microsoft .NET 6.0 Desktop Runtime. 
                    Ensure your system time is accurately synced with the internet, otherwise the V2Ray connection will fail.
                  </p>
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
