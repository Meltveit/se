import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerBusiness } from '@/lib/firebase/auth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useToast } from '@/contexts/ToastContext';

interface QuickBusinessRegistrationFormProps {
  onSuccess?: (email: string) => void;
}

const QuickBusinessRegistrationForm: React.FC<QuickBusinessRegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    orgNumber: '',
    contactPersonName: '',
    contactPersonEmail: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return false;
    }
    
    if (!formData.acceptTerms) {
      setErrorMessage('You must accept the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      await registerBusiness({
        name: formData.name,
        orgNumber: formData.orgNumber,
        contactPersonName: formData.contactPersonName,
        contactPersonEmail: formData.contactPersonEmail,
        password: formData.password,
        acceptTerms: formData.acceptTerms,
        subscribeNewsletter: formData.subscribeNewsletter,
      });
      
      if (onSuccess) {
        onSuccess(formData.contactPersonEmail);
      } else {
        showToast('Registration successful! Please check your email to verify your account.', 'success');
        router.push('/login?email=' + encodeURIComponent(formData.contactPersonEmail));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorCode = error.code;
      let errorMsg = 'Failed to register. Please try again.';
      
      if (errorCode === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists';
      } else if (errorCode === 'auth/invalid-email') {
        errorMsg = 'Invalid email address';
      } else if (errorCode === 'auth/weak-password') {
        errorMsg = 'Password is too weak. Please use a stronger password.';
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Register your business quickly with minimal information. You can complete your profile later.
        </p>
      </div>

      <Input
        label="Business Name"
        id="name"
        name="name"
        type="text"
        required
        value={formData.name}
        onChange={handleChange}
        fullWidth
      />

      <Input
        label="Organization Number"
        id="orgNumber"
        name="orgNumber"
        type="text"
        required
        value={formData.orgNumber}
        onChange={handleChange}
        fullWidth
      />

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Contact Person</h3>
        <p className="mt-1 text-sm text-gray-500">
          This email will be used for login and account management.
        </p>
      </div>

      <Input
        label="Full Name"
        id="contactPersonName"
        name="contactPersonName"
        type="text"
        required
        value={formData.contactPersonName}
        onChange={handleChange}
        fullWidth
      />

      <Input
        label="Email Address"
        id="contactPersonEmail"
        name="contactPersonEmail"
        type="email"
        required
        value={formData.contactPersonEmail}
        onChange={handleChange}
        fullWidth
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        fullWidth
        hint="Must be at least 8 characters"
      />

      <Input
        label="Confirm password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
      />

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms" className="font-medium text-gray-700">
              I accept the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </Link>
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="subscribeNewsletter"
              name="subscribeNewsletter"
              type="checkbox"
              checked={formData.subscribeNewsletter}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="subscribeNewsletter" className="font-medium text-gray-700">
              Subscribe to newsletter for business opportunities and updates
            </label>
          </div>
        </div>
      </div>

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
          Register Business
        </Button>
      </div>

      <div className="text-center">
        <div className="text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default QuickBusinessRegistrationForm;