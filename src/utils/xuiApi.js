import { auth } from '../firebase/firebaseConfig';
import { getDocument } from '../firebase/firestore';
import { showToast } from '../components/Toast';

const callXuiApi = async (action, payload = {}) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required.');

    // Fetch VPS Proxy URL and Credentials from privateSettings
    const config = await getDocument('privateSettings', 'xuiConfig');
    if (!config || !config.enabled) {
      throw new Error('X-UI Automation is disabled.');
    }
    
    // The proxyUrl in Settings is the VPS Proxy URL (e.g. http://1.2.3.4:3001/api/xui)
    const proxyUrl = config.proxyUrl;
    if (!proxyUrl) {
      throw new Error('VPS Proxy URL is not configured.');
    }

    const token = await user.getIdToken();

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Bypass-Tunnel-Reminder': 'true'
      },
      body: JSON.stringify({ action, payload })
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data?.error || 'VPS Proxy Request Failed');
    }

    return data;
  } catch (error) {
    console.error('X-UI API Error:', error);
    showToast.error(error.message || 'Failed to communicate with VPS Proxy.');
    throw error;
  }
};

export const xuiGetMyStats = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required.');

    // We can't read privateSettings as a user, so we'll try to get the proxyUrl 
    // from siteSettings/config which is public
    const config = await getDocument('siteSettings', 'config');
    const proxyUrl = config?.xuiProxyUrl;
    
    if (!proxyUrl) {
      throw new Error('VPS Proxy URL is not configured in public settings.');
    }

    const token = await user.getIdToken();

    const response = await fetch(`${proxyUrl}/api/my-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Bypass-Tunnel-Reminder': 'true'
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch usage');

    return { success: true, ...data };
  } catch (error) {
    console.error('X-UI User Stats Error:', error);
    throw error;
  }
};

export const xuiGetInbounds = () => callXuiApi('getInbounds');

export const xuiAddClient = async (inboundId, email, limitIp = 0, expiryTime = 0, totalGB = 0, enable = true) => {
  const uuid = crypto.randomUUID();
  const subId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  const clients = [{
    id: uuid,
    email: email,
    limitIp: parseInt(limitIp) || 0,
    totalGB: parseInt(totalGB) * 1073741824 || 0, // Convert GB to Bytes
    expiryTime: parseInt(expiryTime) || 0, // Unix timestamp in ms
    enable: enable,
    tgId: "",
    subId: subId
  }];
  
  const result = await callXuiApi('addClient', { inboundId, clients });
  return { ...result, uuid, subId };
};

export const xuiUpdateClient = (inboundId, clientUuid, email, limitIp, expiryTime, totalGB, enable) => {
  const settings = {
    id: clientUuid,
    email: email,
    limitIp: parseInt(limitIp) || 0,
    totalGB: parseInt(totalGB) * 1073741824 || 0,
    expiryTime: parseInt(expiryTime) || 0,
    enable: enable,
    tgId: "",
    subId: "" 
  };
  
  return callXuiApi('updateClient', { clientUuid, inboundId, settings });
};

export const xuiDeleteClient = (inboundId, clientUuid) => {
  return callXuiApi('deleteClient', { inboundId, clientUuid });
};

export const xuiResetTraffic = (inboundId, email) => {
  return callXuiApi('resetClientTraffic', { inboundId, email });
};
