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
      <section className="relative min-h-screen bg-[#020617] overflow-hidden flex items-center">
        {/* Background glows (above) */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-1000" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
            
            {/* LEFT — Text content */}
            <div>
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md rounded-full px-4 py-2 text-sm text-indigo-200 cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all group mb-6 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <span className="text-cyan-400 animate-pulse">✦</span>
                #1 in Sri Lanka &amp; Trusted Across Asia
                <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">›</span>
              </div>

              {/* H1 — white + slate-400 second line */}
              <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 m-0 tracking-tight">
                <span className="text-white drop-shadow-lg">Experience The</span><br/>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">Next-Gen Privacy</span>
              </h1>
              {/* Body */}
              <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
                Enterprise Web Hosting, Ultra-Fast VPS, Dedicated Servers,
                Scalable Cloud &amp; Low-Latency Game Hosting — with 24/7 Expert Support.
              </p>
              {/* Button row */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                {/* Primary CTA */}
                <Link to={currentUser ? "/portal/dashboard" : "/pricing"} className="text-decoration-none flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(192,132,252,0.6)] hover:-translate-y-1 border-0">
                  {currentUser ? 'Go to Dashboard' : 'Explore Now'} <i className="fa-solid fa-arrow-right text-sm"></i>
                </Link>

                {/* Secondary — dark glass */}
                <Link to="/contact" className="text-decoration-none flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-700/80 hover:border-indigo-500/50 hover:text-white transition-all duration-300 backdrop-blur-md">
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
            <div className="relative widget-float">
              {/* Outer glow behind the card */}
              <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-3xl -z-10" />
              
              {/* Main floating card */}
              <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] shadow-indigo-500/10">
                
                {/* macOS-style title bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500/80 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="w-3 h-3 bg-yellow-500/80 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    <span className="w-3 h-3 bg-green-500/80 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-slate-400 text-xs ml-3 font-semibold tracking-wide">NextVPN Console</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-[#1e293b] border-b border-[#1e293b]">
                  <div className="px-4 py-3 text-start">
                    <p className="text-slate-500 text-xs mb-1 m-0">Players</p>
                    <p className="text-cyan-400 text-sm font-semibold m-0">347 <span className="text-slate-600 font-normal">/500</span></p>
                  </div>
                  <div className="px-4 py-3 text-start">
                    <p className="text-slate-500 text-xs mb-1 m-0">CPU</p>
                    <p className="text-blue-400 text-sm font-semibold m-0">23%</p>
                  </div>
                  <div className="px-4 py-3 relative text-start">
                    <p className="text-slate-500 text-xs mb-1 m-0">RAM</p>
                    <p className="text-purple-400 text-sm font-semibold m-0">2.4GB</p>
                    <span className="absolute top-2 right-2 text-[10px] text-yellow-400 flex items-center gap-1">
                      ⚡ 2.3ms latency
                    </span>
                  </div>
                </div>

                {/* Performance chart area */}
                <div className="px-4 py-3 border-b border-[#1e293b]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">Performance</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-400 rounded-full"/>CPU</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-400 rounded-full"/>RAM</span>
                    </div>
                  </div>
                  {/* SVG sparkline chart — two smooth lines */}
                  <svg viewBox="0 0 300 60" className="w-full h-14 drop-shadow-md">
                    <polyline points="0,50 60,45 120,35 180,25 240,15 300,5"
                      fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"/>
                    <polyline points="0,55 60,50 120,45 180,38 240,30 300,22"
                      fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
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
                    <span className="text-cyan-400">[INFO]</span>
                    <span className="text-slate-300"> Server started on port 25565</span>
                  </p>
                  <p className="text-[11px] m-0">
                    <span className="text-yellow-400">[LOAD]</span>
                    <span className="text-slate-300"> Loading world... Done (2.3s)</span>
                  </p>
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse mt-1"/>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — STATS BAR */}
      <section className="bg-slate-900/40 border-y border-slate-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800/60">
            {[
              { icon:'fa-users', color:'text-cyan-400', end:50, suffix:'+', label:'Active Users' },
              { icon:'fa-server', color:'text-blue-400', end:5, suffix:'+', label:'Global Servers' },
              { icon:'fa-shield-halved', color:'text-emerald-400', end:99.9, suffix:'%', label:'Uptime SLA' },
              { icon:'fa-bolt', color:'text-amber-400', end:10, suffix:'ms', label:'Avg Latency', prefix:'<' },
            ].map(({ icon, color, end, suffix, label, prefix }) => (
              <div key={label} className="flex flex-col items-center justify-center py-8 px-4 gap-1">
                <i className={`fa-solid ${icon} ${color} text-lg mb-2`}></i>
                <div className={`text-2xl font-black ${color}`}>{prefix}<CounterStat end={end} suffix={suffix} /></div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURES */}
      <section className="py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-5">
              <span className="text-[10px]">✦</span> Why Choose Us
            </div>
            <h2 className="text-4xl font-black text-white mb-3">Everything You Need <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">For True Privacy</span></h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">We have built a network designed for performance and security from the ground up.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => (
              <div key={idx} className="group rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 p-6 transition-all duration-300 hover:bg-slate-900/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)]">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${feat.icon} text-cyan-400 text-lg`}></i>
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                <div className="mt-4 h-px w-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

 

      {/* SECTION 4 — AVAILABLE LOCATIONS */}
      <section className="section-bg-primary section-padding">
        <div className="container-main">
          <div className="text-center reveal-on-scroll mb-5">
            <h2 className="section-title text-white">5+ Servers Worldwide</h2>
            <p className="section-subtitle">Connect to any region with a single click.</p>
            
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
              {['All', 'Asia', 'Europe', 'America', 'Middle East'].map(region => (
                <button 
                  key={region}
                  className={locationFilter === region ? 'btn-gradient btn-sm' : 'btn-ghost btn-sm text-secondary border-secondary bg-dark'}
                  onClick={() => setLocationFilter(region)}
                >
                  {region === 'Asia' ? '🌏 ' : region === 'Europe' ? '🌍 ' : region === 'America' ? '🌎 ' : region === 'Middle East' ? '🕌 ' : ''}
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {filteredServers.map((server, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={server.id}>
                <LocationCard server={server} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <Link to="/services" className="btn-ghost">View All Locations <i className="fa-solid fa-arrow-right ms-2"></i></Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 — PROTOCOLS */}
      <section className="section-bg-secondary section-padding border-top border-secondary">
        <div className="container-main">
          <h2 className="section-title text-center text-white mb-5 reveal-on-scroll">Supported Protocols</h2>
          
          <div className="row g-4">
            {[
              { name: 'VMess', icon: 'fa-network-wired', color: 'var(--accent-cyan)', desc: 'Standard V2Ray protocol, excellent for bypassing firewalls with TLS.' },
              { name: 'VLESS', icon: 'fa-shield-halved', color: 'var(--accent-blue)', desc: 'Lightweight protocol with no built-in encryption, blazing fast with XTLS.' },
              { name: 'Trojan', icon: 'fa-horse', color: 'var(--accent-purple)', desc: 'Disguises traffic as HTTPS, virtually undetectable by DPI.' },
              { name: 'Shadowsocks', icon: 'fa-mask', color: 'var(--accent-green)', desc: 'Classic, highly efficient protocol perfect for gaming and streaming.' }
            ].map((proto, idx) => (
              <div className="col-12 col-md-6 col-lg-3 reveal-on-scroll" style={{ '--delay': `${idx * 0.1}s` }} key={proto.name}>
                <div className="glass-card h-100 p-4 text-center transition-all hover-glow" style={{ '--glow-color': proto.color }}>
                  <i className={`fa-solid ${proto.icon} mb-3`} style={{ fontSize: '2.5rem', color: proto.color }}></i>
                  <h4 className="text-white mb-2">{proto.name}</h4>
                  <p className="text-secondary small mb-4">{proto.desc}</p>
                  <div className="text-success small fw-bold mt-auto"><i className="fa-solid fa-check me-1"></i> Included in all plans</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — PRICING PREVIEW */}
      <section className="section-bg-primary section-padding">
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
            <Link to="/pricing" className="btn-ghost">View Full Comparison <i className="fa-solid fa-arrow-right ms-2"></i></Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="section-bg-secondary section-padding border-top border-secondary overflow-hidden">
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
      <section className="section-bg-primary section-padding position-relative">
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
      <section className="section-bg-secondary section-padding border-top border-secondary">
        <div className="container-main">
          <div className="text-center reveal-on-scroll mb-5">
            <h2 className="section-title text-white">Flexible Payment Options</h2>
            <p className="section-subtitle">All payments are manually reviewed and activated quickly.</p>
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-12 col-md-4 reveal-on-scroll">
              <div className="glass-card text-center p-4 h-100">
                <i className="fa-solid fa-mobile-screen fs-1 mb-3 text-cyan" style={{ color: 'var(--accent-cyan)' }}></i>
                <h5 className="text-white mb-3">HelaPay / Helakuru</h5>
                <p className="text-secondary small mb-3">Fast transfer via the Helakuru app.</p>
                <div className="badge-active d-inline-flex mx-auto">Instant Processing</div>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <div className="glass-card text-center p-4 h-100">
                <i className="fa-solid fa-wallet fs-1 mb-3" style={{ color: 'var(--accent-blue)' }}></i>
                <h5 className="text-white mb-3">eZcash Transfer</h5>
                <p className="text-secondary small mb-0">Direct transfer from your Dialog/Hutch mobile wallet.</p>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <div className="glass-card text-center p-4 h-100">
                <i className="fa-solid fa-building-columns fs-1 mb-3" style={{ color: 'var(--accent-purple)' }}></i>
                <h5 className="text-white mb-3">Bank Transfer</h5>
                <p className="text-secondary small mb-0">Direct deposit to our Commercial Bank account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 — STAY UPDATED */}
      <StayUpdatedBanner />

      {/* SECTION 11 — CONTACT PREVIEW */}
      <section className="section-bg-secondary section-padding border-top border-secondary">
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
                <div className="text-slate-300 text-sm">@ShiftLK_Community</div>
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
          
          <Link to="/contact" className="btn-gradient reveal-on-scroll">Contact Us <i className="fa-solid fa-arrow-right ms-2"></i></Link>
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
