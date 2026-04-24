import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { addDocument } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useDocument } from '../hooks/useFirestore';
import { showToast } from '../components/Toast';

const Contact = () => {
  const { currentUser } = useAuth();
  const { data: config } = useDocument('siteSettings', 'config');
  
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await addDocument('tickets', {
        ...formData,
        uid: currentUser?.uid || 'guest',
        status: 'open',
      });
      showToast.success("Message sent! We'll get back to you shortly.");
      setFormData({ ...formData, message: '', subject: 'General Inquiry' });
    } catch (err) {
      showToast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="section-padding section-bg-primary">
        <div className="container-main pt-5">
          <div className="text-center reveal-on-scroll mb-5">
            <div className="section-eyebrow">Get in Touch</div>
            <h1 className="section-title text-white">We're Here to <span className="gradient-text">Help</span></h1>
            <p className="section-subtitle mt-3">Have a question or need technical support? Drop us a message.</p>
          </div>

          <div className="row g-5">
            {/* Form */}
            <div className="col-12 col-lg-7 reveal-on-scroll">
              <GlassCard className="p-4 p-md-5 h-100">
                <h4 className="text-white mb-4">Send a Message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Your Name</label>
                      <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" disabled={loading} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" disabled={loading} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <select className="form-select" name="subject" value={formData.subject} onChange={handleChange} disabled={loading}>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Billing Question">Billing Question</option>
                        <option value="Partnership">Partnership / Reseller</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea className="form-input" name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" disabled={loading}></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn-gradient w-100 justify-content-center py-3 fs-6" disabled={loading}>
                        {loading ? <div className="spinner"></div> : <><i className="fa-solid fa-paper-plane"></i> Send Message</>}
                      </button>
                    </div>
                  </div>
                </form>
              </GlassCard>
            </div>

            {/* Info */}
            <div className="col-12 col-lg-5 reveal-on-scroll" style={{ '--delay': '0.2s' }}>
              <div className="d-flex flex-column gap-4 h-100">
                <GlassCard className="p-4 d-flex align-items-center gap-4 flex-grow-1 text-decoration-none" as="a" href={`mailto:${config?.contactEmail || 'support@shiftlk.net'}`}>
                  <div className="feature-icon-wrap mb-0 bg-transparent border border-secondary" style={{ width: '56px', height: '56px' }}>
                    <i className="fa-solid fa-envelope fs-3 text-cyan" style={{ color: 'var(--accent-cyan)' }}></i>
                  </div>
                  <div>
                    <div className="text-muted small text-uppercase fw-bold mb-1">Email Us</div>
                    <h5 className="text-white mb-0">{config?.contactEmail || 'support@shiftlk.net'}</h5>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 d-flex align-items-center gap-4 flex-grow-1 text-decoration-none" as="a" href={config?.socialLinks?.telegram || '#'} target="_blank">
                  <div className="feature-icon-wrap mb-0 bg-transparent border border-secondary" style={{ width: '56px', height: '56px' }}>
                    <i className="fa-brands fa-telegram fs-3 text-blue" style={{ color: 'var(--accent-blue)' }}></i>
                  </div>
                  <div>
                    <div className="text-muted small text-uppercase fw-bold mb-1">Telegram</div>
                    <h5 className="text-white mb-0">@ShiftLK_Support</h5>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 d-flex align-items-center gap-4 flex-grow-1">
                  <div className="feature-icon-wrap mb-0 bg-transparent border border-secondary" style={{ width: '56px', height: '56px' }}>
                    <i className="fa-brands fa-whatsapp fs-3 text-success" style={{ color: 'var(--accent-green)' }}></i>
                  </div>
                  <div>
                    <div className="text-muted small text-uppercase fw-bold mb-1">WhatsApp</div>
                    <h5 className="text-white mb-0">{config?.phone || '+94 77 123 4567'}</h5>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
