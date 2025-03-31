// src/components/common/StaticNavigation.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toStaticPath } from '@/utils/staticNavigation';

/**
 * Static Link component that automatically adds /index.html to paths
 */
export const StaticLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  [key: string]: any;
}> = ({ href, children, className, prefetch = false, ...props }) => {
  // Convert the link to a static path
  const staticHref = toStaticPath(href);

  return (
    <Link 
      href={staticHref} 
      className={className} 
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
};

/**
 * Static Button component that navigates to static paths
 */
export const StaticButton: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  [key: string]: any;
}> = ({ href, children, className, variant = 'primary', ...props }) => {
  const router = useRouter();
  
  const handleClick = () => {
    // Convert to static path and navigate
    router.push(toStaticPath(href));
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Static navigation hook that wraps Next.js router
 */
export function useStaticNavigation() {
  const router = useRouter();
  
  return {
    ...router,
    push: (url: string) => router.push(toStaticPath(url)),
    replace: (url: string) => router.replace(toStaticPath(url)),
  };
}