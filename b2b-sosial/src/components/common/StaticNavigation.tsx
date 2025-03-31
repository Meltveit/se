// src/components/common/StaticNavigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toStaticPath } from '@/utils/staticNavigation';

export const StaticLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  [prop: string]: any;
}> = ({ href, children, className, onClick, ...props }) => {
  const router = useRouter();
  const staticHref = toStaticPath(href);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    // Check if it's a business profile link and use client-side navigation
    const businessProfileRegex = /^\/businesses\/[^\/]+\/?$/;
    if (businessProfileRegex.test(href)) {
      e.preventDefault();
      router.push(href);
    }
  };
  
  return (
    <Link 
      href={staticHref} 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

// Add the useStaticRouter hook
export function useStaticRouter() {
  const router = useRouter();
  
  return {
    ...router,
    push: (url: string, options?: any) => {
      const staticUrl = toStaticPath(url);
      router.push(staticUrl, options);
    },
    // Add other methods as needed, mirroring useRouter
    replace: (url: string, options?: any) => {
      const staticUrl = toStaticPath(url);
      router.replace(staticUrl, options);
    },
    back: () => router.back(),
    forward: () => router.forward(),
  };
}