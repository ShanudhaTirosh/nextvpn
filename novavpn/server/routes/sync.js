const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const verifyToken = require('../middleware/verifyFirebaseToken');
const { getAllClients } = require('../services/xui');

// POST /api/panel/sync — admin syncs 3x-UI clients to Firestore by UUID match
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = admin.firestore();

    // Check caller is admin
    const userDoc = await db.collection('users').doc(req.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const clients = await getAllClients();
    const usersSnap = await db.collection('users').get();

    let synced = 0;
    const batch = db.batch();

    usersSnap.docs.forEach(docSnap => {
      const userData = docSnap.data();
      if (!userData.uuid) return;

      const client = clients.find(c => c.uuid === userData.uuid);
      if (client) {
        batch.update(docSnap.ref, {
          xuiEmail: client.email,
          xuiEnable: client.enable,
          lastSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        synced++;
      }
    });

    await batch.commit();
    res.json({ success: true, synced, total: usersSnap.size, xuiClients: clients.length });
  } catch (err) {
    console.error('[Sync] Error:', err.message);
    res.status(500).json({ error: 'Sync failed: ' + err.message });
  }
});

module.exports = router;
