/**
 * X-UI Usage Service
 * Fetches and parses usage data from X-UI subscription URLs.
 */

export const fetchUsageData = async (subUrl) => {
  try {
    // Try direct fetch first (will work if CORS is enabled on the server)
    // We use HEAD request to just get headers, or GET if HEAD is not supported.
    let response;
    try {
      response = await fetch(subUrl, { method: 'GET' });
      // If it fails due to CORS, it will throw and go to catch
    } catch (e) {
      // Fallback to a reliable CORS proxy that forwards headers
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(subUrl)}`;
      response = await fetch(proxyUrl, { method: 'GET' });
    }

    const userInfo = response.headers.get('subscription-userinfo') || response.headers.get('Subscription-Userinfo');
    
    if (!userInfo) {
      return null;
    }

    // Parse: upload=123; download=456; total=789; expire=1620000000
    const parts = userInfo.split(';').reduce((acc, part) => {
      const [key, val] = part.trim().split('=');
      if (key && val) acc[key.toLowerCase()] = parseInt(val);
      return acc;
    }, {});

    return {
      upload: parts.upload || 0,
      download: parts.download || 0,
      total: parts.total || 0,
      expire: parts.expire || null, // Unix timestamp (seconds)
      used: (parts.upload || 0) + (parts.download || 0)
    };
  } catch (err) {
    console.error("Failed to fetch X-UI usage:", err);
    return null;
  }
};

/**
 * Helper to format bytes to human readable format
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (bytes === -1 || !bytes) return 'Unlimited';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
