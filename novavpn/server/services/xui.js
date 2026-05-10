const axios = require('axios');

const XUI_URL = process.env.XUI_URL;
const XUI_USER = process.env.XUI_USER;
const XUI_PASS = process.env.XUI_PASS;

let sessionCookie = null;
let sessionExpiry = 0;

async function login() {
  try {
    const res = await axios.post(
      `${XUI_URL}/login`,
      { username: XUI_USER, password: XUI_PASS },
      { withCredentials: true }
    );
    const cookies = res.headers['set-cookie'];
    if (cookies && cookies.length) {
      sessionCookie = cookies.map(c => c.split(';')[0]).join('; ');
      sessionExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
      return true;
    }
    throw new Error('No session cookie received from 3x-UI');
  } catch (err) {
    console.error('[3x-UI] Login failed:', err.message);
    throw err;
  }
}

async function ensureSession() {
  if (!sessionCookie || Date.now() > sessionExpiry) {
    await login();
  }
}

async function xuiRequest(method, path, data = null) {
  await ensureSession();
  try {
    const res = await axios({
      method,
      url: `${XUI_URL}${path}`,
      data,
      headers: { Cookie: sessionCookie, 'Content-Type': 'application/json' },
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Re-login and retry once
      sessionCookie = null;
      await login();
      const res = await axios({
        method,
        url: `${XUI_URL}${path}`,
        data,
        headers: { Cookie: sessionCookie, 'Content-Type': 'application/json' },
      });
      return res.data;
    }
    throw err;
  }
}

async function getClientByUUID(uuid) {
  const data = await xuiRequest('GET', '/xui/API/inbounds');
  if (!data || !data.obj) return null;

  for (const inbound of data.obj) {
    try {
      const settings = typeof inbound.settings === 'string'
        ? JSON.parse(inbound.settings)
        : inbound.settings;
      const statsStr = typeof inbound.clientStats === 'string'
        ? JSON.parse(inbound.clientStats)
        : inbound.clientStats;

      const clientStats = Array.isArray(statsStr) ? statsStr : [];
      const clientStat = clientStats.find(c => c.id === uuid);

      if (clientStat) {
        return {
          uuid,
          upload: clientStat.up || 0,
          download: clientStat.down || 0,
          total: clientStat.total || 0,
          remaining: Math.max((clientStat.total || 0) - (clientStat.up || 0) - (clientStat.down || 0), 0),
          expiryTime: clientStat.expiryTime || null,
          enable: clientStat.enable,
        };
      }
    } catch (e) {
      // Skip malformed inbounds
    }
  }
  return null;
}

async function getAllClients() {
  const data = await xuiRequest('GET', '/xui/API/inbounds');
  if (!data || !data.obj) return [];

  const clients = [];
  for (const inbound of data.obj) {
    try {
      const clientStats = typeof inbound.clientStats === 'string'
        ? JSON.parse(inbound.clientStats)
        : (inbound.clientStats || []);

      if (Array.isArray(clientStats)) {
        clientStats.forEach(c => {
          clients.push({
            uuid: c.id,
            email: c.email,
            upload: c.up || 0,
            download: c.down || 0,
            total: c.total || 0,
            remaining: Math.max((c.total || 0) - (c.up || 0) - (c.down || 0), 0),
            expiryTime: c.expiryTime || null,
            enable: c.enable,
            inboundId: inbound.id,
            inboundRemark: inbound.remark,
          });
        });
      }
    } catch (e) {
      // Skip
    }
  }
  return clients;
}

module.exports = { getClientByUUID, getAllClients };
