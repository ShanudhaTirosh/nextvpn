/**
 * seed.js — Run once to bootstrap your Firestore database
 * Usage: node seed.js
 * Requires: firebase-service-account.json in same directory
 */
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed() {
  console.log('🌱 Seeding NovaVPN Firestore...\n');

  // ── Plans ──────────────────────────────────────────────────────────────────
  const plans = [
    {
      name: 'Starter',
      price: 299,
      duration: 30,
      dataLimitGB: 10,
      features: ['10 GB Data', '30 Days Validity', 'All ISPs Supported', '1 Device', 'Standard Speed'],
      badge: '',
      active: true,
    },
    {
      name: 'Pro',
      price: 599,
      duration: 30,
      dataLimitGB: 30,
      features: ['30 GB Data', '30 Days Validity', 'All ISPs Supported', '2 Devices', 'High Speed', 'Priority Support'],
      badge: '🔥 Most Popular',
      active: true,
    },
    {
      name: 'Ultra',
      price: 999,
      duration: 30,
      dataLimitGB: 100,
      features: ['100 GB Data', '30 Days Validity', 'All ISPs Supported', '5 Devices', 'Ultra Speed', '24/7 Priority Support', 'Multiple Servers'],
      badge: '',
      active: true,
    },
  ];

  for (const plan of plans) {
    const ref = await db.collection('plans').add({ ...plan, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log(`  ✓ Plan created: ${plan.name} (${ref.id})`);
  }

  // ── Site Settings ──────────────────────────────────────────────────────────
  const siteSettings = {
    hero: {
      badge: '🚀 Sri Lanka\'s Fastest V2Ray VPN',
      title: 'Unrestricted Internet\nFor Sri Lanka',
      subtitle: 'Ultra-fast V2Ray VPN powered by global servers. Works seamlessly on SLT, Dialog, Mobitel, Hutch & Airtel.',
      ctaText: 'Get Started Free',
      ctaLink: '/plans',
    },
    features: {
      items: [
        { icon: 'Zap', title: 'Lightning Fast', desc: 'Optimized V2Ray protocol delivers maximum speed on all Sri Lankan ISPs.' },
        { icon: 'Shield', title: 'Fully Encrypted', desc: 'Military-grade TLS encryption keeps your data completely private.' },
        { icon: 'Globe', title: 'Global Servers', desc: 'Multiple server locations for the lowest possible latency.' },
        { icon: 'Smartphone', title: 'All Devices', desc: 'Works on Android, iOS, Windows, macOS, and Linux.' },
        { icon: 'Clock', title: '24/7 Support', desc: 'Admin chat support available whenever you need help.' },
        { icon: 'BarChart2', title: 'Usage Tracking', desc: 'Real-time data usage stats directly in your dashboard.' },
      ],
    },
    faq: {
      items: [
        { q: 'How do I set up V2Ray?', a: 'After purchase, you receive a config string. Import it into v2rayNG (Android) or Shadowrocket (iOS) and tap connect.' },
        { q: 'Which ISPs are supported?', a: 'NovaVPN works on SLT, Dialog, Mobitel, Hutch, and Airtel — all major Sri Lankan ISPs.' },
        { q: 'How long until my plan is activated?', a: 'Plans are activated within 30 minutes of payment confirmation during business hours.' },
        { q: 'Can I use on multiple devices?', a: 'Yes, depending on your plan. Starter supports 1 device, Pro supports 2, and Ultra supports 5.' },
        { q: 'What payment methods do you accept?', a: 'We accept bank transfers and QR code payments. Upload your payment screenshot for verification.' },
        { q: 'Can I get a refund?', a: 'We offer refunds within 24 hours if the service has not been used. Contact admin chat for assistance.' },
      ],
    },
    footer: {
      tagline: 'Fast, secure V2Ray VPN for all Sri Lankans.',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Plans', href: '/plans' },
        { label: 'Dashboard', href: '/dashboard' },
      ],
      social: { discord: '', whatsapp: '', telegram: '' },
      copyright: `© ${new Date().getFullYear()} NovaVPN. All rights reserved.`,
    },
    contact: {
      email: 'support@novavpn.lk',
      discord: '',
      whatsapp: '',
      telegram: '',
    },
    navbar: {
      logoBase64: '',
      brandName: 'NovaVPN',
    },
    webhooks: {
      payments: '',
      chat: '',
      contact: '',
    },
  };

  for (const [section, data] of Object.entries(siteSettings)) {
    await db.collection('siteSettings').doc(section).set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ siteSettings/${section} written`);
  }

  console.log('\n✅ Seed complete! Don\'t forget to:');
  console.log('  1. Set your admin user role: users/{your-uid} → role: "admin"');
  console.log('  2. Configure Discord webhook URLs in Admin → Webhooks');
  console.log('  3. Add your 3x-UI server credentials to server/.env');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
