// Firebase Admin SDK for server-side operations
import { initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import serviceAccount from './b2bsocial-firebase-adminsdk-fbsvc-803b32a071.json' assert { type: "json" };

let adminApp: App | undefined = undefined;

function initializeAdminApp() {
  if (!adminApp) {
    try {
      // Bruk servicekonto-nøkkelen du importerte
      adminApp = initializeApp({
        credential: admin.credential.cert(serviceAccount as any), // Bruk 'as any' for å unngå typeproblemer
      });
    } catch (error: any) {
      console.error('Feil ved initialisering av Firebase Admin:', error);
    }
  }
  return adminApp;
}

export const adminDb = () => {
  const app = initializeAdminApp();
  if (app) {
    return getFirestore(app);
  }
  return null;
};

export const adminAuth = () => {
  const app = initializeAdminApp();
  if (app) {
    return admin.auth();
  }
  return null;
};