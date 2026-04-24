import React, { useState } from 'react';
import { useCollection } from '../../hooks/useFirestore';
import { addDocument, updateDocument, deleteDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';
import { logActivity } from '../../hooks/useActivityLog';

const INITIAL = {
  name: '', price: 0, durationDays: 30, icon: 'fa-box',
  order: 0, isRecommended: false, isVisible: true,
  features: [{ text: '1 Device', included: true }],
};

const FeatureRow = ({ feature, index, onChange, onRemove }) => (
  <div className="flex gap-2 items-center">
    <input
      type="text"
      value={feature.text}
      onChange={e => onChange(index, 'text', e.target.value)}
      placeholder="e.g. 3 Devices"
      className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 text-sm"
    />
    <select
      value={feature.included.toString()}
      onChange={e => onChange(index, 'included', e.target.value === 'true')}
      className="px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none text-xs"
    >
      <option value="true">✓ Included</option>
      <option value="false">✗ Excluded</option>
    </select>
    <button type="button" onClick={() => onRemove(index)} className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs">
      <i className="fa-solid fa-trash"></i>
    </button>
  </div>
);

const Packages = () => {
  const { data: packages, loading } = useCollection('packages');
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formData, setFormData] = useState(INITIAL);
  const [isSaving, setIsSaving] = useState(false);

  const openModal = (pkg = null) => {
    setEditingPkg(pkg);
    setFormData(pkg ? { ...pkg } : { ...INITIAL });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingPkg(null); };

  const updateFeature = (index, field, value) => {
    const f = [...formData.features];
    f[index] = { ...f[index], [field]: value };
    setFormData({ ...formData, features: f });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsed = {
        ...formData,
        price: parseInt(formData.price, 10),
        durationDays: parseInt(formData.durationDays, 10),
        order: parseInt(formData.order, 10),
        features: formData.features.filter(f => f.text.trim()),
      };
      if (editingPkg) {
        await updateDocument('packages', editingPkg.id, parsed);
        await logActivity('system', `Package "${parsed.name}" was updated.`, 'info');
        showToast.success('Package updated.');
      } else {
        await addDocument('packages', parsed);
        await logActivity('system', `New package "${parsed.name}" created.`, 'success');
        showToast.success('Package added.');
      }
      closeModal();
    } catch {
      showToast.error('Failed to save package.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete package "${name}"?`)) {
      await deleteDocument('packages', id);
      await logActivity('system', `Package "${name}" was deleted.`, 'danger');
    }
  };

  const sorted = [...(packages || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Pricing Packages</h1>
          <p className="text-slate-500 text-sm">Manage subscription plans displayed on the website.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
          <i className="fa-solid fa-plus"></i> Add Package
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Package</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price (LKR)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Visibility</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sorted.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5 text-slate-600 text-xs">{pkg.order}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <i className={`fa-solid ${pkg.icon} text-cyan-400`}></i>
                        <span className="font-semibold text-white">{pkg.name}</span>
                        {pkg.isRecommended && <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs">Popular</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-cyan-400 font-semibold">{pkg.price.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{pkg.durationDays} days</td>
                    <td className="px-4 py-3.5">
                      {pkg.isVisible
                        ? <span className="text-xs text-emerald-400"><i className="fa-solid fa-eye mr-1"></i>Visible</span>
                        : <span className="text-xs text-slate-600"><i className="fa-solid fa-eye-slash mr-1"></i>Hidden</span>
                      }
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(pkg)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-xs"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => handleDelete(pkg.id, pkg.name)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingPkg ? 'Edit Package' : 'New Package'}</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Package Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm" placeholder="e.g. Starter" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Price (LKR)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Duration (days)</label>
                  <input type="number" required value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Icon (FA class)</label>
                  <input type="text" required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm" placeholder="fa-rocket" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Display Order</label>
                  <input type="number" required value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm" />
                </div>
                <div className="flex flex-col gap-2 justify-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isRecommended} onChange={e => setFormData({...formData, isRecommended: e.target.checked})} className="w-4 h-4 rounded accent-cyan-500" />
                    <span className="text-xs text-amber-400 font-semibold">Mark as Recommended</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isVisible} onChange={e => setFormData({...formData, isVisible: e.target.checked})} className="w-4 h-4 rounded accent-cyan-500" />
                    <span className="text-xs text-emerald-400 font-semibold">Visible on Website</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-400">Features List</label>
                  <button type="button" onClick={() => setFormData({...formData, features: [...formData.features, {text: '', included: true}]})} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                    <i className="fa-solid fa-plus mr-1"></i>Add Feature
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {formData.features.map((f, i) => <FeatureRow key={i} feature={f} index={i} onChange={updateFeature} onRemove={idx => setFormData({...formData, features: formData.features.filter((_, ii) => ii !== idx)})} />)}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50">
                  {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
