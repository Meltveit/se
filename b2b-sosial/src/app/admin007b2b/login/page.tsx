'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Debug: Log Firebase configuration on component mount
  useEffect(() => {
    console.log('Firebase Auth Configuration:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not Set',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not Set',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login with email:', email);

    try {
      // Extensive logging for authentication process
      console.log('Starting Firebase authentication');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Authentication successful');
      console.log('User UID:', user.uid);
      
      // Specific admin user check
      const SUPER_ADMIN_UID = '2pQt0csZO3cHekZZP0q1l1juUVr2';
      
      if (user.uid === SUPER_ADMIN_UID) {
        console.log('Admin user verified');
        
        // Store admin session info
        sessionStorage.setItem('adminSession', 'true');
        sessionStorage.setItem('adminUid', user.uid);
        
        // Redirect to admin dashboard
        router.push('/admin007b2b/dashboard');
      } else {
        console.warn('Unauthorized user attempted login:', user.uid);
        await auth.signOut(); // Sign them out if not admin
        throw new Error('Ikke autorisert tilgang');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // More detailed error handling
      if (error instanceof Error) {
        switch (error.message) {
          case 'Firebase: Error (auth/invalid-credential).':
            setError('Ugyldig e-post eller passord');
            break;
          case 'Firebase: Error (auth/user-not-found).':
            setError('Ingen bruker funnet med denne e-posten');
            break;
          case 'Firebase: Error (auth/wrong-password).':
            setError('Feil passord');
            break;
          case 'Ikke autorisert tilgang':
            setError('Kun superadmin har tilgang');
            break;
          default:
            setError('En uventet feil oppstod. Kontakt support.');
        }
      } else {
        setError('En uventet feil oppstod');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Dashboard Innlogging
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">E-post</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="E-postadresse"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Passord</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Passord"
              />
            </div>
          </div>

          {error && (
            <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Logger inn...' : 'Logg inn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}