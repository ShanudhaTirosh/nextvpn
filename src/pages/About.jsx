import React from 'react';
import CounterStat from '../components/CounterStat';
import SEO from '../components/SEO';

const VALUES = [
  { icon:'fa-user-shield', color:'text-brand-primary', bg:'bg-brand-primary/10 border-brand-primary/20', title:'Absolute Privacy', desc:'A strict zero-logs policy. We never track, store, or share your data with anyone.' },
  { icon:'fa-gauge-high', color:'text-blue-400', bg:'bg-blue-500/10 border-blue-500/20', title:'Unmatched Speed', desc:'Premium routing and dedicated bandwidth for zero buffering and low latency.' },
  { icon:'fa-server', color:'text-purple-400', bg:'bg-purple-500/10 border-purple-500/20', title:'Reliability', desc:'Enterprise-grade servers with automated failover and proactive DDoS mitigation.' },
  { icon:'fa-headset', color:'text-emerald-400', bg:'bg-emerald-500/10 border-emerald-500/20', title:'24/7 Support', desc:'Real human support via Telegram and WhatsApp to assist you anytime.' },
];

const TIMELINE = [
  { year:'2023', title:'The Idea', desc:'ShiftLK Netch was born from a simple frustration: slow, restricted internet across Sri Lanka.' },
  { year:'2024 Q1', title:'First Servers', desc:'Launched our first 3 Singapore nodes, quickly gaining 200+ early adopters.' },
  { year:'2024 Q2', title:'Regional Expansion', desc:'Expanded to Tokyo, London, and Dubai. Reached 1,000+ active subscribers.' },
  { year:'Now', title:'5,000+ Users', desc:'Trusted by thousands across Sri Lanka and Asia. 5+ nodes across 4 continents.' },
];

const About = () => (
  <div className="min-h-screen bg-[#020617]">
    <SEO 
      title="About Us" 
      description="Learn about ShiftLK Netch Solutions. Our mission is to provide unrestricted, lightning-fast internet access to users across Sri Lanka and Asia." 
      keywords="About ShiftLK, VPN mission, V2Ray provider Sri Lanka"
    />
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-brand-glow/10 rounded-full blur-3xl" />
    </div>

    {/* Hero */}
    <section className="relative max-w-6xl mx-auto px-6 py-20 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-6">
        <i className="fa-solid fa-globe text-[10px]"></i> Our Story
      </div>
      <h1 className="text-5xl font-black text-white mb-4 leading-tight">
        About <span className="bg-gradient-to-r from-brand-primary to-brand-glow bg-clip-text text-transparent">ShiftLK Netch</span>
      </h1>
      <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
        We're on a mission to provide unrestricted, lightning-fast internet access to users across Sri Lanka and Asia.
      </p>
    </section>

    {/* Stats */}
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { end:50, suffix:'+', label:'Users Served', color:'from-brand-primary/10', border:'border-brand-primary/20', text:'text-brand-primary' },
          { end:5, suffix:'+', label:'Global Servers', color:'from-blue-500/10', border:'border-blue-500/20', text:'text-blue-400' },
          { end:3, suffix:'+', label:'Countries', color:'from-purple-500/10', border:'border-purple-500/20', text:'text-purple-400' },
          { end:99.9, suffix:'%', label:'Uptime Record', color:'from-emerald-500/10', border:'border-emerald-500/20', text:'text-emerald-400' },
        ].map(({ end, suffix, label, color, border, text }) => (
          <div key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} to-transparent border ${border} p-5 text-center`}>
            <div className={`text-3xl font-black ${text} mb-1`}><CounterStat end={end} suffix={suffix} /></div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Mission */}
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-5">
            <i className="fa-solid fa-rocket text-[10px]"></i> Our Mission
          </div>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Built by Enthusiasts,<br/><span className="text-slate-400">Designed for Performance</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Founded in 2024, ShiftLK Netch Solutions started with a simple goal: bypass restrictions and provide high-speed, secure internet access. What began as a small project has quickly grown into a trusted premium V2Ray provider across the region.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            We use enterprise-grade hardware, NVMe storage, and 10Gbps uplinks to ensure our network never bottlenecks, whether you're gaming, streaming, or browsing.
          </p>
          <div className="flex flex-col gap-3">
            {['10Gbps uplink ports on all nodes','Automated DDoS mitigation','Multi-region failover routing'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-0">
          {TIMELINE.map((item, i) => (
            <div key={item.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-glow/20 border border-brand-primary/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-brand-primary">{item.year.replace('Now','★')}</div>
                {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-brand-primary/20 to-transparent mt-1"></div>}
              </div>
              <div className="pb-8">
                <p className="text-xs text-brand-primary font-semibold mb-0.5">{item.year}</p>
                <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-3">Our Core Values</h2>
        <p className="text-slate-500 text-sm">The principles we build everything around.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {VALUES.map(v => (
          <div key={v.title} className={`rounded-2xl border p-6 text-center bg-slate-900/40 ${v.bg.split(' ')[1]}`}>
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${v.bg}`}>
              <i className={`fa-solid ${v.icon} text-xl ${v.color}`}></i>
            </div>
            <h3 className="text-white font-bold text-sm mb-2">{v.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default About;
