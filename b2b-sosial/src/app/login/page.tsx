'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '/dashboard';
  const email = searchParams?.get('email') || '';
  const { user, loading: authLoading } = useAuth();

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && user) {
      router.push(returnUrl);
    }
  }, [user, authLoading, router, returnUrl]);

  if (authLoading || user) {
    return (
      <AuthLayout title="Sign In">
        <div className="flex justify-center py-6">
          <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Sign In" 
      subtitle="Sign in to your account to access your dashboard"
    >
      <LoginForm initialEmail={email} returnUrl={returnUrl} />
      
      <div className="mt-6 grid grid-cols-1 gap-3">
        <div className="mt-1 text-center text-sm">
          <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </Link>
        </div>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or create a new account</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link 
            href="/register/user"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Register as User
          </Link>
          <Link 
            href="/register/business"
            className="w-full inline-flex justify-center py-2 px-4 border border-blue-700 rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register Business
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

// Main component with suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Sign In">
        <div className="flex justify-center py-6">
          <LoadingSpinner size="md" />
        </div>
      </AuthLayout>
    }>
      <LoginContent />
    </Suspense>
  );
}