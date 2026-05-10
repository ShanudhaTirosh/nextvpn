import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, CreditCard, Activity, DollarSign, Clock, Check, X } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, revenue: 0, pending: 0, active: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [usersSnap, paymentsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(20))),
      ]);

      const allPayments = paymentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const approved = allPayments.filter(p => p.status === 'approved');
      const pending = allPayments.filter(p => p.status === 'pending');

      // Revenue from plans - approximate from approved payments
      // Would ideally join with plan prices
      const activeUsers = usersSnap.docs.filter(d => d.data().status === 'active');

      setStats({
        users: usersSnap.size,
        pending: pending.length,
        active: activeUsers.length,
        revenue: approved.length, // count for now; extend with plan price join
      });
      setRecentPayments(allPayments.slice(0, 8));
      setLoading(false);
    }
    load().catch(console.error);
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
    { label: 'Pending Approvals', value: stats.pending, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Active Plans', value: stats.active, icon: Activity, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { label: 'Approved Payments', value: stats.revenue, icon: CreditCard, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  return (
    <div>
      <h2 style={pageTitle}>Overview</h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: c.bg, border: `1px solid ${c.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <c.icon size={20} color={c.color} />
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9' }}>
                {loading ? '—' : c.value}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div style={glassCard}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>Recent Payments</div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 48, borderRadius: '10px', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : recentPayments.length === 0 ? (
          <p style={{ color: '#475569', fontSize: '14px' }}>No payments yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {['User', 'Plan', 'Method', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => {
                  const sColor = p.status === 'approved' ? '#34d399' : p.status === 'rejected' ? '#fb7185' : '#f59e0b';
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px', color: '#94a3b8' }}>{p.userEmail?.split('@')[0]}</td>
                      <td style={{ padding: '12px', color: '#f1f5f9', fontWeight: 500 }}>{p.planName}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{p.method?.toUpperCase()}</td>
                      <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : '-'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                          background: `${sColor}18`, color: sColor,
                        }}>{p.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:0.9} }`}</style>
    </div>
  );
}

const pageTitle = { fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '24px' };
const glassCard = {
  background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)',
};
