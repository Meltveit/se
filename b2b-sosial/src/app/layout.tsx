'use client';

import React, { useEffect } from 'react';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleStaticLinkNavigate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.path) {
        window.location.href = customEvent.detail.path;
      }
    };

    window.addEventListener('staticLinkNavigate', handleStaticLinkNavigate);

    return () => {
      window.removeEventListener('staticLinkNavigate', handleStaticLinkNavigate);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Script with comprehensive error handling */}
        <Script
          id="google-adsense-script"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx'
          }`}
          crossOrigin="anonymous"
          onLoad={() => {
            console.log('Google AdSense script loaded successfully');
            // Kombiner initialiseringen og aktiveringen av sideannonser her
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: `${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx'}`,
                enable_page_level_ads: true,
              });
            } catch (error) {
              console.error('Error initializing AdSense:', error);
            }
          }}
          onError={(error) => {
            console.error('Failed to load Google AdSense script:', error);
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}