"use client";

import React, { ReactNode } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('adminSession');
      sessionStorage.removeItem('adminUid');
      router.push('/admin007b2b/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">B2B Social Admin</h1>
          <nav>
            <button onClick={handleLogout} className="text-white hover:underline">Log Out</button>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}