import React from 'react';
import GlassCard from '../../components/GlassCard';
import { useCollection } from '../../hooks/useFirestore';

const Overview = () => {
  const { data: users } = useCollection('users');
  const { data: payments } = useCollection('payments');
  const { data: servers } = useCollection('servers');
  const { data: tickets } = useCollection('tickets');

  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
  const totalRevenue = payments?.filter(p => p.status === 'approved').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const activeUsers = users?.filter(u => u.isActive && u.plan !== 'none').length || 0;
  const openTickets = tickets?.filter(t => t.status === 'open').length || 0;

  return (
    <div className="animation-fade-in">
      <h2 className="text-white fw-bold mb-4">System Overview</h2>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-4 h-100 border-cyan">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-muted small text-uppercase fw-bold">Active Subscriptions</div>
              <i className="fa-solid fa-users text-cyan fs-4" style={{ color: 'var(--accent-cyan)' }}></i>
            </div>
            <h3 className="text-white fw-bold mb-1">{activeUsers}</h3>
            <p className="text-success small mb-0"><i className="fa-solid fa-arrow-trend-up me-1"></i> +12% this month</p>
          </GlassCard>
        </div>
        
        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-4 h-100 border-warning">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-muted small text-uppercase fw-bold">Pending Payments</div>
              <i className="fa-solid fa-money-bill-transfer text-warning fs-4"></i>
            </div>
            <h3 className="text-white fw-bold mb-1">{pendingPayments}</h3>
            <p className="text-warning small mb-0"><i className="fa-solid fa-clock me-1"></i> Require approval</p>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-4 h-100 border-success">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-muted small text-uppercase fw-bold">Total Revenue</div>
              <i className="fa-solid fa-sack-dollar text-success fs-4"></i>
            </div>
            <h3 className="text-white fw-bold mb-1">LKR {totalRevenue.toLocaleString()}</h3>
            <p className="text-secondary small mb-0">All time approved</p>
          </GlassCard>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <GlassCard className="p-4 h-100 border-danger">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-muted small text-uppercase fw-bold">Open Tickets</div>
              <i className="fa-solid fa-headset text-danger fs-4"></i>
            </div>
            <h3 className="text-white fw-bold mb-1">{openTickets}</h3>
            <p className="text-secondary small mb-0">Awaiting response</p>
          </GlassCard>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Activity (Mocked) */}
        <div className="col-12 col-lg-8">
          <GlassCard className="p-4 h-100">
            <h5 className="text-white mb-4 border-bottom border-secondary pb-3">Recent System Activity</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="feature-icon-wrap mb-0 bg-success bg-opacity-25 border-success" style={{ width: '40px', height: '40px', padding: 0 }}>
                  <i className="fa-solid fa-check text-success"></i>
                </div>
                <div>
                  <div className="text-white small">Payment approved for <strong>UID: asd92...</strong> (Pro Plan)</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>10 mins ago</div>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="feature-icon-wrap mb-0 bg-info bg-opacity-25 border-info" style={{ width: '40px', height: '40px', padding: 0 }}>
                  <i className="fa-solid fa-user-plus text-info"></i>
                </div>
                <div>
                  <div className="text-white small">New user registered: <strong>john@example.com</strong></div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>45 mins ago</div>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="feature-icon-wrap mb-0 bg-warning bg-opacity-25 border-warning" style={{ width: '40px', height: '40px', padding: 0 }}>
                  <i className="fa-solid fa-ticket text-warning"></i>
                </div>
                <div>
                  <div className="text-white small">New support ticket opened by <strong>UID: lkas2...</strong></div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>2 hours ago</div>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="feature-icon-wrap mb-0 bg-danger bg-opacity-25 border-danger" style={{ width: '40px', height: '40px', padding: 0 }}>
                  <i className="fa-solid fa-server text-danger"></i>
                </div>
                <div>
                  <div className="text-white small">Node <strong>London Secure</strong> offline. Attempting restart...</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>5 hours ago</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Server Status Overview */}
        <div className="col-12 col-lg-4">
          <GlassCard className="p-4 h-100">
            <h5 className="text-white mb-4 border-bottom border-secondary pb-3">Node Status</h5>
            
            {servers?.length === 0 ? (
              <p className="text-secondary small">No servers configured.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {servers?.slice(0, 5).map(server => (
                  <div className="d-flex justify-content-between align-items-center" key={server.id}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="location-flag" style={{ fontSize: '1rem' }}>{server.flagEmoji}</span>
                      <span className="text-white small text-truncate" style={{ maxWidth: '120px' }}>{server.name}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-secondary small">{server.activeUsers}/{server.maxUsers}</span>
                      {server.isOnline ? (
                        <span className="online-dot position-relative" style={{ width: '8px', height: '8px' }}></span>
                      ) : (
                        <span className="online-dot position-relative bg-danger shadow-none" style={{ width: '8px', height: '8px' }}></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-top border-secondary text-center">
              <a href="/admin/servers" className="text-cyan text-decoration-none small">View All Nodes <i className="fa-solid fa-arrow-right ms-1"></i></a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Overview;
