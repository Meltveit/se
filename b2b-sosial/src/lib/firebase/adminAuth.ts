// src/lib/firebase/adminAuth.ts

import { auth } from './config';
import { User, getAuth, getIdToken, signInWithEmailAndPassword } from 'firebase/auth';

// Constants
export const SUPER_ADMIN_UID = '2pQt0csZO3cHekZZP0q1l1juUVr2';

/**
 * Verify if the current user is a super admin
 * This is a client-side only verification and should be used with caution
 */
export const verifySuperAdmin = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('No user is currently logged in');
      return false;
    }
    
    // Check by UID for super admin
    if (currentUser.uid === SUPER_ADMIN_UID) {
      // Force token refresh to ensure we have the latest state
      await currentUser.getIdToken(true);
      console.log('Verified super admin with UID:', currentUser.uid);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
};

/**
 * Get an auth token for the current user
 * Useful for API calls that need auth
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('No user is currently logged in');
      return null;
    }
    
    // Get a fresh token
    const token = await currentUser.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
};

/**
 * Handle admin login
 */
export const adminLogin = async (email: string, password: string): Promise<User | null> => {
  try {
    // Sign in with Firebase auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if this is the super admin user
    if (user.uid !== SUPER_ADMIN_UID) {
      console.error('User is not authorized as super admin:', user.uid);
      await auth.signOut(); // Sign them out if not admin
      return null;
    }
    
    // Store admin session in localStorage or sessionStorage
    sessionStorage.setItem('adminSession', 'true');
    sessionStorage.setItem('adminUid', user.uid);
    
    return user;
  } catch (error) {
    console.error('Admin login error:', error);
    return null;
  }
};