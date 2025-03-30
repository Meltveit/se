import { Metadata } from 'next';

/**
 * Interface for Next.js page components props with Promise<params>
 * This follows the expected structure in Next.js 15+ App Router
 */
export interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Interface for metadata generation functions with Promise<params>
 */
export interface MetadataProps {
  params: Promise<{ [key: string]: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
  parent?: Promise<Metadata>;
}