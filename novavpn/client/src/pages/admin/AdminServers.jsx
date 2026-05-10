import { useEffect, useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save, Server } from 'lucide-react';

const EMPTY = { label: '', host: '', port: '443', protocol: 'vless', remarks: '', active: true };

export default function AdminServers() {
  const [servers, setServers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, 'servers'), snap => {
      setServers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleSave = async () => {
    if (!form.label || !form.host) return;
    setSaving(true);
    const data = { label: form.label.trim(), host: form.host.trim(), port: Number(form.port), protocol: form.protocol, remarks: form.remarks.trim(), active: form.active, updatedAt: serverTimestamp() };
    try {
      if (editId) {
        await updateDoc(doc(db, 'servers', editId), data);
      } else {
        await addDoc(collection(db, 'servers'), { ...data, createdAt: serverTimestamp() });
      }
      setShowForm(false); setForm(EMPTY); setEditId(null);
    } catch (err) { alert('Save failed: ' + err.message); }
    setSaving(false);
  };

  const handleEdit = (s) => { setForm(s); setEditId(s.id); setShowForm(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete server?')) return; await deleteDoc(doc(db, 'servers', id)); };
  const toggleActive = async (s) => { await updateDoc(doc(db, 'servers', s.id), { active: !s.active }); };

  const protoColor = { vless: '#7c3aed', vmess: '#06b6d4', trojan: '#f472b6' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={pageTitle}>Servers</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} style={addBtn}>
          <Plus size={14} /> Add Server
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {servers.map(s => (
          <div key={s.id} style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '16px', opacity: s.active ? 1 : 0.5, flexWrap: 'wrap' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: (protoColor[s.protocol] || '#7c3aed') + '20', border: '1px solid ' + (protoColor[s.protocol] || '#7c3aed') + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Server size={18} color={protoColor[s.protocol] || '#7c3aed'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{s.label}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                <code style={{ color: '#94a3b8' }}>{s.host}:{s.port}</code>
                &nbsp;&nbsp;
                <span style={{ color: protoColor[s.protocol] || '#7c3aed', fontWeight: 600, fontSize: '12px' }}>{s.protocol?.toUpperCase()}</span>
              </div>
              {s.remarks && <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{s.remarks}</div>}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => handleEdit(s)} style={{ width: 32, height: 32, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Edit2 size={13} />
              </button>
              <button onClick={() => toggleActive(s)} style={{ width: 32, height: 32, borderRadius: '8px', border: 'none', cursor: 'pointer', background: s.active ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)', color: s.active ? '#34d399' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              </button>
              <button onClick={() => handleDelete(s.id)} style={{ width: 32, height: 32, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(251,113,133,0.12)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {servers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
            <Server size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No servers configured yet.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowForm(false)}>
          <div style={{ width: 'min(480px, 100%)', background: 'rgba(10,10,26,0.98)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>{editId ? 'Edit Server' : 'New Server'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[['Label', 'label', 'text'], ['Host / IP', 'host', 'text'], ['Port', 'port', 'number'], ['Remarks', 'remarks', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Protocol</label>
                <select value={form.protocol} onChange={e => setForm(p => ({ ...p, protocol: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {['vless', 'vmess', 'trojan'].map(pr => <option key={pr} value={pr}>{pr.toUpperCase()}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#94a3b8' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                Active
              </label>
            </div>
            <button onClick={handleSave} disabled={saving} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save Server'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const pageTitle = { fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '0' };
const glassCard = { background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '18px 20px', backdropFilter: 'blur(12px)' };
const addBtn = { padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
