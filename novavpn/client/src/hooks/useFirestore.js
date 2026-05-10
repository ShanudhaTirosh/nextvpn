// useFirestore.js — generic Firestore collection + doc listeners
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestoreCollection(collectionPath, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = collection(db, collectionPath);
    const q = queryConstraints.length > 0 ? query(ref, ...queryConstraints) : ref;

    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(`[useFirestoreCollection] ${collectionPath}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, [collectionPath]);

  return { data, loading, error };
}

export function useFirestoreDoc(collectionPath, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) { setLoading(false); return; }

    const docRef = doc(db, collectionPath, docId);
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      },
      (err) => {
        console.error(`[useFirestoreDoc] ${collectionPath}/${docId}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, [collectionPath, docId]);

  return { data, loading, error };
}
