import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import GlassCard from '../../components/GlassCard';
import { useCollection } from '../../hooks/useFirestore';
import { addDocument, updateDocument, deleteDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const Packages = () => {
  const { data: packages, loading } = useCollection('packages');
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    name: '',
    price: 0,
    durationDays: 30,
    icon: 'fa-box',
    order: 0,
    isRecommended: false,
    isVisible: true,
    features: [{ text: '1 Device', included: true }]
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPkg(pkg);
      setFormData(pkg);
    } else {
      setEditingPkg(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, { text: '', included: true }] });
  };

  const handleUpdateFeature = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsedData = {
        ...formData,
        price: parseInt(formData.price, 10),
        durationDays: parseInt(formData.durationDays, 10),
        order: parseInt(formData.order, 10),
        features: formData.features.filter(f => f.text.trim() !== '') // Remove empty features
      };

      if (editingPkg) {
        await updateDocument('packages', editingPkg.id, parsedData);
        showToast.success("Package updated.");
      } else {
        await addDocument('packages', parsedData);
        showToast.success("Package added.");
      }
      setShowModal(false);
    } catch (err) {
      showToast.error("Failed to save package.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this pricing plan?")) {
      await deleteDocument('packages', id);
    }
  };

  return (
    <div className="animation-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold mb-1">Pricing Packages</h2>
          <p className="text-secondary mb-0">Manage subscription plans.</p>
        </div>
        <button className="btn-gradient" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus me-2"></i> Add Package
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5"><div className="spinner"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table mb-0">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Package Name</th>
                  <th>Price (LKR)</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages?.sort((a,b) => a.order - b.order).map(pkg => (
                  <tr key={pkg.id}>
                    <td className="text-muted">{pkg.order}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-white fw-bold">
                        <i className={`fa-solid ${pkg.icon} text-cyan`}></i> {pkg.name}
                        {pkg.isRecommended && <span className="badge-active bg-warning bg-opacity-25 text-warning border-warning ms-2" style={{ padding: '2px 6px', fontSize: '0.6rem' }}>Popular</span>}
                      </div>
                    </td>
                    <td>{pkg.price}</td>
                    <td>{pkg.durationDays} Days</td>
                    <td>
                      {pkg.isVisible ? (
                        <span className="text-success small"><i className="fa-solid fa-eye me-1"></i> Visible</span>
                      ) : (
                        <span className="text-muted small"><i className="fa-solid fa-eye-slash me-1"></i> Hidden</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-info me-2" onClick={() => handleOpenModal(pkg)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pkg.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" contentClassName="bg-transparent border-0">
        <div className="glass-card w-100 p-4">
          <h5 className="text-white mb-4 border-bottom border-secondary pb-2">{editingPkg ? 'Edit Package' : 'New Package'}</h5>
          
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Package Name</label>
                <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Starter" />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label">Price (LKR)</label>
                <input type="number" className="form-input" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label">Duration (Days)</label>
                <input type="number" className="form-input" required value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: e.target.value})} />
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label">FontAwesome Icon</label>
                <input type="text" className="form-input" required value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="fa-rocket" />
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label">Display Order</label>
                <input type="number" className="form-input" required value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
              </div>
              
              <div className="col-12 col-md-4 d-flex flex-column justify-content-center pt-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isRec" checked={formData.isRecommended} onChange={(e) => setFormData({...formData, isRecommended: e.target.checked})} />
                  <label className="form-check-label text-warning small" htmlFor="isRec">Mark as Recommended</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isVis" checked={formData.isVisible} onChange={(e) => setFormData({...formData, isVisible: e.target.checked})} />
                  <label className="form-check-label text-success small" htmlFor="isVis">Visible on Website</label>
                </div>
              </div>

              <div className="col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">Features List</label>
                  <button type="button" className="btn btn-sm btn-ghost py-1" onClick={handleAddFeature}>+ Add Feature</button>
                </div>
                
                {formData.features.map((feature, index) => (
                  <div className="d-flex gap-2 mb-2" key={index}>
                    <input 
                      type="text" 
                      className="form-input flex-grow-1" 
                      value={feature.text} 
                      onChange={(e) => handleUpdateFeature(index, 'text', e.target.value)} 
                      placeholder="e.g. 3 Devices" 
                    />
                    <select 
                      className="form-select w-auto" 
                      value={feature.included.toString()} 
                      onChange={(e) => handleUpdateFeature(index, 'included', e.target.value === 'true')}
                    >
                      <option value="true">Included (Tick)</option>
                      <option value="false">Excluded (Cross)</option>
                    </select>
                    <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveFeature(index)}><i className="fa-solid fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-secondary">
              <button type="button" className="btn-ghost" onClick={() => setShowModal(false)} disabled={isSaving}>Cancel</button>
              <button type="submit" className="btn-gradient" disabled={isSaving}>
                {isSaving ? <div className="spinner"></div> : 'Save Package'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Packages;
