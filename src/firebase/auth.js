import { auth } from './firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName || '',
    email: user.email,
    photoBase64: '',
    plan: 'none',
    isAdmin: false,
    isActive: false,
    subscriptionExpiry: null,
    paymentStatus: 'none',
    createdAt: serverTimestamp(),
  }, { merge: true });
  return user;
};

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  const userRef = doc(db, 'users', result.user.uid);
  await setDoc(userRef, {
    uid: result.user.uid,
    displayName,
    email,
    photoBase64: '',
    plan: 'none',
    isAdmin: false,
    isActive: false,
    subscriptionExpiry: null,
    paymentStatus: 'none',
    createdAt: serverTimestamp(),
  });
  return result.user;
};

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const logOut = () => {
  return signOut(auth);
};
