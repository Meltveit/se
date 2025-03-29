// src/types/next.d.ts
import { ReactNode } from 'react';

declare module 'next' {
  export interface PageProps {
    params?: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
    children?: ReactNode;
  }
}

export {};