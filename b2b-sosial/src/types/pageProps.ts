// src/types/pageProps.ts
import { Metadata } from 'next';

/**
 * Interface for Next.js page components props
 * Following the expected structure in Next.js App Router
 */
export interface PageProps {
  params: { [key: string]: string };
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