import { useDocument } from './useFirestore';

export const useSiteSettings = () => {
  const { data, loading, error } = useDocument('siteSettings', 'config');
  
  const settings = {
    siteName: data?.siteName || 'ShiftLK',
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
    notifications: data?.notifications || {},
    xuiBaseUrl: data?.xuiBaseUrl || '',
  };

  return { settings, loading, error };
};
