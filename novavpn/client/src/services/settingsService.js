import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function getSiteSettings(section) {
  const snap = await getDoc(doc(db, 'siteSettings', section));
  return snap.exists() ? snap.data() : null;
}

export async function updateSiteSettings(section, data) {
  await setDoc(doc(db, 'siteSettings', section), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
