import { useState, useEffect } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { updateSiteSettings } from '../../services/settingsService';
import { Save, Plus, Trash2, Upload, Check } from 'lucide-react';

const TABS = ['hero', 'features', 'faq', 'footer', 'contact', 'navbar'];

export default function AdminSiteSettings() {
  const { settings } = useSiteSettings();
  const [tab, setTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (section, data) => {
    setSaving(true);
    try {
      await updateSiteSettings(section, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 style={pageTitle}>Site Settings</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: tab === t ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
            border: tab === t ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.07)',
            color: tab === t ? '#a78bfa' : '#64748b', textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {saved && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={14} /> Settings saved successfully
        </div>
      )}

      {tab === 'hero' && <HeroEditor key="hero" data={settings.hero} onSave={d => handleSave('hero', d)} saving={saving} />}
      {tab === 'features' && <FeaturesEditor key="features" data={settings.features} onSave={d => handleSave('features', d)} saving={saving} />}
      {tab === 'faq' && <FAQEditor key="faq" data={settings.faq} onSave={d => handleSave('faq', d)} saving={saving} />}
      {tab === 'footer' && <FooterEditor key="footer" data={settings.footer} onSave={d => handleSave('footer', d)} saving={saving} />}
      {tab === 'contact' && <ContactEditor key="contact" data={settings.contact} onSave={d => handleSave('contact', d)} saving={saving} />}
      {tab === 'navbar' && <NavbarEditor key="navbar" data={settings.navbar} onSave={d => handleSave('navbar', d)} saving={saving} />}
    </div>
  );
}

// ── Hero Editor ──────────────────────────────────────────────────────────────
function HeroEditor({ data, onSave, saving }) {
  const [form, setForm] = useState({ ...data });
  useEffect(() => { setForm({ ...data }); }, [data]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div style={glassCard}>
      <h3 style={sectionTitle}>Hero Section</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 16px' }}>
        <Field label="Badge text" value={form.badge} onChange={v => set('badge', v)} />
        <Field label="CTA Button Text" value={form.ctaText} onChange={v => set('ctaText', v)} />
      </div>
      <Field label="Main Title (use \n for line break)" value={form.title} onChange={v => set('title', v)} textarea />
      <Field label="Subtitle" value={form.subtitle} onChange={v => set('subtitle', v)} textarea />
      <SaveBtn onClick={() => onSave(form)} saving={saving} />
    </div>
  );
}

// ── Features Editor ──────────────────────────────────────────────────────────
function FeaturesEditor({ data, onSave, saving }) {
  const [items, setItems] = useState(data.items || []);
  useEffect(() => { setItems(data.items || []); }, [data]);
  const update = (i, k, v) => setItems(p => p.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const add = () => setItems(p => [...p, { icon: 'Zap', title: '', desc: '' }]);
  const remove = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  return (
    <div style={glassCard}>
      <h3 style={sectionTitle}>Features</h3>
      {items.map((item, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Feature {i + 1}</span>
            <button onClick={() => remove(i)} style={trashBtn}><Trash2 size={12} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <Field label="Icon (Lucide name)" value={item.icon} onChange={v => update(i, 'icon', v)} />
            <Field label="Title" value={item.title} onChange={v => update(i, 'title', v)} />
          </div>
          <Field label="Description" value={item.desc} onChange={v => update(i, 'desc', v)} />
        </div>
      ))}
      <button onClick={add} style={ghostBtn}><Plus size={13} /> Add Feature</button>
      <SaveBtn onClick={() => onSave({ items })} saving={saving} />
    </div>
  );
}

// ── FAQ Editor ────────────────────────────────────────────────────────────────
function FAQEditor({ data, onSave, saving }) {
  const [items, setItems] = useState(data.items || []);
  useEffect(() => { setItems(data.items || []); }, [data]);
  const update = (i, k, v) => setItems(p => p.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const add = () => setItems(p => [...p, { q: '', a: '' }]);
  const remove = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  return (
    <div style={glassCard}>
      <h3 style={sectionTitle}>FAQ Items</h3>
      {items.map((item, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Question {i + 1}</span>
            <button onClick={() => remove(i)} style={trashBtn}><Trash2 size={12} /></button>
          </div>
          <Field label="Question" value={item.q} onChange={v => update(i, 'q', v)} />
          <Field label="Answer" value={item.a} onChange={v => update(i, 'a', v)} textarea />
        </div>
      ))}
      <button onClick={add} style={ghostBtn}><Plus size={13} /> Add FAQ</button>
      <SaveBtn onClick={() => onSave({ items })} saving={saving} />
    </div>
  );
}

// ── Footer Editor ─────────────────────────────────────────────────────────────
function FooterEditor({ data, onSave, saving }) {
  const [form, setForm] = useState({ ...data, social: data.social || {}, links: data.links || [] });
  useEffect(() => { setForm({ ...data, social: data.social || {}, links: data.links || [] }); }, [data]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setSocial = (k, v) => setForm(p => ({ ...p, social: { ...p.social, [k]: v } }));
  const addLink = () => setForm(p => ({ ...p, links: [...p.links, { label: '', href: '' }] }));
  const updateLink = (i, k, v) => setForm(p => ({ ...p, links: p.links.map((l, idx) => idx === i ? { ...l, [k]: v } : l) }));
  const removeLink = (i) => setForm(p => ({ ...p, links: p.links.filter((_, idx) => idx !== i) }));
  return (
    <div style={glassCard}>
      <h3 style={sectionTitle}>Footer</h3>
      <Field label="Tagline" value={form.tagline} onChange={v => set('tagline', v)} />
      <Field label="Copyright text" value={form.copyright} onChange={v => set('copyright', v)} />
      <div style={{ margin: '20px 0 10px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Social Links</div>
      {['discord', 'whatsapp', 'telegram'].map(k => (
        <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1) + ' URL'} value={form.social[k] || ''} onChange={v => setSocial(k, v)} />
      ))}
      <div style={{ margin: '20px 0 10px', fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Footer Links</div>
      {form.links.map((l, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}><Field label="Label" value={l.label} onChange={v => updateLink(i, 'label', v)} /></div>
          <div style={{ flex: 2 }}><Field label="URL" value={l.href} onChange={v => updateLink(i, 'href', v)} /></div>
          <button onClick={() => removeLink(i)} style={{ ...trashBtn, marginBottom: '14px' }}><Trash2 size={13} /></button>
        </div>
      ))}
      <button onClick={addLink} style={ghostBtn}><Plus size={13} /> Add Link</button>
      <SaveBtn onClick={() => onSave(form)} saving={saving} />
    </div>
  );
}

// ── Contact Editor ────────────────────────────────────────────────────────────
function ContactEditor({ data, onSave, saving }) {
  const [form, setForm] = useState({ ...data });
  useEffect(() => { setForm({ ...data }); }, [data]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div style={glassCard}>
      <h3 style={sectionTitle}>Contact Info</h3>
      {['email', 'discord', 'whatsapp', 'telegram'].map(k => (
        <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={form[k] || ''} onChange={v => set(k, v)} />
      ))}
      <SaveBtn onClick={() => onSave(form)} saving={saving} />
    </div>
  );
}

// ── Navbar Editor ─────────────────────────────────────────────────────────────
function NavbarEditor({ data, onSave, saving }) {
  const [form, setForm] = useState({ ...data });
  useEffect(() => { setForm({ ...data }); }, [data]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 200 * 1024) { alert('Logo must be under 200KB'); return; }
    const reader = new FileReader();
    reader.onload = ev => set('logoBase64', ev.target.result.split(',')[1]);
    reader.readAsDataURL(file);
  };

  return (
    <div style={glassCard}>
      <h3 style={sectionTitle}>Navbar</h3>
      <Field label="Brand Name" value={form.brandName || ''} onChange={v => set('brandName', v)} />
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Logo Image (max 200KB)</label>
        {form.logoBase64 && (
          <img src={'data:image/png;base64,' + form.logoBase64} alt="logo preview" style={{ height: 40, marginBottom: '10px', borderRadius: '8px', display: 'block', background: '#0a0a1a', padding: '4px' }} />
        )}
        <label style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
          <Upload size={13} /> Upload Logo
          <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
        </label>
        {form.logoBase64 && (
          <button onClick={() => set('logoBase64', '')} style={{ marginLeft: '10px', padding: '9px 14px', borderRadius: '10px', background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)', color: '#fb7185', fontSize: '13px', cursor: 'pointer' }}>Remove</button>
        )}
      </div>
      <SaveBtn onClick={() => onSave(form)} saving={saving} />
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function Field({ label, value, onChange, textarea }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{label}</label>
      {textarea ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} style={inputStyle} />
      ) : (
        <input value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}

function SaveBtn({ onClick, saving }) {
  return (
    <button onClick={onClick} disabled={saving} style={{ marginTop: '8px', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px', opacity: saving ? 0.7 : 1 }}>
      <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

const pageTitle = { fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '24px' };
const sectionTitle = { fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' };
const glassCard = { background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' };
const ghostBtn = { marginBottom: '16px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(124,58,237,0.08)', border: '1px dashed rgba(124,58,237,0.3)', color: '#a78bfa', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
const trashBtn = { width: 28, height: 28, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(251,113,133,0.12)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' };
