import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDl-eInXN-jsS4EscDdGHww3G4Q0wYnjGM",
  authDomain: "stayconnected365-73277.firebaseapp.com",
  projectId: "stayconnected365-73277",
  storageBucket: "stayconnected365-73277.firebasestorage.app",
  messagingSenderId: "303176621632",
  appId: "1:303176621632:web:61943600bf7d936cb649a5",
  measurementId: "G-0680TJHXC7"
}

const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const analytics = getAnalytics(app)
export const googleProvider = new GoogleAuthProvider()

// Optional: Configure Google Provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection even when one account is available
}) 