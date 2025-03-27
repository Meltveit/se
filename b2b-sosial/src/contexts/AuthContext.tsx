"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUserProfile, isBusinessAdmin } from '@/lib/firebase/auth';
import { User } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  isAdmin: boolean;
  isBusinessOwner: boolean;
  businessId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isAdmin: false,
  isBusinessOwner: false,
  businessId: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user profile
          const profile = await getUserProfile(firebaseUser);
          if (profile) {
            setUserProfile({
              id: firebaseUser.uid,
              ...(profile as Omit<User, 'id'>),
            });
          }
          
          // Check if user is business admin
          const businessAdmin = await isBusinessAdmin(firebaseUser);
          setIsBusinessOwner(businessAdmin);
          
          // If business admin, get business ID
          if (businessAdmin) {
            // Check if user is the owner of any business
            const businessDoc = await getDoc(doc(db, 'businesses', firebaseUser.uid));
            if (businessDoc.exists()) {
              setBusinessId(businessDoc.id);
            }
          }
          
          // Check if user is platform admin (for internal use)
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists() && userDoc.data().isAdmin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Reset states when user logs out
        setUserProfile(null);
        setIsBusinessOwner(false);
        setBusinessId(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    isAdmin,
    isBusinessOwner,
    businessId,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};