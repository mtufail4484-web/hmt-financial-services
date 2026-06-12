// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Aap ke Firebase project ki exact configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIZg2LQchLRXcdAPc3rYM7dUF77np7YlY",
  authDomain: "hmt-academy-portal.firebaseapp.com",
  projectId: "hmt-academy-portal",
  storageBucket: "hmt-academy-portal.firebasestorage.app",
  messagingSenderId: "1025365139060",
  appId: "1:1025365139060:web:ec914f02999232b09cfb21"
};

// Initialize Firebase (Next.js Server-Side Rendering safe check)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };