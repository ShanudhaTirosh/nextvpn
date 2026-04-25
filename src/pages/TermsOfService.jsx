import React from 'react';
import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <div className="legal-page section-bg-primary min-vh-100 pt-5">
      <SEO 
        title="Terms of Service" 
        description="ShiftLK Netch Solutions Terms of Service. Read about our acceptable use policy, account responsibilities, and service conditions." 
        keywords="VPN terms of service, ShiftLK terms, service agreement"
      />
      <div className="container-main section-padding">
        <div className="text-center reveal-on-scroll mb-5">
          <div className="section-eyebrow">Legal</div>
          <h1 className="section-title text-white">Terms of <span className="gradient-text">Service</span></h1>
          <p className="text-secondary mt-3">Last Updated: March 15, 2024</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 reveal-on-scroll">
            <div className="legal-content glass-card p-4 p-md-5">
              <p className="lead text-white mb-5">
                Please read these terms carefully before using ShiftLK Netch Solutions. By registering an account and using our services, you agree to be bound by these terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using the ShiftLK Netch service, you confirm that you agree to these Terms of Service. If you do not agree, you must not use our services.</p>

              <h2>2. Service Description</h2>
              <p>ShiftLK Netch provides secure virtual private network (VPN) and proxy services utilizing the V2Ray framework. Our service is designed to provide privacy, security, and unrestricted internet access.</p>

              <h2>3. Acceptable Use Policy</h2>
              <p>While we value privacy and do not log your traffic, our service must not be used for illegal activities. You agree NOT to use the service for:</p>
              <ul>
                <li>Distributing malware, viruses, or any other destructive software.</li>
                <li>Conducting denial of service (DDoS) attacks, hacking, or port scanning.</li>
                <li>Distributing child exploitation material.</li>
                <li>Spamming or sending unsolicited bulk emails.</li>
                <li>Engaging in any activity that violates the laws of your jurisdiction or the jurisdiction of the server you are connected to.</li>
              </ul>
              <p>We reserve the right to terminate accounts immediately without refund if we receive abuse reports linked to your account.</p>

              <h2>4. Account Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You are not permitted to share, resell, or distribute your V2Ray configurations to third parties unless you are on an approved Reseller plan.</p>

              <h2>5. Payments and Refunds</h2>
              <p>All payments are processed manually. Services are activated upon verification of your payment proof. We offer a 3-day money-back guarantee if you are unsatisfied with the service performance, provided you have not violated our Acceptable Use Policy.</p>

              <h2>6. Service Availability</h2>
              <p>We strive to maintain 99.9% uptime. However, services may occasionally be disrupted due to maintenance, network failures, or events beyond our control. We are not liable for any damages resulting from service interruptions.</p>

              <h2>7. Changes to Terms</h2>
              <p>We may update these terms occasionally. Continued use of the service after changes implies acceptance of the new terms. We will notify users of significant changes via the announcement banner.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
