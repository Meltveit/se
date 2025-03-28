'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import EmailVerification from '@/components/auth/EmailVerification';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Component that uses useSearchParams
function BusinessVerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  
  return (
    <EmailVerification email={email} />
  );
}

export default function BusinessVerificationPage() {
  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle="We've sent a verification email to your inbox"
    >
      <Suspense fallback={
        <div className="flex justify-center py-6">
          <LoadingSpinner size="md" />
        </div>
      }>
        <BusinessVerificationContent />
      </Suspense>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="text-sm text-gray-500 text-center">
          <p>
            If you're having trouble, contact our support team at{' '}
            <a href="mailto:support@b2bsocial.com" className="text-blue-600 hover:text-blue-500">
              support@b2bsocial.com
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}