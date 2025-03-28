import React from 'react';
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
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}