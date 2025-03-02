import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize services
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

// Optional: Configure Google Provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection even when one account is available
})

export { app, analytics }

// Add these security rules in Firebase Console
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to nested esims array
      match /esims/{esimId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
`

// Add these indexes in Firebase Console
const requiredIndexes = [
  {
    collectionGroup: "users",
    queryScope: "COLLECTION",
    fields: [
      { fieldPath: "email", order: "ASCENDING" },
      { fieldPath: "esims.purchasedAt", order: "DESCENDING" }
    ]
  },
  {
    collectionGroup: "users",
    queryScope: "COLLECTION",
    fields: [
      { fieldPath: "esims.packageCode", order: "ASCENDING" },
      { fieldPath: "esims.purchasedAt", order: "DESCENDING" }
    ]
  }
] 