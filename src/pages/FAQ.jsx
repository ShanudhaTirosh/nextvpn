import React, { useState } from 'react';
import { useRealtimeCollection } from '../hooks/useFirestore';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FALLBACK = [
  { id:'1', question:'What is V2Ray?', answer:'V2Ray is a powerful proxy platform designed to bypass strict network censorship. It provides better speed, security, and evasion capabilities than traditional VPNs like OpenVPN.', category:'Technical' },
  { id:'2', question:'How long does payment activation take?', answer:'We manually review all payments. Activation typically takes 10 minutes to 2 hours during normal hours (8 AM – 10 PM). HelaPay and eZcash payments are auto-verified and usually instant.', category:'Payments' },
  { id:'3', question:'Can I use one account on multiple devices?', answer:'Yes! Depending on your plan. Starter allows 1 device, Pro allows 3, and Elite allows unlimited simultaneous connections.', category:'Plans' },
  { id:'4', question:'Do you keep logs?', answer:'No. We have a strict zero-logs policy. We never monitor, record, or store any data about your browsing activity.', category:'General' },
  { id:'5', question:'How do I set up the connection?', answer:'For Android, download "v2rayNG". For iOS, use "Shadowrocket" or "V2Box". Copy your unique config from the Client Portal and import it into the app.', category:'Technical' },
  { id:'6', question:'What payment methods do you accept?', answer:'We accept HelaPay / Helakuru (auto-verified), eZcash (auto-verified), and Bank Transfer (manual review within 2–24 hours).', category:'Payments' },
];

const FAQ = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(null);
  const { data: faqs } = useRealtimeCollection('faq', []);

  const displayFaqs = faqs?.length > 0 ? faqs.sort((a, b) => a.order - b.order) : FALLBACK;
  const categories = ['All', ...new Set(displayFaqs.map(f => f.category))];

  const filtered = displayFaqs.filter(f => {
    const q = search.toLowerCase();
    return (category === 'All' || f.category === category) &&
      (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  });

  const catColors = { 
    Technical: 'text-brand-glow bg-brand-primary/10 border-brand-primary/20', 
    Payments: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', 
    Plans: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20', 
    General: 'text-slate-400 bg-slate-500/10 border-slate-500/20' 
  };

  return (
    <div className="min-h-screen bg-bg-deep relative overflow-hidden">
      <SEO 
        title="FAQ" 
        description="Frequently Asked Questions about ShiftLK Netch. Find answers about V2Ray setup, payments, and secure connections." 
        keywords="FAQ, Support, V2Ray help, ShiftLK support, VPN help"
      />
      {/* SECTION 1 — HERO BACKGROUND (Matching Home) */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-brand-primary/10 rounded-full blur-[100px] animate-pulse duration-1000" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-glow/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,106,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,0,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>
      </div>

      <div className="container-main relative pt-32 pb-20">
        
        {/* HEADER AREA */}
        <div className="text-center mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 border border-brand-primary/20 bg-brand-primary/5 backdrop-blur-md rounded-full px-4 py-2 text-[10px] uppercase font-black tracking-widest text-brand-glow mb-6 shadow-[0_0_20px_rgba(255,106,0,0.1)]">
            <span className="text-brand-primary animate-pulse">✦</span> Support Center
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Frequently Asked <span className="bg-gradient-to-r from-brand-primary via-brand-glow to-brand-primary bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about ShiftLK Netch services, 
            setup, and secure connections.
          </p>

          {/* SEARCH BOX */}
          <div className="relative mt-10 max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-brand-glow/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors"></i>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for questions, keywords, or topics..."
                className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-brand-surface/80 border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary/30 transition-all text-sm backdrop-blur-xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 reveal-on-scroll">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-300 ${
                category === c
                  ? 'bg-gradient-to-r from-brand-primary to-brand-glow text-brand-bg border-transparent shadow-[0_10px_20px_rgba(255,106,0,0.2)] scale-105'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:border-brand-primary/20 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ACCORDION LIST */}
        <div className="max-w-4xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 glass-card reveal-on-scroll">
              <i className="fa-solid fa-ghost text-5xl text-slate-700 mb-4 block"></i>
              <h3 className="text-white font-bold mb-1">No matching questions</h3>
              <p className="text-slate-500">Try using different keywords or reset the category.</p>
              <button onClick={() => {setSearch(''); setCategory('All');}} className="btn-outline btn-sm mt-4">Reset Filters</button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((faq, idx) => {
                const isOpen = open === faq.id;
                const catCls = catColors[faq.category] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                return (
                  <div
                    key={faq.id}
                    className={`glass-card bg-brand-surface/60 reveal-on-scroll overflow-hidden transition-all duration-500 ${
                      isOpen ? 'border-brand-primary/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'border-white/5'
                    }`}
                    style={{ '--delay': `${idx * 0.05}s` }}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className={`text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg border hidden sm:block ${catCls}`}>
                          {faq.category}
                        </span>
                        <h4 className={`text-base font-bold transition-colors ${isOpen ? 'text-brand-primary' : 'text-slate-100 group-hover:text-white'}`}>
                          {faq.question}
                        </h4>
                      </div>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isOpen 
                          ? 'bg-brand-primary text-brand-bg shadow-[0_0_20px_rgba(255,106,0,0.4)] rotate-180' 
                          : 'bg-white/5 text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary'
                      }`}>
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </button>
                    
                    <div 
                      className={`transition-all duration-500 ease-in-out ${
                        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-white/5">
                        <p className="text-slate-400 text-sm leading-relaxed mb-0">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM CTA (Matching Home premium banners) */}
        <div className="max-w-4xl mx-auto mt-20 reveal-on-scroll">
          <div className="relative overflow-hidden rounded-3xl p-10 border border-brand-primary/10 bg-brand-surface group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-brand-primary/20 transition-all duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <i className="fa-solid fa-headset text-brand-primary text-xl"></i>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Still have questions?</h2>
                <p className="text-slate-400 text-sm mb-0">Our support team is available 24/7 on Telegram and WhatsApp.</p>
              </div>
              <Link 
                to="/contact" 
                className="btn-premium no-underline flex items-center gap-2 group-hover:scale-105 transition-all"
              >
                Get Support Now <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
