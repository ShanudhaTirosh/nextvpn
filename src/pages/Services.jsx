import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import SEO from '../components/SEO';

const Services = () => {
  return (
    <div className="services-page">
      <SEO 
        title="Our Services" 
        description="Explore our next-gen VPN technology powered by V2Ray and Netch. High-speed VMess, VLESS, and Trojan protocols for ultimate privacy." 
        keywords="V2Ray Services, Netch VPN protocols, VMess, VLESS, Trojan VPN"
      />
      {/* Hero */}
      <section className="section-padding section-bg-primary text-center">
        <div className="container-main pt-5">
          <div className="section-eyebrow">Our Technology</div>
          <h1 className="section-title text-white">Next-Gen <span className="gradient-text">VPN Services</span></h1>
          <p className="section-subtitle mt-3">Powered by V2Ray framework, built for ultimate bypassing and speed.</p>
        </div>
      </section>

      {/* V2Ray Deep Dive */}
      <section className="section-padding section-bg-secondary border-top border-secondary">
        <div className="container-main">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-5 reveal-on-scroll">
              <img src="/v2ray.png" 
                   alt="V2Ray Logo" 
                   style={{ width: '200px', filter: 'drop-shadow(0 0 20px rgba(255,106,0,0.4))' }} 
                   className="mx-auto d-block mb-4" />
            </div>
            <div className="col-12 col-lg-7 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <h2 className="text-white fw-bold mb-4">What makes V2Ray superior?</h2>
              <p className="text-secondary lh-lg mb-4">
                Unlike traditional VPN protocols (like OpenVPN or IPsec) which are easily detected and blocked 
                by Deep Packet Inspection (DPI), V2Ray is a sophisticated proxy platform designed specifically 
                to evade censorship.
              </p>
              <p className="text-secondary lh-lg">
                By disguising your internet traffic as normal HTTPS web traffic, V2Ray nodes are virtually 
                impossible to block. Combined with our high-speed NVMe servers, you get a connection that is 
                not only unrestricted but significantly faster than legacy VPNs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Comparison Table */}
      <section className="section-padding section-bg-primary">
        <div className="container-main">
          <h3 className="text-white text-center mb-5 reveal-on-scroll">Protocol Comparison</h3>
          
          <div className="table-responsive reveal-on-scroll border border-secondary rounded-4 overflow-hidden shadow-lg">
            <table className="data-table mb-0">
              <thead>
                <tr>
                  <th style={{ color: 'var(--orange-main)' }}>Protocol</th>
                  <th>Speed</th>
                  <th>Security</th>
                  <th>Bypass Capability</th>
                  <th>Mobile Battery</th>
                  <th>Recommended For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="fw-bold text-white"><i className="fa-solid fa-network-wired text-brand-primary me-2"></i>VMess</span></td>
                  <td>Excellent</td>
                  <td>High</td>
                  <td><span className="badge-active bg-transparent">Very High</span></td>
                  <td>Moderate</td>
                  <td>General browsing, bypassing strict firewalls</td>
                </tr>
                <tr>
                  <td><span className="fw-bold text-white"><i className="fa-solid fa-shield-halved text-brand-glow me-2"></i>VLESS (XTLS)</span></td>
                  <td><span className="badge-active bg-transparent">Blazing Fast</span></td>
                  <td>Very High</td>
                  <td>High</td>
                  <td>Low Drain</td>
                  <td>Gaming, 4K Streaming</td>
                </tr>
                <tr>
                  <td><span className="fw-bold text-white"><i className="fa-solid fa-horse text-brand-primary me-2"></i>Trojan</span></td>
                  <td>Fast</td>
                  <td><span className="badge-active bg-transparent">Maximum</span></td>
                  <td>Excellent</td>
                  <td>Low Drain</td>
                  <td>Maximum stealth, undetected traffic</td>
                </tr>
                <tr>
                  <td><span className="fw-bold text-white"><i className="fa-solid fa-mask text-brand-glow me-2"></i>Shadowsocks</span></td>
                  <td>Fast</td>
                  <td>Good</td>
                  <td>Moderate</td>
                  <td><span className="badge-active bg-transparent">Lowest Drain</span></td>
                  <td>Mobile devices, basic routing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding section-bg-secondary border-top border-secondary">
        <div className="container-main">
          <h2 className="section-title text-center text-white mb-5 reveal-on-scroll">Perfect For Every Need</h2>
          
          <div className="row g-4">
            <div className="col-12 col-md-6 reveal-on-scroll">
              <GlassCard className="p-4 d-flex align-items-start gap-4 h-100 group hover:border-brand-primary/40 transition-all">
                <i className="fa-solid fa-gamepad fs-1 text-brand-primary"></i>
                <div>
                  <h5 className="text-white">Low-Latency Gaming</h5>
                  <p className="text-slate-500 text-sm mb-0">Our direct routing and premium bandwidth ensure stable, low-ping connections to gaming servers across Asia and Europe.</p>
                </div>
              </GlassCard>
            </div>
            <div className="col-12 col-md-6 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <GlassCard className="p-4 d-flex align-items-start gap-4 h-100 group hover:border-brand-primary/40 transition-all">
                <i className="fa-solid fa-film fs-1 text-brand-glow"></i>
                <div>
                  <h5 className="text-white">4K Streaming</h5>
                  <p className="text-slate-500 text-sm mb-0">Unblock streaming platforms worldwide and watch in 4K without buffering thanks to our uncapped bandwidth.</p>
                </div>
              </GlassCard>
            </div>
            <div className="col-12 col-md-6 reveal-on-scroll">
              <GlassCard className="p-4 d-flex align-items-start gap-4 h-100">
                <i className="fa-solid fa-user-secret fs-1 text-secondary"></i>
                <div>
                  <h5 className="text-white">Total Privacy</h5>
                  <p className="text-secondary small mb-0">Hide your IP address, encrypt your traffic on public Wi-Fi, and protect your digital identity from trackers.</p>
                </div>
              </GlassCard>
            </div>
            <div className="col-12 col-md-6 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <GlassCard className="p-4 d-flex align-items-start gap-4 h-100 group hover:border-brand-primary/40 transition-all">
                <i className="fa-solid fa-building fs-1 text-brand-primary"></i>
                <div>
                  <h5 className="text-white">Business Ready</h5>
                  <p className="text-slate-500 text-sm mb-0">Reliable connections for remote workers needing secure access to international resources and tools.</p>
                </div>
              </GlassCard>
            </div>
          </div>
          
          <div className="text-center mt-5 pt-4 reveal-on-scroll">
            <Link to="/pricing" className="btn-premium px-8 py-4 text-base rounded-2xl shadow-[0_0_30px_rgba(255,106,0,0.3)] hover:shadow-[0_0_40px_rgba(255,106,0,0.5)]">
              Get Started Now <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
