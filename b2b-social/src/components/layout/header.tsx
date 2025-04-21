// src/components/layout/header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Bell } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xl">B2B</div>
              <span className="text-xl font-bold hidden md:block">ConnectPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="/company/search" className="text-gray-600 hover:text-blue-600">Companies</Link>
            <Link href="/sector" className="text-gray-600 hover:text-blue-600">Sectors</Link>
            <Link href="/posts" className="text-gray-600 hover:text-blue-600">Posts</Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Bell size={20} />
            </button>
            <Link 
              href="/login" 
              className="hidden md:block p-2 text-gray-600 hover:text-blue-600"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Register
            </Link>
            <button 
              className="md:hidden p-2 text-gray-600" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white fixed inset-0 z-40 pt-16 flex flex-col">
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/" className="px-3 py-3 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/company/search" className="px-3 py-3 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Companies</Link>
            <Link href="/sector" className="px-3 py-3 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Sectors</Link>
            <Link href="/posts" className="px-3 py-3 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Posts</Link>
            <Link href="/login" className="px-3 py-3 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link href="/register" className="px-3 py-3 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Register</Link>
          </nav>
        </div>
      )}
    </header>
  );
}