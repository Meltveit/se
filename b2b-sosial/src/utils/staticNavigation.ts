// src/utils/staticNavigation.ts
/**
 * Utilities to help with static export navigation
 * 
 * These utilities convert dynamic paths to static HTML paths
 * for use with Next.js static export
 */

/**
 * Convert a dynamic route to a static HTML path
 * 
 * @param path - The dynamic route path
 * @returns The static HTML path with /index.html suffix
 */
export function toStaticPath(path: string): string {
    if (!path) return '/';
    
    // Don't modify external URLs
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) {
      return path;
    }
    
    // Remove trailing slash if present
    const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
    
    // Don't add index.html if path already contains a file extension
    if (
      cleanPath.endsWith('.html') || 
      cleanPath.endsWith('.jpg') || 
      cleanPath.endsWith('.png') || 
      cleanPath.endsWith('.svg') || 
      cleanPath.endsWith('.pdf')
    ) {
      return cleanPath;
    }
    
    // Handle root path
    if (cleanPath === '/') {
      return '/index.html';
    }
    
    // Handle query parameters
    const [basePath, queryParams] = cleanPath.split('?');
    const newBasePath = basePath.endsWith('/index.html') ? basePath : `${basePath}/index.html`;
    
    return queryParams ? `${newBasePath}?${queryParams}` : newBasePath;
  }
  
  /**
   * Hook to override the Next.js useRouter hook for static exports
   * 
   * @returns Modified router object with static-friendly push and replace methods
   */
  export function useStaticRouter() {
    // Import at the component level to avoid SSR issues
    const { useRouter } = require('next/navigation');
    const router = useRouter();
    
    return {
      ...router,
      push: (path: string) => {
        router.push(toStaticPath(path));
      },
      replace: (path: string) => {
        router.replace(toStaticPath(path));
      }
    };
  }
  
  /**
   * Custom Link component that works with static exports
   */
  export function StaticLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    // Import at the component level to avoid SSR issues
    const Link = require('next/link').default;
    
    return (
      <Link href={toStaticPath(href)} {...props}>
        {children}
      </Link>
    );
  }