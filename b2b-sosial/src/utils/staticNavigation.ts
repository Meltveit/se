// src/utils/staticNavigation.ts
/**
 * Utilities for handling navigation in static exports
 */

/**
 * Converts a dynamic route to a static HTML path
 */
export function toStaticPath(path: string): string {
  // Don't modify external URLs
  if (!path || 
      path.startsWith('http://') || 
      path.startsWith('https://') || 
      path.startsWith('mailto:') || 
      path.startsWith('tel:')) {
    return path;
  }

  // Handle hash links
  if (path.startsWith('#')) {
    return path;
  }

  // Handle absolute URLs
  const isAbsolute = path.startsWith('/');
  const cleanPath = isAbsolute ? path : `/${path}`;
  
  // Parse URL to handle query parameters and hash
  let url;
  try {
    // Create a URL with a dummy base to parse relative URLs
    url = new URL(cleanPath, 'http://example.com');
  } catch (e) {
    console.error(`Failed to parse URL: ${path}`, e);
    return path;
  }
  
  const pathname = url.pathname;
  
  // Don't add index.html for paths that already have a file extension
  if (pathname.match(/\.(html|htm|css|js|jpg|jpeg|png|gif|svg|pdf|json)$/i)) {
    return path;
  }
  
  // Handle root path
  if (pathname === '/') {
    return isAbsolute ? '/index.html' + url.search + url.hash : 'index.html' + url.search + url.hash;
  }
  
  // Remove trailing slash if present
  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  
  // Add index.html to the path
  const newPath = `${normalizedPath}/index.html${url.search}${url.hash}`;
  
  return isAbsolute ? newPath : newPath.substring(1); // Remove leading slash if the original path was relative
}