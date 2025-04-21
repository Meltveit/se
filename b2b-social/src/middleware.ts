// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin if it hasn't been initialized yet
const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
};

// Paths that require authentication
const protectedPaths = [
  '/create-company',
  '/settings',
  '/company/new',
];

// Paths that should redirect to dashboard if already authenticated
const authPaths = [
  '/login',
  '/register',
  '/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files like images, js, css, etc.
  ) {
    return NextResponse.next();
  }
  
  // Check if path needs authentication
  const requiresAuth = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPage = authPaths.some(path => pathname.startsWith(path));
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  
  // If no session cookie and requires auth, redirect to login
  if (requiresAuth && !sessionCookie) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If session cookie exists, validate it
  if (sessionCookie) {
    try {
      // Initialize Firebase Admin
      initializeFirebaseAdmin();
      
      // Verify the session cookie
      await getAuth().verifySessionCookie(sessionCookie);
      
      // If on an auth page and authenticated, redirect to home
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // If session is invalid, clear the cookie for auth pages
      if (requiresAuth) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('session');
        return response;
      }
    }
  }
  
  // Default: allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all paths except static files and API routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};