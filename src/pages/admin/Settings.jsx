import React, { useState, useEffect } from 'react';
import { useDocument } from '../../hooks/useFirestore';
import { setDocument, getDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const SectionCard = ({ title, icon, children }) => (
  <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 backdrop-blur-sm h-full">
    <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
      <i className={`fa-solid ${icon} text-brand-primary`}></i> {title}
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

const inp = "w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/10 transition-all text-sm";

const Settings = () => {
  const { data: config, loading } = useDocument('siteSettings', 'config');
  const [formData, setFormData] = useState({
    siteName: 'ShiftLK Netch',
    contactEmail: '', phone: '', address: '',
    socialLinks: { facebook: '', telegram: '', instagram: '', whatsapp: '' },
    paymentDetails: { helaPay: '', eZcash: '', bankAccount: { bank: '', branch: '', name: '', number: '' } },
    branding: { logoUrl: '', primaryColor: '#FF6A00' },
    notifications: { discordWebhook: '', supportWebhook: '', chatWebhook: '', telegramBotToken: '', telegramChatId: '' },
    xuiBaseUrl: '',
    xuiConfig: { apiUrl: '', username: '', password: '', enabled: false, proxyUrl: '' },
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
        branding: { ...prev.branding, ...(config.branding || {}) },
        notifications: { ...prev.notifications, ...(config.notifications || {}) },
      }));
    }
  }, [config]);

  // Load private settings (X-UI config) for admins
  useEffect(() => {
    const loadPrivate = async () => {
      try {
        const xuiData = await getDocument('privateSettings', 'xuiConfig');
        if (xuiData) {
          setFormData(prev => ({ ...prev, xuiConfig: { ...prev.xuiConfig, ...xuiData } }));
        }
      } catch (e) {
        console.error('Failed to load private settings', e);
      }
    };
    loadPrivate();
  }, []);

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const setNested = (section, field, value) => setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const setDeep = (section, sub, field, value) => setFormData(prev => ({ ...prev, [section]: { ...prev[section], [sub]: { ...prev[section][sub], [field]: value } } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { xuiConfig, ...publicConfig } = formData;
      await setDocument('siteSettings', 'config', publicConfig);
      await setDocument('privateSettings', 'xuiConfig', xuiConfig);
      showToast.success('Settings saved successfully!');
    } catch (err) {
      showToast.error('Failed to save settings.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-glow text-brand-bg font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all disabled:opacity-50"
        >
          {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <SectionCard title="Contact & Social" icon="fa-address-book">
            <div className="space-y-4">
              <Field label="Website Name">
                <input type="text" className={inp} value={formData.siteName} onChange={e => set('siteName', e.target.value)} placeholder="ShiftLK Netch" />
              </Field>
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
                    { key: 'telegram', icon: 'fa-telegram', color: 'text-sky-400', ph: 'https://t.me/your_group_link' },
                    { key: 'whatsapp', icon: 'fa-whatsapp', color: 'text-emerald-400', ph: 'https://wa.me/...' },
                    { key: 'discord', icon: 'fa-discord', color: 'text-indigo-400', ph: 'https://discord.gg/...' },
                    { key: 'youtube', icon: 'fa-youtube', color: 'text-red-500', ph: 'https://youtube.com/...' },
                    { key: 'tiktok', icon: 'fa-tiktok', color: 'text-pink-400', ph: 'https://tiktok.com/...' },
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
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><i className="fa-solid fa-mobile-screen text-brand-primary"></i> Mobile Wallets</p>
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
                <Field label="Branch Name">
                  <input type="text" className={inp} value={formData.paymentDetails.bankAccount.branch} onChange={e => setDeep('paymentDetails', 'bankAccount', 'branch', e.target.value)} placeholder="Colombo 07" />
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

          <SectionCard title="Branding" icon="fa-palette">
            <div className="space-y-4">
              <Field label="Logo URL (Image Link)">
                <input type="text" className={inp} value={formData.branding.logoUrl} onChange={e => setNested('branding', 'logoUrl', e.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Primary Theme Color">
                <div className="flex gap-2">
                  <input type="color" className="w-10 h-10 p-1 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer" value={formData.branding.primaryColor} onChange={e => setNested('branding', 'primaryColor', e.target.value)} />
                  <input type="text" className={inp} value={formData.branding.primaryColor} onChange={e => setNested('branding', 'primaryColor', e.target.value)} placeholder="#FF6A00" />
                </div>
              </Field>
              <div className="pt-4 border-t border-slate-800 mt-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">X-UI Integration & API</p>
                <Field label="X-UI Subscription Base URL">
                  <input type="text" className={inp} value={formData.xuiBaseUrl} onChange={e => set('xuiBaseUrl', e.target.value)} placeholder="https://your-domain.com:2096/sub/" />
                </Field>
                <p className="text-[10px] text-slate-600 mt-1 mb-5 italic">Example: https://slkv2rays.duckdns.org:2096/sub/</p>

                <div className="flex items-center gap-3 mb-4">
                  <button 
                    type="button"
                    onClick={() => setNested('xuiConfig', 'enabled', !formData.xuiConfig.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.xuiConfig.enabled ? 'bg-brand-primary' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.xuiConfig.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-semibold text-slate-300">Enable Automated Sync & Control</span>
                </div>
                
                {formData.xuiConfig.enabled && (
                  <div className="space-y-4 p-4 rounded-xl bg-slate-900/40 border border-brand-primary/20">
                    <Field label="VPS Proxy URL">
                      <input type="text" className={inp} value={formData.xuiConfig.proxyUrl} onChange={e => setNested('xuiConfig', 'proxyUrl', e.target.value)} placeholder="http://YOUR_VPS_IP:3001/api/xui" />
                    </Field>
                    <Field label="X-UI API URL (Local Panel Address)">
                      <input type="text" className={inp} value={formData.xuiConfig.apiUrl} onChange={e => setNested('xuiConfig', 'apiUrl', e.target.value)} placeholder="http://127.0.0.1:2096" />
                    </Field>
                    <Field label="Admin Username">
                      <input type="text" className={inp} value={formData.xuiConfig.username} onChange={e => setNested('xuiConfig', 'username', e.target.value)} placeholder="admin" />
                    </Field>
                    <Field label="Admin Password">
                      <input type="password" className={inp} value={formData.xuiConfig.password} onChange={e => setNested('xuiConfig', 'password', e.target.value)} placeholder="••••••••" />
                    </Field>
                    <p className="text-[10px] text-emerald-400 italic mt-2"><i className="fa-solid fa-lock"></i> Credentials are stored in a secure vault. The proxy runs securely on your VPS.</p>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>
          
          <SectionCard title="Notification System" icon="fa-bell">
            <p className="text-xs text-slate-500 mb-5">Configure where you receive alerts for new manual payments.</p>
            <div className="space-y-4">
              <Field label="Payment Discord Webhook URL">
                <input type="text" className={inp} value={formData.notifications.discordWebhook} onChange={e => setNested('notifications', 'discordWebhook', e.target.value)} placeholder="https://discord.com/api/webhooks/..." />
              </Field>
              <Field label="Support Discord Webhook URL">
                <input type="text" className={inp} value={formData.notifications.supportWebhook} onChange={e => setNested('notifications', 'supportWebhook', e.target.value)} placeholder="https://discord.com/api/webhooks/..." />
              </Field>
              <Field label="Live Chat Discord Webhook URL">
                <input type="text" className={inp} value={formData.notifications.chatWebhook} onChange={e => setNested('notifications', 'chatWebhook', e.target.value)} placeholder="https://discord.com/api/webhooks/..." />
              </Field>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
                <p className="text-xs font-bold text-sky-400 flex items-center gap-2"><i className="fa-brands fa-telegram"></i> Telegram Bot Notifications</p>
                <Field label="Bot Token">
                  <input type="text" className={inp} value={formData.notifications.telegramBotToken} onChange={e => setNested('notifications', 'telegramBotToken', e.target.value)} placeholder="123456789:ABCDefgh..." />
                </Field>
                <Field label="Chat ID (Your ID or Group ID)">
                  <input type="text" className={inp} value={formData.notifications.telegramChatId} onChange={e => setNested('notifications', 'telegramChatId', e.target.value)} placeholder="-100XXXXXXXXXX" />
                </Field>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Tip: Create a bot via @BotFather, add it to your group, and use @IDBot to find your Chat ID.
                </p>
              </div>
            </div>
          </SectionCard>

        </div>
      </form>
    </div>
  );
};

export default Settings;
