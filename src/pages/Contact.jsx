import React, { useState } from 'react';
import { addDocument } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useDocument } from '../hooks/useFirestore';
import { showToast } from '../components/Toast';
import { sendSupportNotification } from '../utils/notifications';

const Inp = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
    {children}
  </div>
);
const inp = "w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/20 transition-all text-sm disabled:opacity-50";

const ContactCard = ({ href, icon, iconClass, label, value, target }) => (
  <a href={href} target={target} rel={target ? "noreferrer" : undefined}
    className="no-underline flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 hover:border-slate-600 transition-all group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
      <i className={`fa-${icon.includes('fa-brands') ? 'brands' : 'solid'} ${icon.replace('fa-brands ','').replace('fa-solid ','')} text-xl`}></i>
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className="text-white font-semibold text-sm group-hover:text-brand-primary transition-colors">{value}</p>
    </div>
  </a>
);

const Contact = () => {
  const { currentUser } = useAuth();
  const { data: config } = useDocument('siteSettings', 'config');
  const [form, setForm] = useState({ name: currentUser?.displayName || '', email: currentUser?.email || '', subject: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { showToast.error('Please fill in all required fields.'); return; }
    setLoading(true);
    try {
      await addDocument('tickets', { ...form, uid: currentUser?.uid || 'guest', status: 'open' });
      sendSupportNotification(form, config).catch(console.error);
      setSent(true);
    } catch { showToast.error('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-glow/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-5">
            <i className="fa-solid fa-headset text-[10px]"></i> 24/7 Support
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            We're Here to <span className="bg-gradient-to-r from-brand-primary to-brand-glow bg-clip-text text-transparent">Help</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Have a question or need technical support? Reach out and our team will get back to you fast.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 backdrop-blur-sm h-full">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <i className="fa-solid fa-circle-check text-emerald-400 text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400 text-sm mb-5">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="px-5 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm transition-all">Send another →</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-base font-bold text-white mb-5">Send a Message</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Inp label="Your Name"><input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" disabled={loading} /></Inp>
                    <Inp label="Email Address"><input type="email" className={inp} value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" disabled={loading} /></Inp>
                  </div>
                  <Inp label="Subject">
                    <select className={inp} value={form.subject} onChange={e => set('subject', e.target.value)} disabled={loading}>
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing Question</option>
                      <option>Partnership / Reseller</option>
                    </select>
                  </Inp>
                  <Inp label="Message">
                    <textarea className={`${inp} min-h-[130px] resize-none`} value={form.message} onChange={e => set('message', e.target.value)} placeholder="How can we help you?" disabled={loading} />
                  </Inp>
                  <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-glow text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-paper-plane"></i> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <ContactCard href={`mailto:${config?.contactEmail || 'skg.kenjigaming@gmail.com'}`} icon="envelope" iconClass="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary" label="Email Us" value={config?.contactEmail || 'skg.kenjigaming@gmail.com'} />
            <ContactCard 
              href={config?.socialLinks?.telegram || 'https://t.me/shiftlk'} 
              icon="fa-brands fa-telegram" 
              iconClass="bg-blue-500/10 border border-blue-500/20 text-sky-400" 
              label="Telegram Group" 
              value={config?.socialLinks?.telegram ? "@" + config.socialLinks.telegram.split('/').pop() : "@shiftlk"} 
              target="_blank" 
            />
            <ContactCard 
              href={config?.socialLinks?.whatsapp || (config?.phone ? `https://wa.me/${config.phone.replace(/[^0-9]/g,'')}` : 'https://wa.me/94771234567')} 
              icon="fa-brands fa-whatsapp" 
              iconClass="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
              label="WhatsApp" 
              value={config?.phone || '+94 77 123 4567'} 
              target="_blank" 
            />

            <div className="rounded-2xl bg-gradient-to-br from-brand-primary/5 to-brand-glow/5 border border-slate-800 p-5 mt-2">
              <h3 className="text-sm font-bold text-white mb-3">Response Times</h3>
              <div className="space-y-2.5">
                {[['Telegram / WhatsApp','< 1 hour','text-emerald-400'],['Email','< 24 hours','text-amber-400'],['HelaPay / eZcash', 'Auto-verified','text-brand-primary'],['Bank Transfer','2–24 hours','text-blue-400']].map(([ch, time, cls]) => (
                  <div key={ch} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{ch}</span>
                    <span className={`text-xs font-semibold ${cls}`}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
