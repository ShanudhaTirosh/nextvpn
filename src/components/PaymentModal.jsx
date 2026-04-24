import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { addDocument, compressImageToBase64 } from '../firebase/firestore';
import { showToast } from './Toast';

const PaymentModal = ({ show, onHide, packageData, siteSettings }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('');
  const [proofBase64, setProofBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleReset = () => {
    setStep(1);
    setMethod('');
    setProofBase64('');
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onHide();
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast.error("Please upload an image file (JPG, PNG).");
      return;
    }

    try {
      const base64 = await compressImageToBase64(file);
      setProofBase64(base64);
      showToast.success("Image attached successfully.");
    } catch (err) {
      showToast.error(err.message || "Failed to process image.");
    }
  };

  const handleSubmit = async () => {
    if (!proofBase64) {
      showToast.error("Please attach a payment proof screenshot.");
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        uid: currentUser.uid,
        packageId: packageData.id,
        packageName: packageData.name,
        amount: packageData.price,
        method: method,
        proofBase64: proofBase64,
        reference: `${currentUser.uid.substring(0, 5)}_${packageData.id}`,
        status: 'pending',
      };
      
      await addDocument('payments', paymentData);
      setStep(4);
    } catch (err) {
      showToast.error("Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'helapay', name: 'HelaPay / Helakuru', icon: 'fa-mobile-screen', color: 'var(--accent-cyan)' },
    { id: 'ezcash', name: 'eZcash Transfer', icon: 'fa-wallet', color: 'var(--accent-blue)' },
    { id: 'bank', name: 'Bank Transfer', icon: 'fa-building-columns', color: 'var(--accent-purple)' }
  ];

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="bg-transparent border-0">
      <div className="glass-card w-100 overflow-hidden" style={{ borderRadius: '16px', boxShadow: '0 0 50px rgba(0,0,0,0.8)' }}>
        <div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center bg-secondary bg-opacity-25">
          <h5 className="mb-0 text-white fw-bold">Secure Payment</h5>
          <button onClick={handleClose} className="btn-close btn-close-white" disabled={loading}></button>
        </div>

        <div className="p-4 bg-primary bg-opacity-75">
          {/* Step Indicator */}
          <div className="payment-step-indicator">
            <div className={`payment-step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>1</div>
            <div className={`payment-step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`payment-step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>2</div>
            <div className={`payment-step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`payment-step-dot ${step >= 3 ? 'active' : ''} ${step > 3 ? 'done' : ''}`}>3</div>
            <div className={`payment-step-line ${step >= 4 ? 'active' : ''}`}></div>
            <div className={`payment-step-dot ${step >= 4 ? 'active' : ''}`}>4</div>
          </div>

          {/* STEP 1: Method Selection */}
          {step === 1 && (
            <div className="animation-slide-up">
              <h6 className="text-white mb-3 text-center">Select Payment Method</h6>
              <div className="d-flex flex-column gap-3 mb-4">
                {paymentMethods.map(m => (
                  <div 
                    key={m.id}
                    className={`payment-method-card glass-card ${method === m.id ? 'selected' : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <i className={`fa-solid ${m.icon} fs-3 mb-2`} style={{ color: m.color }}></i>
                    <div className="text-white fw-bold">{m.name}</div>
                  </div>
                ))}
              </div>
              <button 
                className="btn-gradient w-100" 
                disabled={!method} 
                onClick={() => setStep(2)}
              >
                Continue <i className="fa-solid fa-arrow-right ms-2"></i>
              </button>
            </div>
          )}

          {/* STEP 2: Payment Details */}
          {step === 2 && (
            <div className="animation-slide-up">
              <div className="text-center mb-4">
                <div className="text-muted small text-uppercase mb-1">Total to Pay</div>
                <div className="fs-1 fw-bold text-white mb-0">LKR {packageData?.price}</div>
                <div className="badge-cyan mt-2">{packageData?.name} Package</div>
              </div>

              <div className="glass-card bg-secondary bg-opacity-50 p-3 mb-4 border-secondary">
                <h6 className="text-white mb-3 border-bottom border-secondary pb-2">Transfer Details</h6>
                
                {method === 'helapay' && (
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary">HelaPay Number:</span>
                    <span className="text-white fw-bold fs-5">{siteSettings?.paymentDetails?.helaPay || '077xxxxxxx'}</span>
                  </div>
                )}
                
                {method === 'ezcash' && (
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary">eZcash Number:</span>
                    <span className="text-white fw-bold fs-5">{siteSettings?.paymentDetails?.eZcash || '077xxxxxxx'}</span>
                  </div>
                )}
                
                {method === 'bank' && (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Bank:</span>
                      <span className="text-white">{siteSettings?.paymentDetails?.bankAccount?.bank || 'Commercial Bank'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Name:</span>
                      <span className="text-white">{siteSettings?.paymentDetails?.bankAccount?.name || 'ShiftLK Solutions'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Account No:</span>
                      <span className="text-white fw-bold">{siteSettings?.paymentDetails?.bankAccount?.number || '1234567890'}</span>
                    </div>
                  </>
                )}

                <div className="mt-3 pt-3 border-top border-secondary text-center">
                  <div className="text-muted small">Reference Code (Include in remarks):</div>
                  <div className="text-warning fw-bold mt-1 font-monospace">{currentUser?.uid?.substring(0, 5)}_{packageData?.id}</div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn-ghost flex-grow-1" onClick={() => setStep(1)}>Back</button>
                <button className="btn-gradient flex-grow-1" onClick={() => setStep(3)}>I've Sent Payment</button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Proof */}
          {step === 3 && (
            <div className="animation-slide-up">
              <h6 className="text-white mb-1 text-center">Upload Payment Proof</h6>
              <p className="text-muted text-center small mb-4">Attach a clear screenshot of the successful transfer.</p>

              {proofBase64 ? (
                <div className="position-relative mb-4 text-center">
                  <img src={proofBase64} alt="Proof" className="img-fluid rounded border border-secondary" style={{ maxHeight: '200px' }} />
                  <button 
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                    onClick={() => setProofBase64('')}
                    style={{ width: '30px', height: '30px', padding: 0 }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <div 
                  className="upload-zone mb-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById('proofInput').click()}
                >
                  <i className="fa-solid fa-cloud-arrow-up fs-1 mb-3 text-cyan" style={{ color: 'var(--accent-cyan)' }}></i>
                  <div className="text-white fw-bold mb-1">Click or drag image here</div>
                  <div className="text-muted small">Max 500KB (auto-compressed)</div>
                  <input 
                    type="file" 
                    id="proofInput" 
                    className="d-none" 
                    accept="image/*" 
                    onChange={handleFileDrop} 
                  />
                </div>
              )}

              <div className="d-flex gap-2">
                <button className="btn-ghost flex-grow-1" onClick={() => setStep(2)} disabled={loading}>Back</button>
                <button className="btn-gradient flex-grow-1" onClick={handleSubmit} disabled={!proofBase64 || loading}>
                  {loading ? <div className="spinner"></div> : 'Submit Payment'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <div className="text-center py-4 animation-slide-up">
              <i className="fa-solid fa-circle-check confirmation-icon mb-4"></i>
              <h4 className="text-white fw-bold mb-2">Payment Submitted!</h4>
              <p className="text-secondary mb-4">
                Thank you. Your payment proof has been received. Our admin will verify it and activate your package within 2-24 hours.
              </p>
              <button className="btn-gradient px-4" onClick={handleClose}>
                Go to Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
