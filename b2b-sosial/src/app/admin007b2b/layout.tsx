import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">B2B Social Admin</h1>
          <nav>
            <a href="/admin007b2b/login" className="text-white hover:underline">Logg ut</a>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}