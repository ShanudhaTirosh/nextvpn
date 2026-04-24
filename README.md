# ShiftLK Netch Solutions - Full Stack VPN Portal

A premium, dark-themed, glassmorphism-style VPN service platform built with React, Firebase, and React-Bootstrap.

## Features Included

**Public Website**
- **12-Section Dynamic Homepage** featuring floating dashboards, server monitoring (Chart.js), protocol comparisons, and pricing.
- Complete public pages: About, Services, Pricing, FAQ, Contact, and Legal.
- Automated dark-mode aesthetics using a custom CSS variable design system (`globals.css`).

**Authentication & Client Portal**
- Google & Email/Password Authentication.
- Secure, protected routing for the Client Portal.
- Dashboard for viewing active plans, days remaining, and fetching V2Ray configuration links.
- 4-step Manual Payment Modal with auto-compressing image upload for proof of payment.

**Admin Panel**
- Secure, RBAC (Role-Based Access Control) protected routes.
- **Overview:** Real-time stats, revenue calculation, and server status.
- **Users:** Manage accounts, toggle active status, grant admin privileges.
- **Payments:** Review uploaded payment screenshots, approve/reject to automatically extend user subscriptions via Firestore triggers.
- **Servers:** Full CRUD operations for managing V2Ray nodes, capacities, and online status.
- **Packages:** Customize pricing plans, prices, and feature lists dynamically.
- **Settings:** Update contact emails, social links, and bank account details globally across the site without changing code.

## Tech Stack
- **Frontend:** React 19, React-Router-Dom v6, React-Bootstrap, Vanilla CSS (Custom Design System).
- **Backend:** Firebase Authentication, Firestore Database.
- **Libraries:** Chart.js, React-Hot-Toast, FontAwesome 6.

## Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password & Google providers).
3. Enable **Firestore Database**.
4. Deploy the included Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 3. Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`. Replace the values with your Firebase project configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Running Locally
Start the development server:
```bash
npm start
```

### 5. Admin Access Setup
Since the app uses manual registration initially, you need to make the first user an admin manually via the Firebase Console:
1. Register an account on the website.
2. Go to your Firebase Firestore console.
3. Find your user document in the `users` collection.
4. Add a boolean field: `isAdmin: true`.
5. Refresh the website, and you will now see the Admin Panel link in the navbar dropdown.

## Deployment
This app is ready to be deployed to Firebase Hosting.
```bash
npm run build
firebase deploy --only hosting
```

## Design System Notes
All visual elements are controlled via `src/styles/globals.css`. If you wish to change the primary colors (Cyan, Blue, Purple), simply update the `--accent-cyan`, `--accent-blue`, and `--accent-purple` variables at the top of the file. All glowing effects, gradients, and buttons will adapt automatically.
