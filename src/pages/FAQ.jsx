import React, { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';

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
  const { data: faqs } = useCollection('faq', []);

  const displayFaqs = faqs?.length > 0 ? faqs.sort((a, b) => a.order - b.order) : FALLBACK;
  const categories = ['All', ...new Set(displayFaqs.map(f => f.category))];

  const filtered = displayFaqs.filter(f => {
    const q = search.toLowerCase();
    return (category === 'All' || f.category === category) &&
      (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  });

  const catColors = { Technical:'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', Payments:'text-amber-400 bg-amber-500/10 border-amber-500/20', Plans:'text-blue-400 bg-blue-500/10 border-blue-500/20', General:'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-5">
            <i className="fa-solid fa-circle-question text-[10px]"></i> Support Center
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Frequently Asked <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-slate-500 text-sm">Can't find what you're looking for? <a href="/contact" className="text-cyan-400 no-underline hover:underline">Contact us</a></p>

          {/* Search */}
          <div className="relative mt-6 max-w-md mx-auto">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm pointer-events-none"></i>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/10 transition-all text-sm backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                category === c
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-transparent shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white bg-slate-900/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <i className="fa-solid fa-ghost text-4xl mb-4 block"></i>
            <p>No results for "{search}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((faq, idx) => {
              const isOpen = open === faq.id;
              const catCls = catColors[faq.category] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-cyan-500/30 bg-slate-900/80' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${catCls}`}>{faq.category}</span>
                      <span className={`font-semibold text-sm ${isOpen ? 'text-white' : 'text-slate-300'}`}>{faq.question}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-slate-800 border border-slate-700'}`}>
                      <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`}></i>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <div className="pt-1 border-t border-slate-800">
                        <p className="text-slate-400 text-sm leading-relaxed mt-3">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-slate-800">
          <i className="fa-solid fa-headset text-cyan-400 text-2xl mb-3 block"></i>
          <h3 className="text-white font-bold mb-2">Still have questions?</h3>
          <p className="text-slate-500 text-sm mb-4">Our support team is available 24/7 on Telegram and WhatsApp.</p>
          <a href="/contact" className="no-underline inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
            <i className="fa-solid fa-paper-plane"></i> Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
