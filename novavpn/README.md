# NovaVPN — Production V2Ray VPN Selling Platform

> Full-stack VPN subscription platform for Sri Lanka. React 18 + Firebase + Node.js/Express + 3x-UI panel integration.

---

## 📁 Project Structure

```
novavpn/
├── client/                    # React 18 + Vite frontend
│   ├── src/
│   │   ├── firebase.js        # Firebase SDK init
│   │   ├── App.jsx            # Router + all routes + guards
│   │   ├── main.jsx           # React 18 entry point
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # User auth state + role
│   │   │   └── SiteSettingsContext.jsx # Live Firestore site settings
│   │   ├── services/
│   │   │   ├── authService.js      # Google sign-in / sign-out
│   │   │   ├── paymentService.js   # Submit proof, listen status
│   │   │   ├── chatService.js      # Realtime DB chat
│   │   │   ├── panelService.js     # Calls Node server with ID token
│   │   │   ├── webhookService.js   # Discord webhook POSTs
│   │   │   └── settingsService.js  # Read/write siteSettings
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Capsule pill, scroll blur/shrink
│   │   │   ├── Footer.jsx          # From Firestore siteSettings
│   │   │   ├── MeshBackground.jsx  # Animated orbs + dot grid
│   │   │   ├── PlanCard.jsx        # Glassmorphism + 3D tilt
│   │   │   ├── ChatWidget.jsx      # Floating chat + side drawer
│   │   │   ├── ProofUploader.jsx   # base64 converter, 500KB limit
│   │   │   ├── UsageBar.jsx        # 3x-UI traffic progress bar
│   │   │   ├── UserUUIDModal.jsx   # Admin: set UUID/subId/config
│   │   │   └── ProtectedRoute.jsx  # Auth + admin guards
│   │   └── pages/
│   │       ├── Home.jsx            # Full public homepage
│   │       ├── Plans.jsx           # Plan listing
│   │       ├── Checkout.jsx        # Payment flow
│   │       ├── Receipt.jsx         # Payment status (live polling)
│   │       ├── Dashboard.jsx       # User dashboard
│   │       └── admin/
│   │           ├── AdminLayout.jsx         # Sidebar + Outlet
│   │           ├── AdminOverview.jsx       # Stats + activity feed
│   │           ├── AdminPayments.jsx       # Approve/reject payments
│   │           ├── AdminUsers.jsx          # User table + UUID editor
│   │           ├── AdminPlans.jsx          # Plan CRUD
│   │           ├── AdminServers.jsx        # Server CRUD
│   │           ├── AdminChat.jsx           # Real-time chat inbox
│   │           ├── AdminSiteSettings.jsx   # Full homepage content editor
│   │           └── AdminWebhooks.jsx       # Discord webhook URLs
├── server/                    # Node.js Express API
│   ├── index.js               # Express app, Firebase Admin init
│   ├── middleware/
│   │   └── verifyFirebaseToken.js  # ID token verification
│   ├── routes/
│   │   ├── panel.js           # /api/panel/client/:uuid, /all-clients
│   │   └── sync.js            # /api/panel/sync
│   ├── services/
│   │   └── xui.js             # 3x-UI login, session cache, client fetch
│   ├── Dockerfile             # For Cloud Run deployment
│   └── .env.example
├── firestore.rules            # Security rules
├── database.rules.json        # Realtime DB rules
├── firestore.indexes.json     # Composite indexes
└── firebase.json              # Hosting + Firestore + RTDB config
```

---

## 🚀 Quick Start

### 1. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Google provider
3. Enable **Firestore** (production mode)
4. Enable **Realtime Database**
5. Go to Project Settings → Service Accounts → Generate new private key → save as `server/firebase-service-account.json`

### 2. Client Setup

```bash
cd client
cp .env.example .env
# Fill in your Firebase config values
npm install
npm run dev
```

### 3. Server Setup

```bash
cd server
cp .env.example .env
# Fill in XUI_URL, XUI_USER, XUI_PASS
# Place firebase-service-account.json here
npm install
npm run dev
```

### 4. Deploy Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,database
```

### 5. Set Admin Role

In Firebase Console → Firestore → `users/{your-uid}` → set `role: "admin"`

---

## 🔥 Firebase Schema

### Firestore Collections

| Collection | Key Fields |
|---|---|
| `users/{uid}` | email, displayName, role, planId, planName, planExpiry, uuid, subscriptionId, configString, status, createdAt |
| `plans/{id}` | name, price, duration, dataLimitGB, features[], badge, active |
| `servers/{id}` | label, host, port, protocol, remarks, active |
| `payments/{id}` | uid, userEmail, planId, planName, method, proofBase64, status, adminNote, createdAt, reviewedAt |
| `siteSettings/hero` | badge, title, subtitle, ctaText, ctaLink |
| `siteSettings/features` | items[{icon, title, desc}] |
| `siteSettings/faq` | items[{q, a}] |
| `siteSettings/footer` | tagline, links[], social{discord,whatsapp,telegram}, copyright |
| `siteSettings/contact` | email, discord, whatsapp, telegram |
| `siteSettings/navbar` | logoBase64, brandName |
| `siteSettings/webhooks` | payments, chat, contact |
| `contactSubmissions/{id}` | name, email, message, createdAt |

### Realtime Database

```
chats/{uid}/messages/{msgId}
  text, sender ('user'|'admin'), timestamp, read

notifications/{uid}/{id}
  type, message, read, timestamp
```

---

## 🔐 Security Notes

- Admin role is checked via Firestore `users/{uid}.role === 'admin'`
- Node server verifies every request with Firebase ID token (`Authorization: Bearer <token>`)
- Firestore rules: users can only read/write their own docs; admin can access all
- Realtime DB rules: users read/write own chat; admin writes to any chat
- Base64 images stored in Firestore (no Firebase Storage needed)
- CORS restricted to your Firebase Hosting domain

---

## 🌐 Deployment

### Client → Firebase Hosting

```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

### Server → Cloud Run

```bash
cd server
# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/novavpn-server
gcloud run deploy novavpn-server \
  --image gcr.io/YOUR_PROJECT/novavpn-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars XUI_URL=http://...,XUI_USER=admin,XUI_PASS=...
```

Set the Cloud Run URL as `VITE_SERVER_URL` in your client `.env` before building.

---

## ⚡ Discord Webhook Setup

1. In Discord server → Settings → Integrations → Webhooks → New Webhook
2. Create 3 webhooks: **Payments**, **Chat**, **Contact**
3. Copy each URL
4. In NovaVPN Admin → Webhooks tab → paste URLs → Save

---

## 📱 Supported Apps for V2Ray Config

- **Android**: v2rayNG
- **iOS**: Shadowrocket, Streisand
- **Windows**: v2rayN
- **macOS**: V2Box, Hiddify

---

## 🎨 Design System

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#030014` | Page background |
| `--purple` | `#7c3aed` | Primary accent |
| `--cyan` | `#06b6d4` | Secondary accent |
| `--pink` | `#f472b6` | Tertiary accent |
| `--green` | `#34d399` | Success states |
| `--text` | `#f1f5f9` | Primary text |
| `--text-sub` | `#94a3b8` | Secondary text |

All cards: `glass` background + `1px rgba(255,255,255,0.08)` border + `border-radius: 20px`

---

## ✅ Feature Checklist

- [x] Google Sign-In (Firebase Auth)
- [x] Animated mesh background (3 orbs + dot grid)
- [x] Capsule navbar with scroll blur/shrink
- [x] Full homepage (Hero, Features, Plans, How It Works, ISPs, Testimonials, FAQ, Contact)
- [x] Plan cards with 3D tilt hover effect
- [x] Checkout with bank transfer / QR payment
- [x] Base64 proof uploader (500KB limit)
- [x] Live payment status polling (Receipt page)
- [x] User dashboard (plan, usage, config string, QR)
- [x] Copy-to-clipboard config string
- [x] Floating chat widget with Realtime DB
- [x] Admin role guard
- [x] Admin: Payments approve/reject + user notification
- [x] Admin: Users table + UUID/config editor modal
- [x] Admin: Plans CRUD
- [x] Admin: Servers CRUD
- [x] Admin: Real-time chat inbox
- [x] Admin: Full site settings editor (hero, features, FAQ, footer, contact, navbar)
- [x] Admin: Discord webhook configuration + test
- [x] Discord webhooks (payments, chat, contact form)
- [x] Node.js 3x-UI panel proxy with session caching
- [x] Firebase ID token verification on all API routes
- [x] Firestore security rules
- [x] Realtime DB security rules
- [x] Composite Firestore indexes
- [x] Cloud Run Dockerfile
- [x] Mobile responsive (375px+)
