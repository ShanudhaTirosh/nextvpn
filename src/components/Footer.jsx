import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="footer-main">
      <div className="footer-gradient-line"></div>
      
      <div className="container-main footer-content">
        <div className="row g-4">
          
          {/* Brand Col */}
          <div className="col-12 col-lg-4 reveal-on-scroll">
            <div className="d-flex align-items-center mb-3">
              <i className="fa-solid fa-shield-halved navbar-brand-icon"></i>
              <div className="footer-brand-text">{settings.siteName}</div>
            </div>
            <p className="footer-tagline">{settings.footerText || 'Premium V2Ray VPN & proxy service built for speed, privacy, and zero restrictions.'}</p>
            <div className="footer-social">
              {settings.socialLinks?.telegram && <a href={settings.socialLinks.telegram} target="_blank" rel="noreferrer"><i className="fa-brands fa-telegram"></i></a>}
              {settings.socialLinks?.whatsapp && <a href={settings.socialLinks.whatsapp} target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i></a>}
              {settings.socialLinks?.discord && <a href={settings.socialLinks.discord} target="_blank" rel="noreferrer"><i className="fa-brands fa-discord"></i></a>}
              {settings.socialLinks?.youtube && <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube"></i></a>}
              {settings.socialLinks?.tiktok && <a href={settings.socialLinks.tiktok} target="_blank" rel="noreferrer"><i className="fa-brands fa-tiktok"></i></a>}
            </div>
          </div>

          {/* Company Col */}
          <div className="col-6 col-md-4 col-lg-2 reveal-on-scroll">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="col-6 col-md-4 col-lg-3 reveal-on-scroll">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/sla">SLA Agreement</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="col-12 col-md-4 col-lg-3 reveal-on-scroll">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-item">
              <i className="fa-solid fa-envelope"></i>
              <span>{settings.contactEmail}</span>
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-phone"></i>
              <span>{settings.phone}</span>
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-location-dot"></i>
              <span>{settings.address}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container-main">
        <div className="footer-bottom reveal-on-scroll">
          <p>© {new Date().getFullYear()} {settings.siteName} · All rights reserved.</p>
          <p>Made with <span className="text-danger">❤️</span> in Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
