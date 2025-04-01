// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Import remote config only on client side
import { getRemoteConfig, isSupported } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Remote Config safely (client-side only)
let remoteConfig: ReturnType<typeof getRemoteConfig> | null = null;

// Only access remoteConfig on client
if (typeof window !== 'undefined') {
  // Use async initialization for Remote Config
  const initRemoteConfig = async () => {
    try {
      const isRemoteConfigSupported = await isSupported();
      if (isRemoteConfigSupported) {
        remoteConfig = getRemoteConfig(app);
        // Set minimum fetch interval to reduce quota usage
        if (remoteConfig) {
          remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
        }
      }
    } catch (error) {
      console.warn('Remote Config initialization failed:', error);
      // Continue without Remote Config
    }
  };
  
  // Initialize but don't await - let it happen in background
  initRemoteConfig();
}

export { app, auth, db, storage, remoteConfig };