import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ServerDashboardWidget from '../components/ServerDashboardWidget';
import PricingCard from '../components/PricingCard';
import TestimonialCard from '../components/TestimonialCard';
import LocationCard from '../components/LocationCard';
import PaymentModal from '../components/PaymentModal';
import CounterStat from '../components/CounterStat';
import StayUpdatedBanner from '../components/StayUpdatedBanner';
import { useAuth } from '../hooks/useAuth';
import { useCollection, useDocument } from '../hooks/useFirestore';

const Home = () => {
  const { currentUser } = useAuth();
  
  // Data fetching
  const { data: config } = useDocument('siteSettings', 'config');
  const { data: servers } = useCollection('servers', []);
  const { data: packages } = useCollection('packages', []);
  const { data: testimonials } = useCollection('testimonials', []);

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
    { icon:"fa-globe", title:"30+ Locations", desc:"Servers across 4 continents." },
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
    { id: '3', name: 'Elite', price: 1500, durationDays: 30, icon: 'fa-gem', isRecommended: false, features: [{text:'Unlimited Devices', included:true}] }
  ];

  const displayTestimonials = testimonials?.length > 0 ? testimonials.filter(t => t.isVisible) : [
    { id: 1, name: 'Kasun P.', plan: 'Pro', rating: 5, message: 'Best speeds I have ever seen for Dialog. Highly recommended!', avatarBase64: '' }
  ];

  return (
    <div className="home-page">
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-screen bg-[#020617] overflow-hidden flex items-center pt-14">
        {/* Background glows (above) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
            
            {/* LEFT — Text content */}
            <div>
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 border border-slate-700 bg-slate-900/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-300 cursor-pointer hover:border-slate-500 transition-colors group mb-6">
                <span className="text-cyan-400">✦</span>
                #1 in Sri Lanka &amp; Trusted Across Asia
                <span className="text-slate-500 group-hover:translate-x-0.5 transition-transform">›</span>
              </div>

              {/* H1 — white + slate-400 second line */}
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 m-0">
                <span className="text-white">#1 in Sri Lanka</span><br/>
                <span className="text-slate-400">&amp; Trusted Across Asia</span>
              </h1>
              {/* Body */}
              <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
                Enterprise Web Hosting, Ultra-Fast VPS, Dedicated Servers,
                Scalable Cloud &amp; Low-Latency Game Hosting — with 24/7 Expert Support.
              </p>
              {/* Button row */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                {/* Primary CTA — cyan-to-blue gradient */}
                <Link to="/pricing" className="text-decoration-none flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/20 border-0">
                  Explore <span>↓</span>
                </Link>

                {/* Secondary — dark glass */}
                <Link to="/contact" className="text-decoration-none flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-300 bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 backdrop-blur-sm">
                  <span>💬</span> Contact Us
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
            <div className="relative">
              {/* Outer glow behind the card */}
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-3xl -z-10" />
              
              {/* Main floating card */}
              <div className="bg-[#0d1117] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                
                {/* macOS-style title bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-slate-400 text-xs ml-3">Server Dashboard</span>
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
                  <svg viewBox="0 0 300 60" className="w-full h-14">
                    <polyline points="0,50 60,45 120,35 180,25 240,15 300,5"
                      fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="0,55 60,50 120,45 180,38 240,30 300,22"
                      fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
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
      <section className="section-bg-secondary stats-bar border-top border-bottom border-secondary">
        <div className="container-main">
          <div className="row justify-content-center">
            <div className="col-6 col-md-3 stat-item reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
              <div className="stat-number"><CounterStat end={5000} suffix="+" /></div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="col-6 col-md-3 stat-item reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <div className="stat-icon"><i className="fa-solid fa-server"></i></div>
              <div className="stat-number"><CounterStat end={30} suffix="+" /></div>
              <div className="stat-label">Global Servers</div>
            </div>
            <div className="col-6 col-md-3 stat-item reveal-on-scroll" style={{ '--delay': '0.3s' }}>
              <div className="stat-icon"><i className="fa-solid fa-shield-halved"></i></div>
              <div className="stat-number"><CounterStat end={99.9} suffix="%" /></div>
              <div className="stat-label">Uptime SLA</div>
            </div>
            <div className="col-6 col-md-3 stat-item reveal-on-scroll" style={{ '--delay': '0.4s', borderRight: 'none' }}>
              <div className="stat-icon"><i className="fa-solid fa-bolt"></i></div>
              <div className="stat-number">&lt;<CounterStat end={10} suffix="ms" /></div>
              <div className="stat-label">Avg Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURES */}
      <section className="section-bg-primary section-padding">
        <div className="container-main">
          <div className="text-center reveal-on-scroll">
            <div className="section-eyebrow">Why Choose Us</div>
            <h2 className="section-title">Everything You Need <br /><span className="gradient-text">For True Privacy</span></h2>
            <p className="section-subtitle">We have built a network designed for performance and security from the ground up.</p>
          </div>

          <div className="row g-4 mt-2">
            {features.map((feat, idx) => (
              <div className="col-12 col-md-6 col-lg-4 reveal-on-scroll" style={{ '--delay': `${idx * 0.1}s` }} key={idx}>
                <div className="glass-card feature-card h-100">
                  <div className="feature-icon-wrap">
                    <i className={`fa-solid ${feat.icon}`}></i>
                  </div>
                  <h4 className="text-white mb-2">{feat.title}</h4>
                  <p className="text-secondary mb-0">{feat.desc}</p>
                  <div className="accent-line"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — SERVER DASHBOARD WIDGET */}
      <section className="section-bg-secondary section-padding border-top border-secondary">
        <div className="container-main">
          <div className="row align-items-center">
            <div className="col-12 col-lg-5 mb-5 mb-lg-0 reveal-on-scroll">
              <div className="section-eyebrow">Live Infrastructure</div>
              <h2 className="section-title text-white">Real-Time Server <br /><span className="gradient-text">Intelligence</span></h2>
              <p className="text-secondary mb-4 fs-6 lh-lg">
                We monitor our infrastructure 24/7 to ensure optimal performance. 
                Our automated load balancing dynamically routes your traffic to the fastest available node.
              </p>
              
              <ul className="list-unstyled mb-4">
                <li className="mb-3 d-flex align-items-center text-white">
                  <i className="fa-solid fa-check text-success me-3 fs-5 bg-success bg-opacity-25 rounded-circle p-1"></i> Proactive DDoS Mitigation
                </li>
                <li className="mb-3 d-flex align-items-center text-white">
                  <i className="fa-solid fa-check text-success me-3 fs-5 bg-success bg-opacity-25 rounded-circle p-1"></i> 10Gbps Uplink Ports
                </li>
                <li className="mb-3 d-flex align-items-center text-white">
                  <i className="fa-solid fa-check text-success me-3 fs-5 bg-success bg-opacity-25 rounded-circle p-1"></i> Automated Failover
                </li>
              </ul>
              
              <Link to="/about" className="btn-ghost">Learn about our network</Link>
            </div>
            <div className="col-12 col-lg-7 d-flex justify-content-center justify-content-lg-end reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <ServerDashboardWidget />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — AVAILABLE LOCATIONS */}
      <section className="section-bg-primary section-padding">
        <div className="container-main">
          <div className="text-center reveal-on-scroll mb-5">
            <h2 className="section-title text-white">30+ Servers Worldwide</h2>
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

      {/* SECTION 6 — PROTOCOLS */}
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

      {/* SECTION 7 — PRICING PREVIEW */}
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

      {/* SECTION 8 — TESTIMONIALS */}
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

      {/* SECTION 9 — HOW IT WORKS */}
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

      {/* SECTION 10 — PAYMENT METHODS */}
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

      {/* SECTION 11 — STAY UPDATED */}
      <StayUpdatedBanner />

      {/* SECTION 12 — CONTACT PREVIEW */}
      <section className="section-bg-secondary section-padding border-top border-secondary">
        <div className="container-main text-center">
          <h2 className="section-title text-white mb-5 reveal-on-scroll">Need Help?</h2>
          
          <div className="row justify-content-center g-4 mb-5">
            <div className="col-12 col-md-4 reveal-on-scroll">
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon-wrap mb-3"><i className="fa-solid fa-envelope"></i></div>
                <h6 className="text-white">Email Us</h6>
                <div className="text-muted small">{config?.contactEmail || 'support@shiftlk.net'}</div>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon-wrap mb-3" style={{ background: 'rgba(59,130,246,0.1)' }}><i className="fa-brands fa-telegram text-primary"></i></div>
                <h6 className="text-white">Telegram Support</h6>
                <div className="text-muted small">@ShiftLK_Support</div>
              </div>
            </div>
            <div className="col-12 col-md-4 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon-wrap mb-3" style={{ background: 'rgba(34,197,94,0.1)' }}><i className="fa-brands fa-whatsapp text-success"></i></div>
                <h6 className="text-white">WhatsApp</h6>
                <div className="text-muted small">{config?.phone || '+94 77 123 4567'}</div>
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
