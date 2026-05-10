import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { fetchClientUsage } from '../../services/panelService';
import UserUUIDModal from '../../components/UserUUIDModal';
import { Search, Edit2, UserX, UserCheck } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { loadUsers().catch(console.error); }, []);

  const handleCancelPlan = async (uid) => {
    if (!window.confirm('Cancel this user\'s plan?')) return;
    await updateDoc(doc(db, 'users', uid), { status: 'expired', planId: null, updatedAt: serverTimestamp() });
    loadUsers();
  };

  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => s === 'active' ? '#34d399' : s === 'none' ? '#64748b' : '#fb7185';

  return (
    <div>
      <h2 style={pageTitle}>Users</h2>
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '360px' }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div style={glassCard}>
        {loading ? (
          [1,2,3].map(i => <div key={i} style={{ height: 56, borderRadius: '10px', background: 'rgba(255,255,255,0.04)', marginBottom: '8px' }} />)
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {['User', 'Status', 'Plan', 'Expiry', 'UUID', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.uid} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                        ) : (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                            {(u.displayName || u.email || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{u.displayName || 'No name'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, background: statusColor(u.status) + '18', color: statusColor(u.status) }}>
                        {u.status || 'none'}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#94a3b8', fontSize: '13px' }}>{u.planName || u.planId || '-'}</td>
                    <td style={{ padding: '14px', color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {u.planExpiry && u.planExpiry.toDate ? u.planExpiry.toDate().toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <code style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255,255,255,0.04)', padding: '3px 7px', borderRadius: '6px' }}>
                        {u.uuid ? u.uuid.slice(0, 8) + '...' : 'Not set'}
                      </code>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setEditUser(u)} style={{ width: 28, height: 28, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Edit2 size={12} />
                        </button>
                        {u.status === 'active' && (
                          <button onClick={() => handleCancelPlan(u.uid)} style={{ width: 28, height: 28, borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(251,113,133,0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserX size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#475569', fontSize: '14px' }}>No users found.</div>
            )}
          </div>
        )}
      </div>

      {editUser && (
        <UserUUIDModal
          userDoc={editUser}
          onClose={() => { setEditUser(null); loadUsers(); }}
        />
      )}
    </div>
  );
}

const pageTitle = { fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '24px' };
const glassCard = { background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' };
