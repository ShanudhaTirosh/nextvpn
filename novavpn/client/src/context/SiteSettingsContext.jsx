import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SiteSettingsContext = createContext(null);

const SECTIONS = ['hero', 'features', 'faq', 'footer', 'contact', 'navbar', 'webhooks'];

const DEFAULTS = {
  hero: {
    badge: '🚀 Next-Gen VPN',
    title: 'Unrestricted Internet\nFor Sri Lanka',
    subtitle: 'Ultra-fast V2Ray VPN powered by global servers. Works on SLT, Dialog, Mobitel, Hutch & Airtel.',
    ctaText: 'Get Started',
    ctaLink: '/plans',
  },
  features: {
    items: [
      { icon: 'Zap', title: 'Lightning Fast', desc: 'Optimized V2Ray protocol for maximum speed on all ISPs.' },
      { icon: 'Shield', title: 'Fully Encrypted', desc: 'Military-grade encryption keeps your traffic private.' },
      { icon: 'Globe', title: 'Global Servers', desc: 'Multiple server locations for the best latency.' },
      { icon: 'Smartphone', title: 'All Devices', desc: 'Works on Android, iOS, Windows, Mac and more.' },
      { icon: 'Clock', title: '24/7 Support', desc: 'Admin chat support whenever you need it.' },
      { icon: 'BarChart2', title: 'Usage Tracking', desc: 'Real-time data usage stats in your dashboard.' },
    ],
  },
  faq: {
    items: [
      { q: 'How do I set up V2Ray?', a: 'After purchase, you receive a config string. Import it into v2rayNG (Android) or Shadowrocket (iOS).' },
      { q: 'Which ISPs are supported?', a: 'SLT, Dialog, Mobitel, Hutch, and Airtel are all supported.' },
      { q: 'How long until my plan is activated?', a: 'Plans are activated within 30 minutes of payment confirmation.' },
      { q: 'Can I upgrade my plan?', a: 'Yes, contact admin chat to upgrade at any time.' },
    ],
  },
  footer: {
    tagline: 'Fast, secure V2Ray VPN for Sri Lanka.',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Plans', href: '/plans' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    social: { discord: '', whatsapp: '', telegram: '' },
    copyright: `© ${new Date().getFullYear()} NovaVPN. All rights reserved.`,
  },
  contact: { email: 'support@novavpn.lk', discord: '', whatsapp: '', telegram: '' },
  navbar: { logoBase64: '', brandName: 'NovaVPN', links: [] },
  webhooks: { payments: '', chat: '', contact: '' },
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubs = [];

    SECTIONS.forEach((section) => {
      const ref = doc(db, 'siteSettings', section);
      const unsub = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          setSettings((prev) => ({ ...prev, [section]: { ...DEFAULTS[section], ...snap.data() } }));
        }
      });
      unsubs.push(unsub);
    });

    setLoaded(true);
    return () => unsubs.forEach((u) => u());
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loaded }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
}
