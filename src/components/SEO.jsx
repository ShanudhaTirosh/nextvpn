import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords }) => {
  const location = useLocation();
  const siteName = 'ShiftLK Netch';

  useEffect(() => {
    // Update Title
    document.title = title ? `${title} | ${siteName}` : `${siteName} | Next-Gen Privacy & VPN`;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Premium V2Ray & Netch VPN service built for speed, privacy, and zero restrictions.');
    }

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || 'VPN, V2Ray, Netch, Sri Lanka, Privacy, Secure Internet, ShiftLK');
    }

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://shiftlk.web.app${location.pathname}`);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', `https://shiftlk.web.app${location.pathname}`);
      document.head.appendChild(canonical);
    }
  }, [title, description, keywords, location.pathname]);

  return null; // This component doesn't render anything
};

export default SEO;
