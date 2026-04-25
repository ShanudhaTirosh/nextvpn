import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      setCurrentUser(user);

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        unsubscribeDoc = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            
            // Automatic Expiry Check
            if (data.isActive && data.subscriptionExpiry) {
              const expiryDate = data.subscriptionExpiry.toDate();
              if (expiryDate < new Date()) {
                // Plan has expired!
                data.isActive = false;
                // Note: We don't update DB here to avoid loops, 
                // but the local state will show it as inactive immediately.
                // The admin or a background function should clean up the DB.
              }
            }
            
            setUserData(data);
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user data:", error);
          setUserData(null);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
