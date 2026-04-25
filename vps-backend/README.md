# NextVPN VPS Backend Proxy

This is a lightweight Node.js Express server designed to run on your X-UI VPS. It acts as a secure bridge between your NextVPN React website and your local X-UI panel.

Because it runs locally on your VPS, it solves all CORS issues and requires absolutely **zero monthly fees** (unlike Firebase Cloud Functions).

## Setup Instructions

### 1. Prerequisites (On your VPS)
Ensure you have Node.js and PM2 installed. If not, connect via SSH and run:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Generate Firebase Service Account Key
To securely verify that commands are coming from an Administrator, this proxy needs to talk to Firebase.
1. Go to your Firebase Console -> **Project Settings** -> **Service Accounts**.
2. Click **Generate new private key**.
3. A JSON file will download. Rename it to exactly `serviceAccountKey.json`.
4. Place this file inside this `vps-backend` folder.

### 3. Deploy
1. Upload this entire `vps-backend` folder to your VPS (e.g., to `/opt/vps-backend`).
2. SSH into your VPS, navigate to the folder, and start the server:
```bash
cd /opt/vps-backend
npm install
pm2 start server.js --name nextvpn-proxy
pm2 save
pm2 startup
```

### 4. Configure Your Website
1. Open your React Admin Panel and go to **Global Settings**.
2. Under "X-UI Direct API", set the API URL to: `http://YOUR_VPS_IP:3001/api/xui`.
3. Enable the integration and save!
