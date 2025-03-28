import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/firebase/auth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import { useToast } from '@/contexts/ToastContext';

// Mock country data - in a real app, you'd use country-state-city package
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'no', label: 'Norway' },
  { value: 'se', label: 'Sweden' },
  { value: 'dk', label: 'Denmark' },
];

const UserRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'us',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
      });
      
      showToast('Registration successful! Please check your email to verify your account.', 'success');
      router.push('/login');
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
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <Input
          label="First name"
          id="firstName"
          name="firstName"
          type="text"
          required
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
        />
        
        <Input
          label="Last name"
          id="lastName"
          name="lastName"
          type="text"
          required
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
        />
      </div>

      <Input
        label="Email address"
        id="email"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        fullWidth
        autoComplete="email"
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

      <Select
        label="Country"
        id="country"
        name="country"
        options={countries}
        value={formData.country}
        onChange={handleChange}
        required
        fullWidth
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
          Register
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

export default UserRegistrationForm;