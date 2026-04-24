import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import GlassCard from '../../components/GlassCard';
import { useCollection } from '../../hooks/useFirestore';
import { addDocument, updateDocument, deleteDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const Servers = () => {
  const { data: servers, loading } = useCollection('servers');
  const [showModal, setShowModal] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    name: '',
    country: '',
    flagEmoji: '🌐',
    protocol: 'VMess',
    address: '',
    latencyMs: 50,
    activeUsers: 0,
    maxUsers: 100,
    region: 'Asia',
    isOnline: true,
    isDDoSProtected: true
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (server = null) => {
    if (server) {
      setEditingServer(server);
      setFormData(server);
    } else {
      setEditingServer(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsedData = {
        ...formData,
        latencyMs: parseInt(formData.latencyMs, 10),
        activeUsers: parseInt(formData.activeUsers, 10),
        maxUsers: parseInt(formData.maxUsers, 10),
      };

      if (editingServer) {
        await updateDocument('servers', editingServer.id, parsedData);
        showToast.success("Server updated successfully!");
      } else {
        await addDocument('servers', parsedData);
        showToast.success("New server added successfully!");
      }
      setShowModal(false);
    } catch (err) {
      showToast.error("Failed to save server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this server?")) {
      try {
        await deleteDocument('servers', id);
        showToast.success("Server deleted.");
      } catch (err) {
        showToast.error("Failed to delete server.");
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateDocument('servers', id, { isOnline: !currentStatus });
    } catch (err) {
      showToast.error("Failed to change status.");
    }
  };

  return (
    <div className="animation-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold mb-1">Server Nodes</h2>
          <p className="text-secondary mb-0">Manage VPN/Proxy infrastructure.</p>
        </div>
        <button className="btn-gradient" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus me-2"></i> Add Server
        </button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5"><div className="spinner"></div></div>
        ) : servers?.length === 0 ? (
          <div className="col-12">
            <GlassCard className="p-5 text-center">
              <p className="text-secondary mb-0">No servers found. Add one to get started.</p>
            </GlassCard>
          </div>
        ) : (
          servers?.map(server => (
            <div className="col-12 col-md-6 col-xl-4" key={server.id}>
              <GlassCard className="p-4 h-100 position-relative">
                <div className="d-flex justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-3">{server.flagEmoji}</span>
                    <div>
                      <h6 className="text-white mb-0">{server.name}</h6>
                      <div className="text-muted small">{server.country} • {server.region}</div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-link text-secondary p-0" data-bs-toggle="dropdown">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-dark border-secondary">
                      <li><button className="dropdown-item" onClick={() => handleOpenModal(server)}>Edit</button></li>
                      <li><button className="dropdown-item" onClick={() => toggleStatus(server.id, server.isOnline)}>{server.isOnline ? 'Take Offline' : 'Bring Online'}</button></li>
                      <li><hr className="dropdown-divider border-secondary" /></li>
                      <li><button className="dropdown-item text-danger" onClick={() => handleDelete(server.id)}>Delete</button></li>
                    </ul>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="badge-protocol" style={{ fontSize: '0.7rem' }}>{server.protocol}</span>
                  {server.isDDoSProtected && <span className="badge-protocol bg-success bg-opacity-25 text-success border-success ms-2" style={{ fontSize: '0.7rem' }}><i className="fa-solid fa-shield-halved me-1"></i> Protected</span>}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="text-secondary small"><i className="fa-solid fa-users me-1"></i> Load</div>
                  <div className={`small fw-bold ${server.activeUsers >= server.maxUsers ? 'text-danger' : 'text-white'}`}>
                    {server.activeUsers} / {server.maxUsers}
                  </div>
                </div>
                <div className="progress-track mb-3" style={{ height: '4px' }}>
                  <div className={`progress-fill ${server.activeUsers >= server.maxUsers ? 'bg-danger' : 'bg-info'}`} style={{ width: `${(server.activeUsers / server.maxUsers) * 100}%` }}></div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary">
                  <div className="text-muted small font-monospace text-truncate" style={{ maxWidth: '150px' }}>{server.address || 'v2ray.shiftlk.net'}</div>
                  <div className="d-flex align-items-center gap-2">
                    {server.isOnline ? (
                      <span className="badge-active bg-success bg-opacity-25 text-success border-success" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>Online</span>
                    ) : (
                      <span className="badge-active bg-danger bg-opacity-25 text-danger border-danger" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>Offline</span>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-transparent border-0">
        <div className="glass-card w-100 p-4">
          <h5 className="text-white mb-4 border-bottom border-secondary pb-2">{editingServer ? 'Edit Server' : 'Add New Server'}</h5>
          
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-8">
                <label className="form-label">Server Name</label>
                <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Singapore Premium" />
              </div>
              <div className="col-4">
                <label className="form-label">Flag Emoji</label>
                <input type="text" className="form-input" required value={formData.flagEmoji} onChange={(e) => setFormData({...formData, flagEmoji: e.target.value})} />
              </div>
              <div className="col-6">
                <label className="form-label">Country</label>
                <input type="text" className="form-input" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="Singapore" />
              </div>
              <div className="col-6">
                <label className="form-label">Region</label>
                <select className="form-select" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                  <option>Asia</option><option>Europe</option><option>America</option><option>Middle East</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Protocol</label>
                <select className="form-select" value={formData.protocol} onChange={(e) => setFormData({...formData, protocol: e.target.value})}>
                  <option>VMess</option><option>VLESS</option><option>Trojan</option><option>Shadowsocks</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Domain / IP</label>
                <input type="text" className="form-input" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="sg1.shiftlk.net" />
              </div>
              <div className="col-4">
                <label className="form-label">Latency (ms)</label>
                <input type="number" className="form-input" required value={formData.latencyMs} onChange={(e) => setFormData({...formData, latencyMs: e.target.value})} />
              </div>
              <div className="col-4">
                <label className="form-label">Current Users</label>
                <input type="number" className="form-input" required value={formData.activeUsers} onChange={(e) => setFormData({...formData, activeUsers: e.target.value})} />
              </div>
              <div className="col-4">
                <label className="form-label">Max Users</label>
                <input type="number" className="form-input" required value={formData.maxUsers} onChange={(e) => setFormData({...formData, maxUsers: e.target.value})} />
              </div>
              
              <div className="col-6">
                <div className="form-check mt-2">
                  <input type="checkbox" className="form-check-input" id="isOnline" checked={formData.isOnline} onChange={(e) => setFormData({...formData, isOnline: e.target.checked})} />
                  <label className="form-check-label text-white" htmlFor="isOnline">Server Online</label>
                </div>
              </div>
              <div className="col-6">
                <div className="form-check mt-2">
                  <input type="checkbox" className="form-check-input" id="isDDoS" checked={formData.isDDoSProtected} onChange={(e) => setFormData({...formData, isDDoSProtected: e.target.checked})} />
                  <label className="form-check-label text-white" htmlFor="isDDoS">DDoS Protected</label>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-secondary">
              <button type="button" className="btn-ghost" onClick={() => setShowModal(false)} disabled={isSaving}>Cancel</button>
              <button type="submit" className="btn-gradient" disabled={isSaving}>
                {isSaving ? <div className="spinner"></div> : 'Save Server'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Servers;
