"use client"
// src/app/layout.tsx
import React, { useEffect } from 'react';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { checkAndPopulateSampleData } from '@/lib/firebase/populateSampleData';

const inter = Inter({ subsets: ['latin'] });

// Function to initialize sample data - called client-side
const InitSampleData = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      checkAndPopulateSampleData();
    }
  }, []);
  
  return null;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx'
          }`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        
        {/* Media.net Script (Optional, can be added dynamically) */}
        <Script
          id="medianet-script"
          strategy="afterInteractive"
          src={`https://contextual.media.net/dmedianet.js?cid=${
            process.env.NEXT_PUBLIC_MEDIANET_PUBLISHER_ID || ''
          }`}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            {children}
            {/* Only run in development mode */}
            {process.env.NODE_ENV === 'development' && <InitSampleData />}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}