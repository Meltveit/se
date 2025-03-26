import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { sendEmailVerification as sendVerificationEmail } from 'firebase/auth';
import Button from '@/components/common/Button';
import { useToast } from '@/contexts/ToastContext';

interface EmailVerificationProps {
  email: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email }) => {
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      showToast('You must be logged in to resend verification', 'error');
      return;
    }

    setIsSending(true);
    try {
      await sendVerificationEmail(auth.currentUser);
      showToast('Verification email sent successfully', 'success');
    } catch (error) {
      console.error('Error sending verification email:', error);
      showToast('Failed to send verification email. Please try again later.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

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
      <h3 className="mt-3 text-lg font-medium text-gray-900">Verification email sent</h3>
      <p className="mt-2 text-sm text-gray-500">
        We've sent a verification email to <span className="font-medium">{email}</span>.
        Please check your inbox and follow the instructions to verify your email address.
      </p>
      <div className="mt-6 space-y-4">
        <Button
          type="button"
          variant="outline"
          fullWidth
          isLoading={isSending}
          disabled={isSending}
          onClick={handleResendVerification}
        >
          Resend verification email
        </Button>
        <Button type="button" fullWidth onClick={handleContinue}>
          Continue to dashboard
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        You can still access your dashboard, but some features may be limited until you verify your email.
      </p>
    </div>
  );
};

export default EmailVerification;