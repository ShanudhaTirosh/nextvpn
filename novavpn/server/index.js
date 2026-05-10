require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// ─── Firebase Admin Init ──────────────────────────────────────────────────────
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// ─── Express Setup ────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow only your Firebase Hosting domain + local dev
const ALLOWED_ORIGINS = [
  process.env.CLIENT_ORIGIN || 'https://your-project.web.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
const panelRoutes = require('./routes/panel');
const syncRoutes = require('./routes/sync');

// NOTE: /api/sync must be mounted BEFORE /api/panel to avoid prefix conflict
app.use('/api/sync', syncRoutes);
app.use('/api/panel', panelRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[NovaVPN Server] Running on port ${PORT}`);
  console.log(`[NovaVPN Server] 3x-UI URL: ${process.env.XUI_URL || 'NOT SET'}`);
});
