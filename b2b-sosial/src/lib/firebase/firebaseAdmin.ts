// src/lib/firebase/firebaseAdmin.ts
// This is a temporary solution to fix the build error
// In a static export, the Firebase Admin SDK is not usable

// Mock admin functions for client-side use
export const adminDb = () => {
    console.warn('Firebase Admin SDK is not available in the browser');
    return null;
  };
  
  export const adminAuth = () => {
    console.warn('Firebase Admin SDK is not available in the browser');
    return null;
  };