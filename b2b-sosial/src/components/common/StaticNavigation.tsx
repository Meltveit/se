'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toStaticPath } from '@/utils/staticNavigation';

/**
 * StaticLink component for static export compatibility
 */
export const StaticLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  [prop: string]: any;
}> = ({ href, children, className, onClick, ...props }) => {
  // Convert the path to a static-friendly format
  const staticHref = toStaticPath(href);
  
  return (
    <Link 
      href={staticHref} 
      className={className} 
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
};

/**
 * Hook that wraps the Next.js router for static export compatibility
 */
export function useStaticRouter() {
  const router = useRouter();
  const pathname = usePathname();
  
  return {
    ...router,
    pathname,
    push: (url: string, options?: any) => {
      const staticUrl = toStaticPath(url);
      router.push(staticUrl, options);
    },
    replace: (url: string, options?: any) => {
      const staticUrl = toStaticPath(url);
      router.replace(staticUrl, options);
    },
    // Add a debug method to log the current route
    debugRoute: () => {
      console.log('Current path:', pathname);
      return pathname;
    }
  };
}

/**
 * Static Button component that navigates to static paths
 */
export const StaticButton: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  [prop: string]: any;
}> = ({ href, children, className, onClick, ...props }) => {
  const router = useStaticRouter();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    if (!e.defaultPrevented) {
      e.preventDefault();
      router.push(href);
    }
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