import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addDocument, compressImageToBase64, getCollection } from '../firebase/firestore';
import { where } from 'firebase/firestore';
import { showToast } from './Toast';

const STEPS = ['Method', 'Checkout', 'Done'];

const StepBar = ({ step }) => (
  <div className="flex items-center gap-0 mb-6 px-4">
    {STEPS.map((label, i) => {
      const idx = i + 1;
      const done = step > idx;
      const active = step === idx;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              done ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]' : active ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]' : 'bg-slate-800 border border-slate-700 text-slate-500'
            }`}>
              {done ? <i className="fa-solid fa-check text-[10px]"></i> : idx}
            </div>
            <span className={`text-[10px] mt-1 font-medium ${active ? 'text-cyan-400' : done ? 'text-emerald-400' : 'text-slate-600'}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-1 mb-4 transition-colors ${step > idx ? 'bg-emerald-500' : step > i ? 'bg-cyan-500/50' : 'bg-slate-800'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const PaymentModal = ({ show, onHide, packageData, siteSettings }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('');
  const [reference, setReference] = useState('');
  const [proofBase64, setProofBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { currentUser, userData } = useAuth();

  const generateRef = () => {
    const ts = Date.now().toString(36).toUpperCase();
    const uid = (currentUser?.uid || 'XX').substring(0, 4).toUpperCase();
    return `NX-${uid}-${ts}`;
  };

  const handleReset = () => { setStep(1); setMethod(''); setProofBase64(''); setLoading(false); setReference(''); };
  const handleClose = () => { handleReset(); onHide(); };

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast.error('Please upload an image file.'); return; }
    try {
      const b64 = await compressImageToBase64(file);
      setProofBase64(b64);
      showToast.success('Screenshot attached!');
    } catch (err) { showToast.error(err.message || 'Failed to process image.'); }
  };

  const handleStep2 = async () => {
    setChecking(true);
    try {
      const existing = await getCollection('payments', [
        where('uid', '==', currentUser.uid),
        where('packageId', '==', packageData.id),
      ]);
      const hasPending = existing.some(p => p.status === 'pending' || p.status === 'verifying');
      const hasApproved = existing.some(p => p.status === 'approved');
      if (hasApproved) {
        showToast.error('You already have an active subscription for this package.');
        setChecking(false);
        return;
      }
      if (hasPending) {
        showToast.error('You have a pending payment for this. Please wait for verification.');
        setChecking(false);
        return;
      }
      
      const ref = generateRef();
      setReference(ref);
      
      if (method === 'payhere') {
        // Real PayHere Integration
        if (window.payhere) {
          const payment = {
              "sandbox": true, // Using sandbox for testing
              "merchant_id": "1222719", // Public sandbox merchant ID for testing
              "return_url": window.location.origin + "/portal/dashboard",
              "cancel_url": window.location.origin + "/portal/dashboard",
              "notify_url": window.location.origin + "/api/notify", 
              "order_id": ref,
              "items": packageData.name,
              "amount": packageData.price,
              "currency": "LKR",
              "hash": "", 
              "first_name": userData?.displayName?.split(' ')[0] || "User",
              "last_name": userData?.displayName?.split(' ')[1] || "Name",
              "email": currentUser.email,
              "phone": "0771234567",
              "address": "Colombo",
              "city": "Colombo",
              "country": "Sri Lanka"
          };

          window.payhere.onCompleted = async function onCompleted(orderId) {
              console.log("Payment completed. OrderID:" + orderId);
              setLoading(true);
              try {
                await addDocument('payments', {
                  uid: currentUser.uid,
                  packageId: packageData.id,
                  packageName: packageData.name,
                  amount: packageData.price,
                  method: 'payhere',
                  reference: orderId,
                  status: 'approved', // Auto approve since gateway confirmed
                  autoVerify: true,
                });
                setStep(3);
                showToast.success('Payment successful via PayHere!');
              } catch (err) {
                showToast.error('Failed to record payment in database.');
              } finally {
                setLoading(false);
              }
          };

          window.payhere.onDismissed = function onDismissed() {
              console.log("Payment dismissed");
              showToast.error("Payment was cancelled.");
          };

          window.payhere.onError = function onError(error) {
              console.log("Error:"  + error);
              showToast.error("Payment Error: " + error);
          };

          window.payhere.startPayment(payment);
        } else {
          showToast.error('PayHere SDK not loaded.');
        }
      } else {
        // Manual Bank Transfer flow
        setStep(2);
      }
    } catch (err) {
      showToast.error('Could not verify payment status. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!proofBase64) { showToast.error('Please attach a payment proof screenshot.'); return; }
    setLoading(true);
    try {
      await addDocument('payments', {
        uid: currentUser.uid,
        packageId: packageData.id,
        packageName: packageData.name,
        amount: packageData.price,
        method: 'bank',
        proofBase64,
        reference,
        status: 'pending',
        autoVerify: false,
      });
      setStep(3);
    } catch {
      showToast.error('Failed to submit payment.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'payhere', name: 'PayHere Gateway', desc: 'Pay instantly with HelaPay, eZcash, or Cards', icon: 'fa-bolt', color: 'from-cyan-500 to-blue-500', badge: 'Real API' },
    { id: 'bank', name: 'Bank Transfer', desc: 'Manual transfer with screenshot proof', icon: 'fa-building-columns', color: 'from-slate-600 to-slate-800', badge: 'Manual Review' },
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={handleClose}>
      <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <i className="fa-solid fa-lock text-slate-950 text-xs"></i>
            </div>
            <span className="font-bold text-white text-sm">Secure Checkout</span>
          </div>
          <button onClick={handleClose} disabled={loading} className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <div className="p-5">
          <StepBar step={step} />

          {/* STEP 1 — Method */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-5">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total to pay</p>
                <div className="text-4xl font-black text-white">LKR {packageData?.price?.toLocaleString()}</div>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">{packageData?.name} Package</span>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                {paymentMethods.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${method === m.id ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0`}>
                      <i className={`fa-solid ${m.icon} text-white text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{m.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${method === m.id ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                      {method === m.id && <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>}
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={handleStep2} disabled={!method || checking} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                {checking ? <><i className="fa-solid fa-spinner animate-spin"></i> Initializing...</> : method === 'payhere' ? <>Pay via PayHere <i className="fa-solid fa-bolt"></i></> : <>Continue <i className="fa-solid fa-arrow-right"></i></>}
              </button>
            </div>
          )}

          {/* STEP 2 — Manual Bank Upload (Skipped if PayHere) */}
          {step === 2 && method === 'bank' && (
            <div className="animate-fade-in">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 mb-4 space-y-2.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Bank Transfer Details</p>
                <div className="flex justify-between"><span className="text-sm text-slate-400">Bank</span><span className="text-white text-sm">{siteSettings?.paymentDetails?.bankAccount?.bank || 'Commercial Bank'}</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-400">Name</span><span className="text-white text-sm">{siteSettings?.paymentDetails?.bankAccount?.name || 'ShiftLK Solutions'}</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-400">Account No.</span><span className="text-white font-bold">{siteSettings?.paymentDetails?.bankAccount?.number || '1234567890'}</span></div>
                <div className="pt-2 border-t border-slate-800 text-center">
                  <p className="text-xs text-slate-500 mb-1">Include reference in remarks:</p>
                  <span className="font-mono text-amber-400 font-bold text-sm">{reference}</span>
                </div>
              </div>

              {proofBase64 ? (
                <div className="relative mb-4">
                  <img src={proofBase64} alt="Proof" className="w-full rounded-xl border border-slate-700 max-h-48 object-cover" />
                  <button onClick={() => setProofBase64('')} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-950/90 border border-slate-700 text-red-400 hover:text-red-300 flex items-center justify-center text-xs transition-colors"><i className="fa-solid fa-xmark"></i></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 p-8 mb-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-900/40 cursor-pointer transition-all group">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 group-hover:bg-cyan-500/10 flex items-center justify-center transition-all"><i className="fa-solid fa-cloud-arrow-up text-slate-500 group-hover:text-cyan-400 text-lg transition-colors"></i></div>
                  <div className="text-center"><p className="text-white font-semibold text-sm">Upload receipt</p><p className="text-[10px] text-slate-500">JPG, PNG · Max 500KB</p></div>
                  <input type="file" className="hidden" accept="image/*" onChange={e => handleFileSelect(e.target.files[0])} />
                </label>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm font-semibold transition-all disabled:opacity-50">Back</button>
                <button onClick={handleManualSubmit} disabled={!proofBase64 || loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-40">
                  {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Submit Proof'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <div className="text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <i className="fa-solid fa-circle-check text-emerald-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Payment Successful!</h3>
              {method === 'payhere' ? (
                <p className="text-sm text-slate-400 mb-1">Your payment was securely processed via PayHere. Your plan is <span className="text-cyan-400 font-semibold">now active</span>.</p>
              ) : (
                <p className="text-sm text-slate-400 mb-1">Our admin will verify your bank transfer and activate your plan within <span className="text-white font-semibold">2–24 hours</span>.</p>
              )}
              <p className="text-xs text-slate-600 mb-5">Reference: <span className="font-mono text-amber-400">{reference}</span></p>
              <button onClick={handleClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
