const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error("ERROR: serviceAccountKey.json not found in vps-backend folder.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shiftlk-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();
const rtdb = admin.database();

async function syncAdmins() {
  console.log("Starting admin synchronization...");
  
  try {
    // 1. Fetch all users with isAdmin = true from Firestore
    const usersSnapshot = await db.collection('users').where('isAdmin', '==', true).get();
    
    if (usersSnapshot.empty) {
      console.log("No admins found in Firestore.");
      process.exit(0);
    }

    const adminUpdates = {};
    const adminList = [];

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      adminUpdates[doc.id] = true;
      adminList.push(userData.email || doc.id);
    });

    console.log(`Found ${adminList.length} admins: ${adminList.join(', ')}`);

    // 2. Update the 'admins' node in Realtime Database
    // We use update() to merge with existing admins, or set() to overwrite
    await rtdb.ref('admins').set(adminUpdates);

    console.log("Successfully synchronized admins to Realtime Database.");
    process.exit(0);
  } catch (error) {
    console.error("Error during synchronization:", error);
    process.exit(1);
  }
}

syncAdmins();
