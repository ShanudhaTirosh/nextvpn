const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
const https = require('https');
const fs = require('fs');

// 1. Initialize Firebase Admin
// You MUST place your serviceAccountKey.json file in this folder!
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin Initialized successfully.");
} catch (e) {
  console.error("ERROR: Failed to initialize Firebase Admin.");
  console.error("Please ensure you have placed serviceAccountKey.json in the vps-backend folder.");
  process.exit(1);
}

const db = admin.firestore();
const app = express();
app.use(cors({ origin: true })); // Allow requests from your React website
app.use(express.json());

// Middleware to verify Firebase Auth Token and Admin Status
const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Verify user is an admin in Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data().isAdmin !== true) {
      return res.status(403).json({ error: 'Forbidden: You must be an administrator.' });
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// Main X-UI API Route
app.post('/api/xui', verifyAdmin, async (req, res) => {
  const { action, payload } = req.body;
  if (!action) return res.status(400).json({ error: 'Action is required' });

  try {
    // Read X-UI credentials securely from Firestore
    const configDoc = await db.collection('privateSettings').doc('xuiConfig').get();
    if (!configDoc.exists) return res.status(400).json({ error: 'X-UI config missing in privateSettings' });

    const { apiUrl, username, password, enabled } = configDoc.data();
    if (!enabled) return res.status(400).json({ error: 'X-UI Automation is disabled.' });
    if (!apiUrl || !username || !password) return res.status(400).json({ error: 'Incomplete X-UI credentials.' });

    // Since this runs ON the VPS, we could optionally override the apiUrl to http://127.0.0.1:2096 
    // to bypass external networking, but we'll use the one from Firestore just in case they host it elsewhere.
    const cleanUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // 1. Login to X-UI
    const loginRes = await axios.post(`${cleanUrl}/login`, { username, password });
    if (!loginRes.data.success) throw new Error(`X-UI Login failed: ${loginRes.data.msg}`);
    
    const cookieHeader = loginRes.headers['set-cookie'];
    if (!cookieHeader) throw new Error("No session cookie returned.");
    const sessionCookie = cookieHeader.find(c => c.startsWith('session=')).split(';')[0];

    const client = axios.create({
      baseURL: cleanUrl,
      headers: { 'Cookie': sessionCookie },
      // Important: Since X-UI is local, we allow self-signed certificates locally just in case
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    // 2. Execute Action
    let result;
    switch (action) {
      case 'getInbounds':
        result = await client.get('/panel/api/inbounds/list');
        break;
      case 'addClient':
        result = await client.post('/panel/api/inbounds/addClient', {
          id: payload.inboundId,
          settings: JSON.stringify({ clients: payload.clients })
        });
        break;
      case 'updateClient':
        result = await client.post(`/panel/api/inbounds/updateClient/${payload.clientUuid}`, {
          id: payload.inboundId,
          settings: JSON.stringify({ clients: [payload.settings] })
        });
        break;
      case 'deleteClient':
        result = await client.post(`/panel/api/inbounds/${payload.inboundId}/delClient/${payload.clientUuid}`);
        break;
      case 'resetClientTraffic':
        result = await client.post(`/panel/api/inbounds/${payload.inboundId}/resetClientTraffic/${payload.email}`);
        break;
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }

    res.json(result.data);

  } catch (error) {
    console.error("X-UI Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: error.response ? error.response.data.msg || 'X-UI Failed' : error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;

// SSL Configuration using user's certificates
const sslOptions = {
  key: fs.readFileSync('/root/cert/slkv2rays.duckdns.org/privkey.pem'),
  cert: fs.readFileSync('/root/cert/slkv2rays.duckdns.org/fullchain.pem')
};

// Start HTTPS Server
https.createServer(sslOptions, app).listen(PORT, '0.0.0.0', () => {
  console.log(`VPS Secure HTTPS Proxy running on port ${PORT}`);
  console.log(`Ensure your React app uses: https://slkv2rays.duckdns.org:${PORT}/api/xui`);
});
