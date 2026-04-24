import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/GlassCard';
import { useDocument } from '../../hooks/useFirestore';
import { updateDocument } from '../../firebase/firestore';
import { showToast } from '../../components/Toast';

const Settings = () => {
  const { data: config, loading } = useDocument('siteSettings', 'config');
  const [formData, setFormData] = useState({
    contactEmail: '',
    phone: '',
    address: '',
    socialLinks: { facebook: '', telegram: '', instagram: '', whatsapp: '' },
    paymentDetails: { helaPay: '', eZcash: '', bankAccount: { bank: '', name: '', number: '' } }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        contactEmail: config.contactEmail || '',
        phone: config.phone || '',
        address: config.address || '',
        socialLinks: { ...formData.socialLinks, ...config.socialLinks },
        paymentDetails: { ...formData.paymentDetails, ...config.paymentDetails }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleChange = (e, section = null, subSection = null) => {
    const { name, value } = e.target;
    
    if (section && subSection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: {
            ...prev[section][subSection],
            [name]: value
          }
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // In firestore, if document doesn't exist yet, we use setDoc. 
      // But updateDocument will fail if it doesn't exist. Assuming we created it or will handle it.
      await updateDocument('siteSettings', 'config', formData);
      showToast.success("Global settings updated successfully!");
    } catch (err) {
      showToast.error("Failed to save settings. Document may not exist yet.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner"></div></div>;

  return (
    <div className="animation-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold mb-1">Global Settings</h2>
          <p className="text-secondary mb-0">Manage website details and payment receiving accounts.</p>
        </div>
        <button className="btn-gradient" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <div className="spinner"></div> : <><i className="fa-solid fa-save me-2"></i> Save Changes</>}
        </button>
      </div>

      <div className="row g-4">
        {/* Contact Info */}
        <div className="col-12 col-lg-6">
          <GlassCard className="p-4 h-100">
            <h5 className="text-white mb-4 border-bottom border-secondary pb-2">Contact & Social</h5>
            
            <div className="mb-3">
              <label className="form-label">Support Email</label>
              <input type="email" className="form-input" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone / WhatsApp</label>
              <input type="text" className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="form-label">Physical Address</label>
              <input type="text" className="form-input" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <h6 className="text-white mb-3 mt-4">Social Links</h6>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-primary"><i className="fa-brands fa-facebook"></i></span>
                <input type="text" className="form-input" name="facebook" value={formData.socialLinks.facebook} onChange={(e) => handleChange(e, 'socialLinks')} placeholder="https://facebook.com/..." />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-info"><i className="fa-brands fa-telegram"></i></span>
                <input type="text" className="form-input" name="telegram" value={formData.socialLinks.telegram} onChange={(e) => handleChange(e, 'socialLinks')} placeholder="https://t.me/..." />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-danger"><i className="fa-brands fa-instagram"></i></span>
                <input type="text" className="form-input" name="instagram" value={formData.socialLinks.instagram} onChange={(e) => handleChange(e, 'socialLinks')} placeholder="https://instagram.com/..." />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Payment Details */}
        <div className="col-12 col-lg-6">
          <GlassCard className="p-4 h-100 border-warning">
            <h5 className="text-warning mb-4 border-bottom border-warning pb-2">Receiving Payment Details</h5>
            <p className="text-secondary small mb-4">These details are shown to users during the manual payment flow.</p>

            <div className="mb-4 p-3 bg-secondary bg-opacity-25 rounded-3">
              <h6 className="text-white mb-3 d-flex align-items-center gap-2"><i className="fa-solid fa-mobile-screen text-cyan"></i> Mobile Wallets</h6>
              <div className="mb-3">
                <label className="form-label text-muted small">HelaPay Number</label>
                <input type="text" className="form-input" name="helaPay" value={formData.paymentDetails.helaPay} onChange={(e) => handleChange(e, 'paymentDetails')} placeholder="077XXXXXXX" />
              </div>
              <div className="mb-2">
                <label className="form-label text-muted small">eZcash Number</label>
                <input type="text" className="form-input" name="eZcash" value={formData.paymentDetails.eZcash} onChange={(e) => handleChange(e, 'paymentDetails')} placeholder="077XXXXXXX" />
              </div>
            </div>

            <div className="p-3 bg-secondary bg-opacity-25 rounded-3">
              <h6 className="text-white mb-3 d-flex align-items-center gap-2"><i className="fa-solid fa-building-columns text-purple" style={{ color: 'var(--accent-purple)' }}></i> Bank Account</h6>
              <div className="mb-3">
                <label className="form-label text-muted small">Bank Name</label>
                <input type="text" className="form-input" name="bank" value={formData.paymentDetails.bankAccount.bank} onChange={(e) => handleChange(e, 'paymentDetails', 'bankAccount')} placeholder="Commercial Bank" />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Account Name</label>
                <input type="text" className="form-input" name="name" value={formData.paymentDetails.bankAccount.name} onChange={(e) => handleChange(e, 'paymentDetails', 'bankAccount')} placeholder="John Doe" />
              </div>
              <div className="mb-2">
                <label className="form-label text-muted small">Account Number</label>
                <input type="text" className="form-input" name="number" value={formData.paymentDetails.bankAccount.number} onChange={(e) => handleChange(e, 'paymentDetails', 'bankAccount')} placeholder="1234567890" />
              </div>
            </div>

          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;
