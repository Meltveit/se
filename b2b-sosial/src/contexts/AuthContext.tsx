// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { getUserProfile, isBusinessAdmin } from '@/lib/firebase/auth';
import { Business } from '@/types'; // Legg til denne importering

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  businessId: string | null;
  business: Business | null;
  isBusinessOwner: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  businessId: null,
  business: null, // Legg til denne
  isBusinessOwner: false,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null); // Legg til denne
  const [isBusinessOwner, setIsBusinessOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Get user profile from Firestore
          const profileData = await getUserProfile(currentUser);
          setUserProfile(profileData);
          
          // Check if user is a business admin/owner
          const businessOwner = await isBusinessAdmin(currentUser);
          setIsBusinessOwner(businessOwner);
          
          // If user is business owner, set businessId (which is the same as userId)
          if (businessOwner) {
            setBusinessId(currentUser.uid);
            
            // Fetch business data
            const businessDoc = await getDoc(doc(db, 'businesses', currentUser.uid));
            if (businessDoc.exists()) {
              setBusiness({
                id: businessDoc.id,
                ...businessDoc.data() as Omit<Business, 'id'>
              });
            } else {
              setBusiness(null);
            }
          } else {
            setBusinessId(null);
            setBusiness(null);
          }
        } catch (err) {
          console.error('Error getting user profile:', err);
          setError('Error loading user data');
        }
      } else {
        // Reset user state when logged out
        setUserProfile(null);
        setBusinessId(null);
        setBusiness(null);
        setIsBusinessOwner(false);
      }
      
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    businessId,
    business, // Legg til denne
    isBusinessOwner,
    loading,
    error,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};