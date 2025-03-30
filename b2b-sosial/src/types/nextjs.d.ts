/**
 * Type declarations for Next.js App Router components
 * These types extend or override the default Next.js types
 */

// Common parameter type for dynamic route segments
export type RouteParams<T extends string> = {
    [K in T]: string;
  };
  
  // Helper types for page components
  export type PageProps<T extends string = string> = {
    params: RouteParams<T>;
    searchParams?: { [key: string]: string | string[] | undefined };
  };
  
  // Helper types for generateMetadata function
  export type MetadataProps<T extends string = string> = {
    params: RouteParams<T>;
    searchParams?: { [key: string]: string | string[] | undefined };
  };