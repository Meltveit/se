// src/types/pageProps.ts
import { Metadata } from 'next';

/**
 * Interface for Next.js page components props
 * Dette følger den forventede strukturen i Next.js App Router
 */
export interface PageProps {
  params: any;
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * Interface for metadata generation functions
 */
export interface MetadataProps {
  params: { [key: string]: string };
  searchParams?: Record<string, string | string[] | undefined>;
  parent?: Promise<Metadata>;
}