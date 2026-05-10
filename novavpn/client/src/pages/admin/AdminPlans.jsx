import { useEffect, useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';

const EMPTY = { name: '', price: '', duration: 30, dataLimitGB: 10, features: '', badge: '', active: true };

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, 'plans'), snap => {
      setPlans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      dataLimitGB: Number(form.dataLimitGB),
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      badge: form.badge.trim(),
      active: form.active,
      updatedAt: serverTimestamp(),
    };
    try {
      if (editId) {
        await updateDoc(doc(db, 'plans', editId), data);
      } else {
        await addDoc(collection(db, 'plans'), { ...data, createdAt: serverTimestamp() });
      }
      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
    setSaving(false);
  };

  const handleEdit = (p) => {
    setForm({ ...p, features: (p.features || []).join('\n') });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    await deleteDoc(doc(db, 'plans', id));
  };

  const toggleActive = async (p) => {
    await updateDoc(doc(db, 'plans', p.id), { active: !p.active });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={pageTitle}>Plans</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} style={addBtn}>
          <Plus size={14} /> Add Plan
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {plans.map(p => (
          <div key={p.id} style={{ ...glassCard, opacity: p.active ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9' }}>{p.name}</div>
                {p.badge && <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '2px' }}>{p.badge}</div>}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Rs.{p.price}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
              {p.dataLimitGB} GB &nbsp;·&nbsp; {p.duration} Days
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(p.features || []).slice(0, 3).map((f, i) => (
                <li key={i} style={{ fontSize: '12px', color: '#94a3b8' }}>• {f}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(p)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <Edit2 size={12} /> Edit
              </button>
              <button onClick={() => toggleActive(p)} style={{ width: 34, height: 34, borderRadius: '8px', border: 'none', cursor: 'pointer', background: p.active ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)', color: p.active ? '#34d399' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              </button>
              <button onClick={() => handleDelete(p.id)} style={{ width: 34, height: 34, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(251,113,133,0.12)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowForm(false)}>
          <div style={{ width: 'min(480px, 100%)', background: 'rgba(10,10,26,0.98)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>{editId ? 'Edit Plan' : 'New Plan'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[['Plan Name', 'name', 'text'], ['Price (LKR)', 'price', 'number'], ['Duration (days)', 'duration', 'number'], ['Data Limit (GB)', 'dataLimitGB', 'number'], ['Badge (optional)', 'badge', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Features (one per line)</label>
                <textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#94a3b8' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                Active (visible to users)
              </label>
            </div>
            <button onClick={handleSave} disabled={saving} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const pageTitle = { fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '0' };
const glassCard = { background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' };
const addBtn = { padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
