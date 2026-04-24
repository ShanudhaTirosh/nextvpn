import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard';
import { useCollection } from '../../hooks/useFirestore';
import { updateDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const Users = () => {
  const { data: users, loading } = useCollection('users');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users?.filter(u => 
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.uid && u.uid.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleUserStatus = async (user) => {
    try {
      await updateDocument('users', user.id, { isActive: !user.isActive });
      showToast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully.`);
    } catch (err) {
      showToast.error("Failed to update user status.");
    }
  };

  const setAdminStatus = async (user, isAdmin) => {
    try {
      await updateDocument('users', user.id, { isAdmin });
      showToast.success(`User admin status updated.`);
    } catch (err) {
      showToast.error("Failed to update admin status.");
    }
  };

  return (
    <div className="animation-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold mb-1">User Management</h2>
          <p className="text-secondary mb-0">View and manage registered clients.</p>
        </div>
        <div className="position-relative" style={{ minWidth: '250px' }}>
          <i className="fa-solid fa-search position-absolute text-muted" style={{ left: '15px', top: '12px' }}></i>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by name, email, or UID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px', paddingRight: '15px', paddingTop: '10px', paddingBottom: '10px' }}
          />
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5"><div className="spinner"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-5">No users found.</td></tr>
                ) : (
                  filteredUsers?.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={user.photoBase64 || 'https://placehold.co/32x32/121826/00E5FF?text=U'}
                            alt="Avatar" 
                            className="rounded-circle" 
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="text-white fw-bold">{user.displayName || 'Unnamed User'}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-capitalize">{user.plan}</td>
                      <td>{user.subscriptionExpiry ? user.subscriptionExpiry.toDate().toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {user.isActive ? (
                          <span className="badge-active bg-success bg-opacity-25 text-success border-success" style={{ fontSize: '0.65rem' }}>Active</span>
                        ) : (
                          <span className="badge-active bg-danger bg-opacity-25 text-danger border-danger" style={{ fontSize: '0.65rem' }}>Inactive</span>
                        )}
                      </td>
                      <td>
                        {user.isAdmin ? (
                          <span className="badge-active bg-warning bg-opacity-25 text-warning border-warning" style={{ fontSize: '0.65rem' }}><i className="fa-solid fa-crown me-1"></i> Admin</span>
                        ) : (
                          <span className="text-secondary small">User</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button 
                          className={`btn btn-sm ${user.isActive ? 'btn-outline-danger' : 'btn-outline-success'} me-2`}
                          onClick={() => toggleUserStatus(user)}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          <i className={`fa-solid ${user.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button 
                          className={`btn btn-sm ${user.isAdmin ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => setAdminStatus(user, !user.isAdmin)}
                          title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        >
                          <i className="fa-solid fa-crown"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Users;
