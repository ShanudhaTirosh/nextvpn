import { useAuth } from './useAuth';

export const useAdmin = () => {
  const { userData, loading } = useAuth();
  
  return {
    isAdmin: userData?.isAdmin === true,
    loading
  };
};
