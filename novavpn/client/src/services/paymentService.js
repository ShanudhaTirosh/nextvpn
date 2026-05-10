import {
  collection, addDoc, doc, onSnapshot,
  serverTimestamp, query, where, orderBy, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function submitPayment({ uid, userEmail, planId, planName, method, proofBase64 }) {
  const ref = await addDoc(collection(db, 'payments'), {
    uid,
    userEmail,
    planId,
    planName,
    method,
    proofBase64,
    status: 'pending',
    adminNote: '',
    createdAt: serverTimestamp(),
    reviewedAt: null,
  });
  return ref.id;
}

export function listenPaymentStatus(paymentId, callback) {
  return onSnapshot(doc(db, 'payments', paymentId), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

export async function getUserPayments(uid) {
  const q = query(
    collection(db, 'payments'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllPayments() {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function listenAllPayments(callback) {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}
