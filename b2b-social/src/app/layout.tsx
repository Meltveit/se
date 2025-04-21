// src/app/layout.tsx
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
  title: 'B2B Social - Connect with businesses',
  description: 'A platform for business networking and collaboration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className}`}>
      <body className="flex flex-col min-h-screen bg-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}