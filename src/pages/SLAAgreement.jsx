import React from 'react';

const SLAAgreement = () => {
  return (
    <div className="legal-page section-bg-primary min-vh-100 pt-5">
      <div className="container-main section-padding">
        <div className="text-center reveal-on-scroll mb-5">
          <div className="section-eyebrow">Legal</div>
          <h1 className="section-title text-white">Service Level <span className="gradient-text">Agreement</span></h1>
          <p className="text-secondary mt-3">Last Updated: March 15, 2024</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 reveal-on-scroll">
            <div className="legal-content glass-card p-4 p-md-5">
              <p className="lead text-white mb-5">
                This Service Level Agreement (SLA) outlines our commitment to service reliability and the compensation available to our users in the event of service downtime.
              </p>

              <h2>1. Uptime Guarantee</h2>
              <p>ShiftLK Netch Solutions guarantees a <strong>99.9% network uptime</strong> in any given calendar month. This uptime guarantee covers our core network infrastructure and the availability of at least 80% of our global server nodes.</p>

              <h2>2. Scheduled Maintenance</h2>
              <p>To ensure optimal performance, we occasionally perform scheduled maintenance. Scheduled maintenance is not considered downtime. We will notify users of scheduled maintenance at least 48 hours in advance via the portal announcements.</p>

              <h2>3. Downtime Definition</h2>
              <p>Downtime is defined as a complete loss of connectivity to all servers in our network due to infrastructure failure on our end. Issues related to your local ISP, strict firewalls blocking specific protocols, or your local device configurations are not classified as downtime.</p>

              <h2>4. SLA Credits</h2>
              <p>If we fail to meet our 99.9% uptime guarantee, eligible users (Pro and Elite plans) may request SLA credits. Credits are calculated as follows:</p>
              <ul>
                <li><strong className="text-white">99.0% - 99.8% Uptime:</strong> 3 days added to your subscription.</li>
                <li><strong className="text-white">95.0% - 98.9% Uptime:</strong> 7 days added to your subscription.</li>
                <li><strong className="text-white">&lt; 95.0% Uptime:</strong> 15 days added to your subscription.</li>
              </ul>

              <h2>5. Claiming Credits</h2>
              <p>To request an SLA credit, you must submit a support ticket within 7 days of the downtime event. We will review network logs and process the credit within 48 hours if verified.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLAAgreement;
