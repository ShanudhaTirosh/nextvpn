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
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // NEW USER: Create full document
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
        lastLogin: serverTimestamp(),
      });
    } else {
      // EXISTING USER: Only update safe fields to avoid wiping plan/admin status
      await updateDoc(userRef, {
        displayName: user.displayName || userSnap.data().displayName || '',
        email: user.email,
        lastLogin: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("Auth Firestore Error:", err);
    // If it's a permission error or something else, we still want the user to be logged in
    // but we should warn them.
  }
  
  return user;
};

export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Should not happen with Email auth normally as registration creates the doc,
      // but added for robustness (e.g. manual auth creation).
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
        lastLogin: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        email: user.email,
        lastLogin: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("Auth Firestore Error:", err);
  }
  
  return user;
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
    lastLogin: serverTimestamp(),
  });
  return result.user;
};

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const logOut = () => {
  return signOut(auth);
};
