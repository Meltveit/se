import React, { useState } from 'react';
import { signIn } from '@/lib/firebase/auth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useToast } from '@/contexts/ToastContext';
import { StaticLink, useStaticRouter } from '@/components/common/StaticNavigation';

// Add a props interface
interface LoginFormProps {
  initialEmail?: string;
  returnUrl?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ initialEmail = '', returnUrl = '/dashboard' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useStaticRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      showToast('Login successful!', 'success');
      router.push(returnUrl);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorCode = error.code;
      let errorMsg = 'Failed to login. Please try again.';
      
      if (errorCode === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password';
      } else if (errorCode === 'auth/user-not-found') {
        errorMsg = 'No account found with this email';
      } else if (errorCode === 'auth/wrong-password') {
        errorMsg = 'Incorrect password';
      } else if (errorCode === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. Please try again later.';
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
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
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="text-sm">
            <StaticLink href="/forgot-password" className="text-blue-600 hover:text-blue-500">
              Forgot your password?
            </StaticLink>
          </div>
        </div>
        <div className="mt-1">
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />
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
          Sign in
        </Button>
      </div>

      <div className="text-center">
        <div className="text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <StaticLink href="/register/user" className="text-blue-600 hover:text-blue-500">
              Register as User
            </StaticLink>{' '}
            or{' '}
            <StaticLink href="/register/business" className="text-blue-600 hover:text-blue-500">
              Register as Business
            </StaticLink>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;