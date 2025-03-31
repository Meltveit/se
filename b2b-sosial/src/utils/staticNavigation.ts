/**
 * Converts a dynamic route to a static-friendly path
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

  // Special handling for business and other dynamic routes
  const dynamicRoutePatterns = [
    /\/businesses\/[^\/]+\/?$/,
    /\/news-feed\/[^\/]+\/?$/,
    /\/messages\/[^\/]+\/?$/
  ];

  for (const pattern of dynamicRoutePatterns) {
    if (path.match(pattern)) {
      return path.endsWith('/') ? path : `${path}/`;
    }
  }

  // Existing path conversion logic
  let url;
  try {
    url = new URL(path.startsWith('/') ? path : `/${path}`, 'http://example.com');
  } catch (e) {
    console.error(`Failed to parse URL: ${path}`, e);
    return path;
  }
  
  const pathname = url.pathname;
  
  // Don't add index.html for paths with file extensions
  if (pathname.match(/\.(html|htm|css|js|jpg|jpeg|png|gif|svg|pdf|json)$/i)) {
    return path;
  }
  
  // Handle root path
  if (pathname === '/') {
    return path.startsWith('/') ? '/index.html' + url.search + url.hash : 'index.html' + url.search + url.hash;
  }
  
  // Remove trailing slash and add index.html
  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const newPath = `${normalizedPath}/index.html${url.search}${url.hash}`;
  
  return path.startsWith('/') ? newPath : newPath.substring(1);
}