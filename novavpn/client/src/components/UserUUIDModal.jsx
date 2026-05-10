import { useState } from 'react';
import { X, Save, User, Hash, Link, Loader } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function UserUUIDModal({ userDoc, onClose }) {
  const [uuid, setUuid] = useState(userDoc?.uuid || '');
  const [subscriptionId, setSubscriptionId] = useState(userDoc?.subscriptionId || '');
  const [configString, setConfigString] = useState(userDoc?.configString || '');
  const [planId, setPlanId] = useState(userDoc?.planId || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateDoc(doc(db, 'users', userDoc.uid), {
        uuid: uuid.trim(),
        subscriptionId: subscriptionId.trim(),
        configString: configString.trim(),
        planId: planId.trim() || null,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('Failed to save: ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: 'min(480px, 100%)',
        background: 'rgba(10,10,26,0.98)',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 20px 80px rgba(0,0,0,0.7)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Edit User Config</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{userDoc?.email}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <ModalField
            icon={<Hash size={14} />}
            label="V2Ray UUID"
            value={uuid}
            onChange={setUuid}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            mono
          />
          <ModalField
            icon={<User size={14} />}
            label="Subscription ID"
            value={subscriptionId}
            onChange={setSubscriptionId}
            placeholder="subscription_id from 3x-UI"
            mono
          />
          <ModalField
            icon={<Link size={14} />}
            label="Config String (vless/vmess link)"
            value={configString}
            onChange={setConfigString}
            placeholder="vless://..."
            mono
            textarea
          />
          <ModalField
            icon={<Hash size={14} />}
            label="Plan ID (optional override)"
            value={planId}
            onChange={setPlanId}
            placeholder="Leave blank to keep current plan"
          />
        </div>

        {error && (
          <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(244,63,94,0.1)', fontSize: '13px', color: '#fb7185' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={saveBtnStyle}>
            {saving ? <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalField({ icon, label, value, onChange, placeholder, mono, textarea }) {
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f1f5f9',
    fontSize: mono ? '12px' : '14px',
    fontFamily: mono ? 'monospace' : 'inherit',
    outline: 'none',
    resize: textarea ? 'vertical' : 'none',
    minHeight: textarea ? '80px' : 'auto',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
        {icon} {label}
      </label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

const cancelBtnStyle = {
  padding: '9px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#94a3b8', cursor: 'pointer',
};
const saveBtnStyle = {
  padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none',
  color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '6px',
};
