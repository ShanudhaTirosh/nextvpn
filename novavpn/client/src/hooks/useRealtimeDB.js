import { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { rtdb } from '../firebase';

/**
 * Listen to a Realtime Database path and return its value as an array.
 * @param {string} path - e.g. "chats/uid123/messages"
 * @param {number} limit - optional limitToLast
 */
export function useRealtimeDB(path, limit = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) { setLoading(false); return; }

    let dbRef = ref(rtdb, path);
    if (limit) {
      dbRef = query(dbRef, orderByChild('timestamp'), limitToLast(limit));
    }

    const unsub = onValue(dbRef, (snap) => {
      const items = [];
      snap.forEach((child) => {
        items.push({ id: child.key, ...child.val() });
      });
      setData(items);
      setLoading(false);
    });

    return unsub;
  }, [path, limit]);

  return { data, loading };
}
