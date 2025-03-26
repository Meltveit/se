'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import QuickBusinessRegistrationForm from '@/components/auth/QuickBusinessRegistrationForm';
import { useToast } from '@/contexts/ToastContext';

export default function BusinessRegistrationPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleRegistrationSuccess = (email: string) => {
    showToast('Registration successful! Please check your email to verify your account.', 'success');
    router.push(`/register/business/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthLayout 
      title="Register Your Business" 
      subtitle="Create your business profile in less than a minute"
      backLink={{
        href: '/login',
        label: 'Already have an account? Sign in'
      }}
    >
      <QuickBusinessRegistrationForm
        onSuccess={handleRegistrationSuccess}
      />
      
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="text-sm text-gray-500 text-center">
          <p>Looking to register as an individual user?</p>
          <Link href="/register/user" className="text-blue-600 hover:text-blue-500 font-medium">
            Create a user account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}