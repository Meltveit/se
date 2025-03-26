'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import EmailVerification from '@/components/auth/EmailVerification';
import { useAuth } from '@/contexts/AuthContext';

export default function BusinessVerificationPage() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const { user } = useAuth();
  
  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle="We've sent a verification email to your inbox"
    >
      <EmailVerification email={email} />
      
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