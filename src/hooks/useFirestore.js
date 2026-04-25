import { useState, useEffect } from 'react';
import { subscribeToCollection, subscribeToDocument, getCollection, getDocument } from '../firebase/firestore';

export const useCollection = (collectionName, constraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const constraintsString = JSON.stringify(constraints);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const parsedConstraints = JSON.parse(constraintsString);
        const result = await getCollection(collectionName, parsedConstraints);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [collectionName, constraintsString]);

  return { data, loading, error };
};

export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getDocument(collectionName, docId);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [collectionName, docId]);

  return { data, loading, error };
};

export const useRealtimeCollection = (collectionName, constraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const constraintsString = JSON.stringify(constraints);

  useEffect(() => {
    let unsubscribe;
    setLoading(true);
    const parsedConstraints = JSON.parse(constraintsString);
    
    // Defer subscription to avoid React Strict Mode synchronous mount/unmount crashes (Firestore bug ca9)
    const timeoutId = setTimeout(() => {
      unsubscribe = subscribeToCollection(
        collectionName,
        (fetchedData) => {
          setData(fetchedData);
          setLoading(false);
        },
        parsedConstraints
      );
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName, constraintsString]);

  return { data, loading };
};

export const useRealtimeDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    if (!docId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const timeoutId = setTimeout(() => {
      unsubscribe = subscribeToDocument(collectionName, docId, (fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      });
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName, docId]);

  return { data, loading };
};
