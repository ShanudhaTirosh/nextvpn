import React from 'react';
import GlassCard from '../components/GlassCard';
import CounterStat from '../components/CounterStat';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="section-padding section-bg-primary text-center">
        <div className="container-main pt-5">
          <div className="section-eyebrow">Discover Our Story</div>
          <h1 className="section-title text-white">About <span className="gradient-text">ShiftLK Netch</span></h1>
          <p className="section-subtitle mt-3">We are on a mission to provide unrestricted, lightning-fast internet access to users across Sri Lanka and Asia.</p>
        </div>
      </section>

      {/* Mission & Stats */}
      <section className="section-padding section-bg-secondary border-top border-secondary">
        <div className="container-main">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6 reveal-on-scroll">
              <h3 className="text-white fw-bold mb-4">Built by Enthusiasts, <br />Designed for Performance</h3>
              <p className="text-secondary lh-lg mb-4">
                Founded in 2024, ShiftLK Netch Solutions started with a simple goal: bypass restrictions 
                and provide high-speed, secure internet access. What began as a small project has quickly 
                grown into a trusted premium V2Ray service provider in the region.
              </p>
              <p className="text-secondary lh-lg">
                We utilize enterprise-grade hardware, NVMe storage, and 10Gbps uplinks to ensure 
                our network never bottlenecks. Whether you are gaming, streaming, or just browsing, 
                our infrastructure is built to handle it.
              </p>
            </div>
            
            <div className="col-12 col-lg-6">
              <div className="row g-3">
                <div className="col-6 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
                  <GlassCard className="text-center p-4 h-100">
                    <div className="fs-2 fw-bold text-white mb-2"><CounterStat end={5} suffix="k+" /></div>
                    <div className="text-muted small text-uppercase">Users Served</div>
                  </GlassCard>
                </div>
                <div className="col-6 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
                  <GlassCard className="text-center p-4 h-100">
                    <div className="fs-2 fw-bold text-white mb-2"><CounterStat end={30} suffix="+" /></div>
                    <div className="text-muted small text-uppercase">Global Servers</div>
                  </GlassCard>
                </div>
                <div className="col-6 reveal-on-scroll" style={{ '--delay': '0.3s' }}>
                  <GlassCard className="text-center p-4 h-100">
                    <div className="fs-2 fw-bold text-white mb-2"><CounterStat end={12} /></div>
                    <div className="text-muted small text-uppercase">Countries</div>
                  </GlassCard>
                </div>
                <div className="col-6 reveal-on-scroll" style={{ '--delay': '0.4s' }}>
                  <GlassCard className="text-center p-4 h-100">
                    <div className="fs-2 fw-bold text-white mb-2"><CounterStat end={99} suffix=".9%" /></div>
                    <div className="text-muted small text-uppercase">Uptime Record</div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding section-bg-primary">
        <div className="container-main text-center">
          <h2 className="section-title text-white mb-5 reveal-on-scroll">Our Core Values</h2>
          
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3 reveal-on-scroll">
              <GlassCard className="p-4 h-100">
                <i className="fa-solid fa-user-shield fs-1 text-cyan mb-4" style={{ color: 'var(--accent-cyan)' }}></i>
                <h5 className="text-white mb-3">Absolute Privacy</h5>
                <p className="text-secondary small mb-0">A strict zero-logs policy. We do not track, store, or share your data with anyone.</p>
              </GlassCard>
            </div>
            <div className="col-12 col-md-6 col-lg-3 reveal-on-scroll" style={{ '--delay': '0.1s' }}>
              <GlassCard className="p-4 h-100">
                <i className="fa-solid fa-gauge-high fs-1 mb-4" style={{ color: 'var(--accent-blue)' }}></i>
                <h5 className="text-white mb-3">Unmatched Speed</h5>
                <p className="text-secondary small mb-0">Premium routing and dedicated bandwidth to ensure zero buffering and low latency.</p>
              </GlassCard>
            </div>
            <div className="col-12 col-md-6 col-lg-3 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <GlassCard className="p-4 h-100">
                <i className="fa-solid fa-server fs-1 mb-4" style={{ color: 'var(--accent-purple)' }}></i>
                <h5 className="text-white mb-3">Reliability</h5>
                <p className="text-secondary small mb-0">Enterprise-grade servers with automated failover and proactive DDoS mitigation.</p>
              </GlassCard>
            </div>
            <div className="col-12 col-md-6 col-lg-3 reveal-on-scroll" style={{ '--delay': '0.3s' }}>
              <GlassCard className="p-4 h-100">
                <i className="fa-solid fa-headset fs-1 mb-4" style={{ color: 'var(--accent-green)' }}></i>
                <h5 className="text-white mb-3">24/7 Support</h5>
                <p className="text-secondary small mb-0">Real human support available via Telegram and WhatsApp to assist you anytime.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
