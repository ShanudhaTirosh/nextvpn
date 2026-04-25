import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import TestimonialCard from '../components/TestimonialCard';
import LocationCard from '../components/LocationCard';
import PaymentModal from '../components/PaymentModal';
import CounterStat from '../components/CounterStat';
import StayUpdatedBanner from '../components/StayUpdatedBanner';
import { useAuth } from '../hooks/useAuth';
import { useRealtimeCollection, useDocument } from '../hooks/useFirestore';

const Home = () => {
  const { currentUser } = useAuth();
  
  // Data fetching
  const { data: config } = useDocument('siteSettings', 'config');
  const { data: servers } = useRealtimeCollection('servers', []);
  const { data: packages } = useRealtimeCollection('packages', []);
  const { data: testimonials } = useRealtimeCollection('testimonials', []);

  // UI State
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All');



  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setShowPayment(true);
  };

  // Fallback data if Firestore is empty
  const features = config?.features || [
    { icon:"fa-infinity", title:"Unlimited Bandwidth", desc:"No caps, no throttling." },
    { icon:"fa-network-wired", title:"V2Ray Protocol", desc:"VMess, VLESS, Trojan support." },
    { icon:"fa-lock", title:"AES-256 Encryption", desc:"Military-grade security." },
    { icon:"fa-globe", title:"5+ Locations", desc:"Servers across 4 continents." },
    { icon:"fa-shield-halved", title:"DDoS Protection", desc:"Every server protected." },
    { icon:"fa-eye-slash", title:"Zero Logs Policy", desc:"We never track you." }
  ];

  const displayServers = servers?.length > 0 ? servers : [
    { id: 1, name: 'Singapore Premium', country: 'Singapore', flagEmoji: '🇸🇬', protocol: 'VMess', latencyMs: 45, activeUsers: 120, maxUsers: 200, isOnline: true, isDDoSProtected: true, region: 'Asia' },
    { id: 2, name: 'Tokyo Fast', country: 'Japan', flagEmoji: '🇯🇵', protocol: 'VLESS', latencyMs: 110, activeUsers: 85, maxUsers: 150, isOnline: true, isDDoSProtected: true, region: 'Asia' },
    { id: 3, name: 'London Secure', country: 'UK', flagEmoji: '🇬🇧', protocol: 'Trojan', latencyMs: 180, activeUsers: 40, maxUsers: 100, isOnline: true, isDDoSProtected: false, region: 'Europe' }
  ];

  const filteredServers = locationFilter === 'All' 
    ? displayServers 
    : displayServers.filter(s => s.region === locationFilter);

  const displayPackages = packages?.length > 0 ? packages.filter(p => p.isVisible).sort((a,b) => a.order - b.order).slice(0, 3) : [
    { id: '1', name: 'Starter', price: 500, durationDays: 30, icon: 'fa-paper-plane', isRecommended: false, features: [{text:'1 Device', included:true}] },
    { id: '2', name: 'Pro', price: 800, durationDays: 30, icon: 'fa-rocket', isRecommended: true, features: [{text:'3 Devices', included:true}] },
    { id: '3', name: 'Elite', price: 1500, durationDays: 365, icon: 'fa-gem', isRecommended: false, features: [{text:'Unlimited Devices', included:true}] }
  ];

  const displayTestimonials = testimonials?.length > 0 ? testimonials.filter(t => t.isVisible) : [
    { id: 1, name: 'Kasun P.', plan: 'Pro', rating: 5, message: 'Best speeds I have ever seen for Dialog. Highly recommended!', avatarBase64: '' }
  ];

  return (
    <div className="home-page">
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-screen bg-bg-deep overflow-hidden flex items-center">
        {/* Background glows (above) */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-1000" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-glow/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
            
            {/* LEFT — Text content */}
            <div>
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 border border-brand-primary/20 bg-brand-primary/5 backdrop-blur-md rounded-full px-4 py-2 text-sm text-brand-glow cursor-pointer hover:border-brand-primary/40 hover:bg-brand-primary/10 transition-all group mb-6 shadow-[0_0_20px_rgba(255,106,0,0.1)]">
                <span className="text-brand-primary animate-pulse">✦</span>
                #1 in Sri Lanka &amp; Trusted Across Asia
                <span className="text-brand-primary/60 group-hover:translate-x-0.5 transition-transform">›</span>
              </div>

              {/* H1 — white + slate-400 second line */}
              <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 m-0 tracking-tight">
                <span className="text-white drop-shadow-lg">Experience The</span><br/>
                <span className="bg-gradient-to-r from-brand-primary via-brand-glow to-brand-primary bg-clip-text text-transparent drop-shadow-md">Next-Gen Privacy</span>
              </h1>
              {/* Body */}
              <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
                Enterprise Web Hosting, Ultra-Fast VPS, Dedicated Servers,
                Scalable Cloud &amp; Low-Latency Game Hosting — with 24/7 Expert Support.
              </p>
              {/* Button row */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link to={currentUser ? "/portal/dashboard" : "/pricing"} className="text-decoration-none flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-brand-bg bg-gradient-to-r from-brand-primary to-brand-glow hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,106,0,0.4)] hover:shadow-[0_0_40px_rgba(255,106,0,0.6)] border-0">
                  {currentUser ? 'Go to Dashboard' : 'Explore Now'} <i className="fa-solid fa-arrow-right text-sm"></i>
                </Link>

                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
              {/* Trust bar */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-slate-800 pt-6">
                <span className="flex items-center gap-2">✓ 99.9% Uptime SLA</span>
                <span className="flex items-center gap-2">◎ DDoS Protected</span>
                <span className="flex items-center gap-2">⚡ Instant setup</span>
              </div>
            </div>

            {/* RIGHT — Floating dashboard card */}
            <div className="relative widget-float group">
              <div className="absolute inset-0 bg-brand-primary/20 blur-[80px] rounded-3xl -z-10" />
              <div className="glass-card relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-brand-primary/10">
                
                {/* macOS-style title bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500/80 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="w-3 h-3 bg-brand-primary/80 rounded-full shadow-[0_0_8px_rgba(255,106,0,0.5)]" />
                    <span className="w-3 h-3 bg-brand-glow/80 rounded-full shadow-[0_0_8px_rgba(255,140,66,0.5)]" />
                    <span className="text-slate-400 text-xs ml-3 font-semibold tracking-wide uppercase">NextVPN Node</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-brand-primary">
                    <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                    Connected
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
                  <div className="px-4 py-3 text-start">
                    <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 m-0">Speed</p>
                    <p className="text-brand-primary text-sm font-black m-0">84 <span className="text-slate-600 font-normal">Mbps</span></p>
                  </div>
                  <div className="px-4 py-3 text-start">
                    <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 m-0">Protocol</p>
                    <p className="text-brand-glow text-sm font-black m-0 tracking-wider">VLESS</p>
                  </div>
                  <div className="px-4 py-3 relative text-start">
                    <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 m-0">Ping</p>
                    <p className="text-brand-primary text-sm font-black m-0">12ms</p>
                  </div>
                </div>

                {/* Performance chart area */}
                <div className="px-4 py-3 border-b border-[#1e293b]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">Performance</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-brand-primary rounded-full"/>CPU</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-brand-glow rounded-full"/>RAM</span>
                    </div>
                  </div>
                  {/* SVG sparkline chart — two smooth lines */}
                  <svg viewBox="0 0 300 60" className="w-full h-14 drop-shadow-md">
                    <polyline points="0,50 60,45 120,35 180,25 240,15 300,5"
                      fill="none" stroke="var(--orange-main)" strokeWidth="2.5" strokeLinecap="round"/>
                    <polyline points="0,55 60,50 120,45 180,38 240,30 300,22"
                      fill="none" stroke="var(--orange-bright)" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* DDoS badge */}
                <div className="px-4 py-2 flex items-center gap-2 border-b border-[#1e293b]">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                  <span className="text-green-400 text-xs font-medium m-0">DDoS Protected</span>
                </div>

                {/* Terminal console */}
                <div className="bg-[#020617] px-4 py-3 font-mono text-start">
                  <p className="text-slate-500 text-[11px] mb-2 m-0">&gt;_ Console</p>
                  <p className="text-[11px] m-0">
                    <span className="text-brand-primary">[INFO]</span>
                    <span className="text-slate-300"> Server started on port 25565</span>
                  </p>
                  <p className="text-[11px] m-0">
                    <span className="text-brand-glow">[LOAD]</span>
                    <span className="text-slate-300"> Loading world... Done (2.3s)</span>
                  </p>
                  <span className="inline-block w-2 h-4 bg-brand-primary animate-pulse mt-1"/>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — STATS BAR */}
      <section className="bg-brand-secondary border-y border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {[
              { icon:'fa-users', color:'text-brand-primary', end:500, suffix:'+', label:'Active Users' },
              { icon:'fa-server', color:'text-brand-glow', end:12, suffix:'+', label:'Global Servers' },
              { icon:'fa-shield-halved', color:'text-brand-primary', end:99.9, suffix:'%', label:'Uptime SLA' },
              { icon:'fa-bolt', color:'text-brand-glow', end:8, suffix:'ms', label:'Avg Latency', prefix:'<' },
            ].map(({ icon, color, end, suffix, label, prefix }) => (
              <div key={label} className="flex flex-col items-center justify-center py-8 px-4 gap-1">
                <i className={`fa-solid ${icon} ${color} text-xl mb-2`}></i>
                <div className={`text-2xl font-black ${color}`}>{prefix}<CounterStat end={end} suffix={suffix} /></div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURES */}
      <section className="section-padding bg-bg-deep">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="badge-orange mb-5">Why Choose Us</div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Everything You Need <span className="text-brand-primary">For True Privacy</span></h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">We have built a network designed for performance and security from the ground up.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="glass-card p-6 group">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${feat.icon} text-brand-primary text-xl`}></i>
                </div>
                <h3 className="text-white font-bold text-base mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                <div className="mt-4 h-px w-0 bg-brand-primary group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

 

      {/* SECTION 4 — AVAILABLE LOCATIONS */}
      <section className="section-padding bg-bg-primary border-t border-white/5">
        <div className="container-main">
          <div className="text-center reveal-on-scroll mb-5">
            <h2 className="section-title text-white">5+ Servers Worldwide</h2>
            <p className="section-subtitle">Connect to any region with a single click.</p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['All', 'Asia', 'Europe', 'America', 'Middle East'].map(region => (
                <button 
                  key={region}
                  className={locationFilter === region ? 'btn-premium btn-sm' : 'btn-outline btn-sm'}
                  onClick={() => setLocationFilter(region)}
                >
                  {region === 'Asia' ? '🌏 ' : region === 'Europe' ? '🌍 ' : region === 'America' ? '🌎 ' : region === 'Middle East' ? '🕌 ' : ''}
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {filteredServers.map((server, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={server.id}>
                <LocationCard server={server} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <Link to="/services" className="btn-outline">View All Locations <i className="fa-solid fa-arrow-right ml-2"></i></Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 — PROTOCOLS */}
      <section className="section-padding bg-brand-secondary border-t border-white/5">
        <div className="container-main">
          <h2 className="section-title text-center text-white mb-5 reveal-on-scroll">Supported Protocols</h2>
          
          <div className="row g-4">
            {[
              { name: 'VMess', icon: 'fa-network-wired', color: 'var(--orange-main)', desc: 'Standard V2Ray protocol, excellent for bypassing firewalls with TLS.' },
              { name: 'VLESS', icon: 'fa-shield-halved', color: 'var(--orange-bright)', desc: 'Lightweight protocol with no built-in encryption, blazing fast with XTLS.' },
              { name: 'Trojan', icon: 'fa-horse', color: 'var(--orange-main)', desc: 'Disguises traffic as HTTPS, virtually undetectable by DPI.' },
              { name: 'Shadowsocks', icon: 'fa-mask', color: 'var(--orange-bright)', desc: 'Classic, highly efficient protocol perfect for gaming and streaming.' }
            ].map((proto, idx) => (
              <div className="col-12 col-md-6 col-lg-3 reveal-on-scroll" style={{ '--delay': `${idx * 0.1}s` }} key={proto.name}>
                <div className="glass-card h-100 p-4 text-center">
                  <i className={`fa-solid ${proto.icon} mb-3`} style={{ fontSize: '2.5rem', color: proto.color }}></i>
                  <h4 className="text-white mb-2">{proto.name}</h4>
                  <p className="text-slate-500 text-sm mb-4">{proto.desc}</p>
                  <div className="text-brand-primary text-xs font-black uppercase tracking-widest mt-auto"><i className="fa-solid fa-check mr-1"></i> Included</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — PRICING PREVIEW */}
      <section className="section-padding bg-bg-primary border-t border-white/5">
        <div className="container-main">
          <div className="text-center reveal-on-scroll mb-5">
            <div className="section-eyebrow">Pricing Plans</div>
            <h2 className="section-title text-white">Choose Your Power</h2>
            <p className="section-subtitle">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="row justify-content-center g-4">
            {displayPackages.map((pkg, idx) => (
              <div className="col-12 col-md-6 col-lg-4 reveal-on-scroll" style={{ '--delay': `${idx * 0.1}s` }} key={pkg.id}>
                <PricingCard 
                  pkg={pkg} 
                  isLoggedIn={!!currentUser} 
                  onSelect={handleSelectPackage} 
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5 pt-3 reveal-on-scroll">
            <Link to="/pricing" className="btn-outline">View Full Comparison <i className="fa-solid fa-arrow-right ml-2"></i></Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="section-padding bg-brand-secondary border-t border-white/5 overflow-hidden">
        <div className="container-main">
          <div className="text-center reveal-on-scroll mb-5">
            <div className="section-eyebrow">Testimonials</div>
            <h2 className="section-title text-white">What Our Users Say</h2>
          </div>

          <div className="row justify-content-center g-4 reveal-on-scroll">
            {displayTestimonials.slice(0, 3).map((t) => (
              <div className="col-12 col-md-6 col-lg-4" key={t.id}>
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — HOW IT WORKS */}
      <section className="section-padding bg-bg-primary border-t border-white/5 position-relative">
        <div className="container-main">
          <h2 className="section-title text-center text-white mb-5 reveal-on-scroll">Get Connected in Minutes</h2>
          
          <div className="steps-container reveal-on-scroll mt-5">
            <div className="step-line d-none d-md-block"></div>
            
            <div className="step-item">
              <div className="step-number shadow-lg">1</div>
              <i className="fa-solid fa-credit-card step-icon"></i>
              <h5 className="text-white fw-bold mb-2">Choose a Plan</h5>
              <p className="text-secondary small">Select a package that fits your needs and budget.</p>
            </div>
            
            <div className="step-item">
              <div className="step-number shadow-lg">2</div>
              <i className="fa-solid fa-paper-plane step-icon"></i>
              <h5 className="text-white fw-bold mb-2">Make Payment</h5>
              <p className="text-secondary small">Pay via bank, eZcash, or HelaPay. Admin approves fast.</p>
            </div>
            
            <div className="step-item">
              <div className="step-number shadow-lg">3</div>
              <i className="fa-solid fa-wifi step-icon"></i>
              <h5 className="text-white fw-bold mb-2">Connect</h5>
              <p className="text-secondary small">Import your unique config to V2Ray and browse freely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — PAYMENT METHODS */}
      <section className="section-padding bg-brand-secondary border-t border-white/5">
        <div className="container-main">
          <div className="text-center reveal-on-scroll mb-5">
            <h2 className="section-title text-white">Flexible Payment Options</h2>
            <p className="section-subtitle">All payments are manually reviewed and activated quickly.</p>
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-12 col-md-4 reveal-on-scroll">
              <div className="glass-card text-center p-4 h-100 group hover:border-brand-primary/40 transition-all">
                <i className="fa-solid fa-mobile-screen fs-1 mb-3 text-brand-primary"></i>
                <h5 className="text-white mb-3">HelaPay / Helakuru</h5>
                <p className="text-slate-500 text-sm mb-3">Fast transfer via the Helakuru app.</p>
                <div className="badge-active d-inline-flex mx-auto shadow-[0_0_15px_rgba(255,106,0,0.2)]">Instant Processing</div>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <div className="glass-card text-center p-4 h-100 group hover:border-brand-primary/40 transition-all">
                <i className="fa-solid fa-wallet fs-1 mb-3 text-brand-glow"></i>
                <h5 className="text-white mb-3">eZcash Transfer</h5>
                <p className="text-slate-500 text-sm mb-0">Direct transfer from your Dialog/Hutch mobile wallet.</p>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <div className="glass-card text-center p-4 h-100 group hover:border-brand-primary/40 transition-all">
                <i className="fa-solid fa-building-columns fs-1 mb-3 text-brand-primary"></i>
                <h5 className="text-white mb-3">Bank Transfer</h5>
                <p className="text-slate-500 text-sm mb-0">Direct deposit to our Commercial Bank account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 — STAY UPDATED */}
      <StayUpdatedBanner />

      {/* SECTION 11 — CONTACT PREVIEW */}
      <section className="section-padding bg-bg-primary border-t border-white/5">
        <div className="container-main text-center">
          <h2 className="section-title text-white mb-5 reveal-on-scroll">Need Help?</h2>
          
          <div className="row justify-content-center g-4 mb-5">
            <div className="col-12 col-md-4 reveal-on-scroll">
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon-wrap mb-3"><i className="fa-solid fa-envelope text-slate-300"></i></div>
                <h6 className="text-white">Email Us</h6>
                <div className="text-slate-300 text-sm">{config?.contactEmail || 'support@shiftlk.net'}</div>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon-wrap mb-3" style={{ background: 'rgba(99,102,241,0.1)' }}><i className="fa-brands fa-telegram text-indigo-400"></i></div>
                <h6 className="text-white">Telegram Support</h6>
                <div className="text-slate-300 text-sm">@shiftlk</div>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon-wrap mb-3" style={{ background: 'rgba(34,197,94,0.1)' }}><i className="fa-brands fa-whatsapp text-emerald-400"></i></div>
                <h6 className="text-white">WhatsApp</h6>
                <div className="text-slate-300 text-sm">{config?.phone || '+94 77 123 4567'}</div>
              </div>
            </div>
          </div>
          
          <Link to="/contact" className="btn-premium reveal-on-scroll">Contact Us <i className="fa-solid fa-arrow-right ml-2"></i></Link>
        </div>
      </section>

      <PaymentModal 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        packageData={selectedPkg}
        siteSettings={config}
      />
    </div>
  );
};

export default Home;
