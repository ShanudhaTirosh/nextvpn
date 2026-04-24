import React, { useEffect, useState } from 'react';


const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('data-collection');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['data-collection', 'data-usage', 'data-protection', 'cookies', 'third-party', 'rights'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="legal-page section-bg-primary min-vh-100 pt-5">
      <div className="container-main section-padding">
        <div className="text-center reveal-on-scroll mb-5">
          <div className="section-eyebrow">Legal</div>
          <h1 className="section-title text-white">Privacy <span className="gradient-text">Policy</span></h1>
          <p className="text-secondary mt-3">Last Updated: March 15, 2024</p>
        </div>

        <div className="row position-relative">
          {/* TOC - Desktop Only */}
          <div className="col-12 col-lg-3 d-none d-lg-block reveal-on-scroll">
            <div className="legal-toc">
              <h6 className="text-white mb-3 ps-3">Contents</h6>
              <nav>
                <a href="#data-collection" onClick={(e) => { e.preventDefault(); scrollToSection('data-collection'); }} className={activeSection === 'data-collection' ? 'active' : ''}>1. Information We Collect</a>
                <a href="#data-usage" onClick={(e) => { e.preventDefault(); scrollToSection('data-usage'); }} className={activeSection === 'data-usage' ? 'active' : ''}>2. How We Use Information</a>
                <a href="#data-protection" onClick={(e) => { e.preventDefault(); scrollToSection('data-protection'); }} className={activeSection === 'data-protection' ? 'active' : ''}>3. Data Protection (Zero Logs)</a>
                <a href="#cookies" onClick={(e) => { e.preventDefault(); scrollToSection('cookies'); }} className={activeSection === 'cookies' ? 'active' : ''}>4. Cookies & Tracking</a>
                <a href="#third-party" onClick={(e) => { e.preventDefault(); scrollToSection('third-party'); }} className={activeSection === 'third-party' ? 'active' : ''}>5. Third-Party Services</a>
                <a href="#rights" onClick={(e) => { e.preventDefault(); scrollToSection('rights'); }} className={activeSection === 'rights' ? 'active' : ''}>6. Your Privacy Rights</a>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-12 col-lg-9 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
            <div className="legal-content glass-card p-4 p-md-5">
              <p className="lead text-white mb-5">
                At ShiftLK Netch Solutions, your privacy is our highest priority. We believe that internet access should be free, open, and strictly confidential. This Privacy Policy outlines our practices regarding data collection and protection.
              </p>

              <div id="data-collection">
                <h2>1. Information We Collect</h2>
                <p>To provide our services, we only collect the absolute minimum information necessary for account management and billing. This includes:</p>
                <ul>
                  <li><strong className="text-white">Account Information:</strong> Your email address and a display name (required for communication and account recovery).</li>
                  <li><strong className="text-white">Payment Information:</strong> Transaction references and payment proof screenshots (required to activate your subscription). We do not process credit cards directly.</li>
                  <li><strong className="text-white">Support Communications:</strong> Any information you voluntarily provide when submitting a support ticket.</li>
                </ul>
              </div>

              <div id="data-usage">
                <h2>2. How We Use Information</h2>
                <p>The information we collect is used solely for the following purposes:</p>
                <ul>
                  <li>To create and manage your account.</li>
                  <li>To process your payments and activate your subscriptions.</li>
                  <li>To provide technical support and respond to inquiries.</li>
                  <li>To send important service announcements (e.g., server maintenance, security updates).</li>
                </ul>
              </div>

              <div id="data-protection">
                <h2>3. Data Protection & Zero Logs Policy</h2>
                <p>We operate under a strict <strong>Zero Logs Policy</strong>. This means we do <strong>NOT</strong> collect, monitor, or store any of the following:</p>
                <div className="p-4 bg-dark border border-secondary rounded-3 mb-4">
                  <ul className="mb-0 text-danger fw-bold">
                    <li><i className="fa-solid fa-xmark me-2"></i> Browsing history or visited websites</li>
                    <li><i className="fa-solid fa-xmark me-2"></i> Traffic destination or metadata</li>
                    <li><i className="fa-solid fa-xmark me-2"></i> DNS queries</li>
                    <li><i className="fa-solid fa-xmark me-2"></i> Your original IP address when connected</li>
                  </ul>
                </div>
                <p>Our servers are configured to run in RAM-only mode where possible, ensuring that any transient routing data is wiped instantly upon server reboot.</p>
              </div>

              <div id="cookies">
                <h2>4. Cookies & Tracking</h2>
                <p>Our website uses essential cookies strictly for functional purposes, such as keeping you logged into the client portal. We do not use third-party tracking cookies or advertising pixels to monitor your behavior across the web.</p>
              </div>

              <div id="third-party">
                <h2>5. Third-Party Services</h2>
                <p>We use Firebase (Google) for authentication and database management. While your email and account data are stored securely on Firebase, all connection data and VPN routing happen exclusively on our privately managed infrastructure, which Google has no access to.</p>
              </div>

              <div id="rights">
                <h2>6. Your Privacy Rights</h2>
                <p>You have full control over your data. You may:</p>
                <ul>
                  <li>Request a copy of all personal data we hold about you.</li>
                  <li>Correct any inaccurate data.</li>
                  <li>Permanently delete your account and all associated data from your client portal at any time.</li>
                </ul>
                <p className="mt-4">If you have any questions regarding this policy, please contact us at <a href="mailto:privacy@shiftlk.net">privacy@shiftlk.net</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        className={`back-to-top ${activeSection !== 'data-collection' ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default PrivacyPolicy;
