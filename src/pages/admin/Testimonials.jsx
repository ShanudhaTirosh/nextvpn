import React, { useState } from 'react';
import { useRealtimeCollection } from '../../hooks/useFirestore';
import { addDocument, updateDocument, deleteDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const INITIAL_FORM = {
  name: '',
  text: '',
  role: 'Customer',
  avatar: '',
  isVisible: true
};

const Testimonials = () => {
  const { data: testimonials, loading } = useRealtimeCollection('testimonials');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text) {
      showToast.error('Name and text are required.');
      return;
    }

    try {
      if (isEditing) {
        await updateDocument('testimonials', currentId, formData);
        showToast.success('Testimonial updated!');
      } else {
        await addDocument('testimonials', formData);
        showToast.success('Testimonial added!');
      }
      handleClose();
    } catch (err) {
      showToast.error('Operation failed.');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || '',
      text: item.text || '',
      role: item.role || 'Customer',
      avatar: item.avatar || '',
      isVisible: item.isVisible !== false
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await deleteDocument('testimonials', id);
      showToast.success('Testimonial deleted.');
    } catch {
      showToast.error('Delete failed.');
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setCurrentId(null);
    setShowModal(false);
  };

  const inp = "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-amber-500/50 transition-all";
  const F = ({ label, children }) => (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Testimonials</h1>
          <p className="text-slate-500 text-sm">Manage reviews shown on the homepage.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : testimonials?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <i className="fa-solid fa-quote-left text-3xl text-slate-700 mb-3 block"></i>
            <p className="text-slate-500">No testimonials yet.</p>
          </div>
        ) : (
          testimonials.map(item => (
            <div key={item.id} className={`p-5 rounded-2xl border bg-slate-900/60 transition-all ${item.isVisible ? 'border-slate-800' : 'border-red-500/20 opacity-60'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-bold overflow-hidden">
                    {item.avatar ? <img src={item.avatar} className="w-full h-full object-cover" alt="" /> : (item.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.role}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center text-xs border border-blue-500/20 transition-all"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-xs border border-red-500/20 transition-all"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
              <p className="text-slate-400 text-sm italic mb-4 leading-relaxed">"{item.text}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded ${item.isVisible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  {item.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={handleClose}>
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <button type="button" onClick={handleClose} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <F label="User Name">
                    <input className={inp} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
                  </F>
                  <F label="User Role">
                    <input className={inp} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Graphic Designer" />
                  </F>
                </div>

                <F label="Testimonial Text">
                  <textarea className={`${inp} h-32 resize-none`} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="What did they say about our service?" />
                </F>

                <F label="Avatar URL (Optional)">
                  <input className={inp} value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} placeholder="Image link or leave empty for initials" />
                </F>

                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="isVisible" 
                    checked={formData.isVisible} 
                    onChange={e => setFormData({...formData, isVisible: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20"
                  />
                  <label htmlFor="isVisible" className="text-sm text-slate-300 font-medium cursor-pointer">Visible on Homepage</label>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">
                  {isEditing ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
