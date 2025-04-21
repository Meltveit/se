// src/lib/auth/firebase-auth.ts
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    UserCredential,
    User
  } from 'firebase/auth';
  import { auth, db } from '../firebase/config';
  import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
  
  // Register a new user
  export const registerUser = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<User> => {
    try {
      // Create the user in Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user profile with the name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        photoURL: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        companies: [],
        isAdmin: false
      });
      
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  
  // Sign in an existing user
  export const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  
  // Sign out the current user
  export const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  // Send password reset email
  export const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };
  
  // Get current user data from Firestore
  export const getCurrentUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.error('No user found with ID:', userId);
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  };