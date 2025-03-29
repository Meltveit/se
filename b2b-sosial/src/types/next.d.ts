// src/types/next.d.ts
import { ReactNode } from 'react';

declare module 'next' {
  export interface PageProps {
    params: any;  // Changed to 'any' to be more flexible
    searchParams?: any;
    children?: ReactNode;
  }
}

export {};