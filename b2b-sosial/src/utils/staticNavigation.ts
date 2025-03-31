
// src/utils/staticNavigation.ts - Without JSX
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

// Remove the JSX components from this file
// The StaticLink and other React components should be in a separate .tsx file