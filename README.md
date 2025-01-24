# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# StayConnected365

A modern eSIM management platform that helps travelers stay connected worldwide.

## Features

- 📱 Easy eSIM activation and management
- 🌍 Global coverage in 190+ countries
- 🔐 Secure authentication
- 💳 Simple plan selection and activation
- 👤 User account dashboard

## Environment Setup

Create a `.env` file in the root directory with:

```plaintext
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# eSIM API Configuration
VITE_ESIM_API_KEY=your_esim_api_key
VITE_ESIM_SECRET_KEY=your_esim_secret_key
```

## Setup

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication methods:
   - Go to Authentication > Sign-in methods
   - Enable Email/Password
   - Enable Google Sign-in
3. Add your Firebase configuration:
   ```javascript
   // src/config/firebase.js
   const firebaseConfig = {
     apiKey: "AIzaSyDl-eInXN-jsS4EscDdGHww3G4Q0wYnjGM",
     authDomain: "stayconnected365-73277.firebaseapp.com",
     projectId: "stayconnected365-73277",
     storageBucket: "stayconnected365-73277.firebasestorage.app",
     messagingSenderId: "303176621632",
     appId: "1:303176621632:web:61943600bf7d936cb649a5",
     measurementId: "G-0680TJHXC7"
   }
   ```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React + Vite
- Firebase (Authentication, Analytics)
- React Router
- React Icons

## Project Structure

## Deployment

### Prerequisites
- Node.js 14.x or higher
- Firebase account
- eSIM Access API credentials

### Build for Production
```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Firebase Deployment
1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
- Select "Hosting"
- Select your project
- Set "dist" as your public directory
- Configure as a single-page app
- Don't overwrite index.html

4. Deploy to Firebase:
```bash
firebase deploy
```

### Environment Variables
Make sure to set up these environment variables in your hosting platform:

```plaintext
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# eSIM API Configuration
VITE_ESIM_API_KEY=your_esim_api_key
VITE_ESIM_SECRET_KEY=your_esim_secret_key
```
