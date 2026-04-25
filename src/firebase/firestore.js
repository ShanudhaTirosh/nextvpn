import { db } from './firebaseConfig';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc,
  onSnapshot, query, where, orderBy, limit, serverTimestamp, writeBatch
} from 'firebase/firestore';

/* ── Generic Helpers ── */
export const getDocument = async (col, id) => {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getCollection = async (col, constraints = []) => {
  const q = query(collection(db, col), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addDocument = (col, data) => {
  return addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
};

export const updateDocument = (col, id, data) => {
  return updateDoc(doc(db, col, id), data);
};

export const setDocument = (col, id, data) => {
  return setDoc(doc(db, col, id), data, { merge: true });
};

export const deleteDocument = (col, id) => {
  return deleteDoc(doc(db, col, id));
};

export const subscribeToCollection = (col, callback, constraints = []) => {
  const q = query(collection(db, col), ...constraints);
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
};

export const subscribeToDocument = (col, id, callback) => {
  return onSnapshot(doc(db, col, id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
};

/* ── Image Compression ── */
export const compressImageToBase64 = (file, maxSizeKB = 500) => {
  return new Promise((resolve, reject) => {
    if (file.size > maxSizeKB * 1024 * 4) {
      reject(new Error(`File too large. Max ${maxSizeKB}KB after compression.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        const maxDim = 800;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = (h * maxDim) / w; w = maxDim; }
          else { w = (w * maxDim) / h; h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        let quality = 0.75;
        let result = canvas.toDataURL('image/webp', quality);
        while (result.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL('image/webp', quality);
        }
        if (result.length > maxSizeKB * 1024 * 1.37) {
          reject(new Error(`Cannot compress below ${maxSizeKB}KB`));
        } else {
          resolve(result);
        }
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export { serverTimestamp, query, where, orderBy, limit, writeBatch, collection, doc };
