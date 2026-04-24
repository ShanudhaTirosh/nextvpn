import React, { useState, useEffect } from 'react';
import { useDocument } from '../../hooks/useFirestore';
import { updateDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const SectionCard = ({ title, icon, children }) => (
  <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 backdrop-blur-sm h-full">
    <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
      <i className={`fa-solid ${icon} text-cyan-400`}></i> {title}
    </h2>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
    {children}
  </div>
);

const inp = "w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/10 transition-all text-sm";

const Settings = () => {
  const { data: config, loading } = useDocument('siteSettings', 'config');
  const [formData, setFormData] = useState({
    contactEmail: '', phone: '', address: '',
    socialLinks: { facebook: '', telegram: '', instagram: '', whatsapp: '' },
    paymentDetails: { helaPay: '', eZcash: '', bankAccount: { bank: '', name: '', number: '' } },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(prev => ({
        ...prev, ...config,
        socialLinks: { ...prev.socialLinks, ...(config.socialLinks || {}) },
        paymentDetails: {
          ...prev.paymentDetails, ...(config.paymentDetails || {}),
          bankAccount: { ...prev.paymentDetails.bankAccount, ...(config.paymentDetails?.bankAccount || {}) },
        },
      }));
    }
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const setNested = (section, field, value) => setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const setDeep = (section, sub, field, value) => setFormData(prev => ({ ...prev, [section]: { ...prev[section], [sub]: { ...prev[section][sub], [field]: value } } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateDocument('siteSettings', 'config', formData);
      showToast.success('Settings saved successfully!');
    } catch (err) {
      showToast.error('Failed to save. Does the config document exist in Firestore?');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Global Settings</h1>
          <p className="text-slate-500 text-sm">Manage website contact info and payment receiving accounts.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <SectionCard title="Contact & Social" icon="fa-address-book">
            <div className="space-y-4">
              <Field label="Support Email">
                <input type="email" className={inp} value={formData.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="support@example.com" />
              </Field>
              <Field label="Phone / WhatsApp">
                <input type="text" className={inp} value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="+94 7X XXX XXXX" />
              </Field>
              <Field label="Physical Address">
                <input type="text" className={inp} value={formData.address} onChange={e => set('address', e.target.value)} placeholder="No. 1, Main Street, Colombo" />
              </Field>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Social Links</p>
                <div className="space-y-3">
                  {[
                    { key: 'facebook', icon: 'fa-facebook', color: 'text-blue-500', ph: 'https://facebook.com/...' },
                    { key: 'telegram', icon: 'fa-telegram', color: 'text-sky-400', ph: 'https://t.me/...' },
                    { key: 'instagram', icon: 'fa-instagram', color: 'text-pink-400', ph: 'https://instagram.com/...' },
                    { key: 'whatsapp', icon: 'fa-whatsapp', color: 'text-emerald-400', ph: 'https://wa.me/...' },
                  ].map(s => (
                    <div key={s.key} className="flex gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                        <i className={`fa-brands ${s.icon} ${s.color} text-sm`}></i>
                      </div>
                      <input type="text" className={inp} value={formData.socialLinks[s.key]} onChange={e => setNested('socialLinks', s.key, e.target.value)} placeholder={s.ph} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Payment Receiving Details" icon="fa-money-bill-wave">
            <p className="text-xs text-slate-500 mb-5">These details are shown to users during the manual payment checkout flow.</p>
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><i className="fa-solid fa-mobile-screen text-cyan-400"></i> Mobile Wallets</p>
                <Field label="HelaPay Number">
                  <input type="text" className={inp} value={formData.paymentDetails.helaPay} onChange={e => setNested('paymentDetails', 'helaPay', e.target.value)} placeholder="07XXXXXXXX" />
                </Field>
                <Field label="eZcash Number">
                  <input type="text" className={inp} value={formData.paymentDetails.eZcash} onChange={e => setNested('paymentDetails', 'eZcash', e.target.value)} placeholder="07XXXXXXXX" />
                </Field>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><i className="fa-solid fa-building-columns text-purple-400"></i> Bank Transfer</p>
                <Field label="Bank Name">
                  <input type="text" className={inp} value={formData.paymentDetails.bankAccount.bank} onChange={e => setDeep('paymentDetails', 'bankAccount', 'bank', e.target.value)} placeholder="Commercial Bank" />
                </Field>
                <Field label="Account Name">
                  <input type="text" className={inp} value={formData.paymentDetails.bankAccount.name} onChange={e => setDeep('paymentDetails', 'bankAccount', 'name', e.target.value)} placeholder="John Doe" />
                </Field>
                <Field label="Account Number">
                  <input type="text" className={inp} value={formData.paymentDetails.bankAccount.number} onChange={e => setDeep('paymentDetails', 'bankAccount', 'number', e.target.value)} placeholder="1234567890" />
                </Field>
              </div>
            </div>
          </SectionCard>

        </div>
      </form>
    </div>
  );
};

export default Settings;
