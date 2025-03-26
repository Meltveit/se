import React, { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase/auth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useToast } from '@/contexts/ToastContext';

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      showToast('Password reset email sent successfully', 'success');
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorCode = error.code;
      let errorMsg = 'Failed to send password reset email. Please try again.';
      
      if (errorCode === 'auth/user-not-found') {
        errorMsg = 'No account found with this email address';
      } else if (errorCode === 'auth/invalid-email') {
        errorMsg = 'Invalid email address';
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Check your email</h3>
        <p className="mt-2 text-sm text-gray-500">
          We've sent a password reset link to <span className="font-medium">{email}</span>.
          Please check your inbox and follow the instructions to reset your password.
        </p>
        <div className="mt-6">
          <Link href="/login">
            <Button type="button" fullWidth>
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Reset your password</h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Input
        label="Email address"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
      />

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Send reset link
        </Button>
      </div>

      <div className="text-center">
        <div className="text-sm">
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default PasswordResetForm;