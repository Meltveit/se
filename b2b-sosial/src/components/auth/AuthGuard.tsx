import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireBusiness?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireBusiness = false,
  redirectTo = '/login',
}) => {
  const { user, isBusinessOwner, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Skip authorization check if still loading
    if (loading) return;

    // If auth is required and user is not logged in
    if (requireAuth && !user) {
      const encodedReturnUrl = encodeURIComponent(pathname || '/');
      router.push(`${redirectTo}?returnUrl=${encodedReturnUrl}`);
      return;
    }

    // If business access is required and user is not a business owner
    if (requireBusiness && !isBusinessOwner) {
      router.push('/access-denied');
      return;
    }

    // If all checks pass, authorize the user
    setIsAuthorized(true);
  }, [user, isBusinessOwner, loading, requireAuth, requireBusiness, redirectTo, router, pathname]);

  // Show loading spinner while checking auth
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default AuthGuard;