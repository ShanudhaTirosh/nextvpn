import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchClientUsage } from '../services/panelService';

/**
 * Fetch 3x-UI traffic stats for the currently logged-in user.
 * Automatically uses the user's UUID from their Firestore profile.
 */
export function usePanelData() {
  const { userProfile } = useAuth();
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!userProfile?.uuid) {
      setUsage(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClientUsage(userProfile.uuid);
      setUsage(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [userProfile?.uuid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { usage, loading, error, refresh };
}
