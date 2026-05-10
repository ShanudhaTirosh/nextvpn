import { useState } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { updateSiteSettings } from '../../services/settingsService';
import { Save, Webhook, Send } from 'lucide-react';

export default function AdminWebhooks() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ ...settings.webhooks });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings('webhooks', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
    setSaving(false);
  };

  const testWebhook = async (key, url) => {
    if (!url) { alert('Enter a webhook URL first'); return; }
    setTesting(key);
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'NovaVPN',
          embeds: [{
            title: '🧪 Test Webhook',
            description: 'This is a test message from NovaVPN Admin.',
            color: 0x7c3aed,
            timestamp: new Date().toISOString(),
          }],
        }),
      });
      alert('Test sent! Check your Discord channel.');
    } catch (err) {
      alert('Test failed: ' + err.message);
    }
    setTesting('');
  };

  const WEBHOOKS = [
    { key: 'payments', label: 'Payments Channel', desc: 'Fires when a user submits a new payment proof', color: '#7c3aed' },
    { key: 'chat', label: 'Chat Channel', desc: 'Fires when a user sends a new chat message', color: '#06b6d4' },
    { key: 'contact', label: 'Contact Channel', desc: 'Fires when someone submits the contact form', color: '#f472b6' },
  ];

  return (
    <div>
      <h2 style={pageTitle}>Discord Webhooks</h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
        Configure Discord webhook URLs for real-time notifications. Create webhooks in your Discord server settings under Integrations.
      </p>

      {saved && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '13px' }}>
          ✓ Webhook URLs saved successfully
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {WEBHOOKS.map(({ key, label, desc, color }) => (
          <div key={key} style={{ background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: '0 0 6px ' + color }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{label}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>{desc}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={form[key] || ''}
                onChange={e => set(key, e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '13px', outline: 'none', fontFamily: 'monospace' }}
              />
              <button
                onClick={() => testWebhook(key, form[key])}
                disabled={testing === key}
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid ' + color + '40', background: color + '12', color: color, fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <Send size={13} /> {testing === key ? 'Testing...' : 'Test'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Save size={15} /> {saving ? 'Saving...' : 'Save Webhooks'}
      </button>
    </div>
  );
}

const pageTitle = { fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' };
