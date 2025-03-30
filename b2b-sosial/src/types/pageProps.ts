/**
 * Interface for Next.js page components props with Promise<params>
 * This follows the expected structure in Next.js 15+ App Router
 */
export interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Interface for metadata generation functions with Promise<params>
 * This needs to match PageProps exactly for Next.js type checking
 */
export interface MetadataProps {
  params: Promise<{ [key: string]: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}