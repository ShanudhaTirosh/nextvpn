import { useDocument } from './useFirestore';

export const useSiteSettings = () => {
  const { data, loading, error } = useDocument('siteSettings', 'config');
  
  const settings = {
    siteName: data?.siteName || 'NetchX',
    branding: {
      logoUrl: data?.branding?.logoUrl || '',
      primaryColor: data?.branding?.primaryColor || '#06b6d4',
    },
    socialLinks: data?.socialLinks || {},
    contactEmail: data?.contactEmail || '',
    phone: data?.phone || '',
    address: data?.address || '',
    footerText: data?.footerText || '',
    paymentDetails: data?.paymentDetails || {},
  };

  return { settings, loading, error };
};
