import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Redirect non-admins away from admin pages.
 * Use in any admin component as a secondary guard.
 */
export function useAdminGuard() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [role, loading, navigate]);

  return { isAdmin: role === 'admin', loading };
}
