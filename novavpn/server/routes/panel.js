const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyFirebaseToken');
const { getClientByUUID, getAllClients } = require('../services/xui');

// GET /api/panel/client/:uuid — user or admin fetches stats for a UUID
router.get('/client/:uuid', verifyToken, async (req, res) => {
  const { uuid } = req.params;
  if (!uuid) return res.status(400).json({ error: 'UUID is required' });
  try {
    const stats = await getClientByUUID(uuid);
    if (!stats) return res.status(404).json({ error: 'Client not found for UUID: ' + uuid });
    res.json(stats);
  } catch (err) {
    console.error('[Panel] getClientByUUID error:', err.message);
    res.status(500).json({ error: 'Failed to fetch client stats: ' + err.message });
  }
});

// GET /api/panel/all-clients — admin only, fetch all clients
router.get('/all-clients', verifyToken, async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json({ clients, count: clients.length });
  } catch (err) {
    console.error('[Panel] getAllClients error:', err.message);
    res.status(500).json({ error: 'Failed to fetch all clients: ' + err.message });
  }
});

module.exports = router;
