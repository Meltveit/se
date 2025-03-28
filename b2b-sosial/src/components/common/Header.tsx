"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

const Header: React.FC = () => {
  const { user, userProfile, isBusinessOwner, businessId, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Successfully logged out', 'success');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      showToast('Failed to log out. Please try again.', 'error');
    }
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <h1 className="text-xl font-bold">B2B Social</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search businesses..."
                className="px-4 py-2 rounded-lg text-gray-800 w-64"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <Link href="/businesses" className="hover:text-blue-100">
              Businesses
            </Link>
            <Link href="/news-feed" className="hover:text-blue-100">
              News Feed
            </Link>
            <Link href="/map" className="hover:text-blue-100">
              Map
            </Link>

            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center"
                >
                  <span className="mr-2">{userProfile?.firstName || user.email}</span>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600">
                    {userProfile?.firstName ? userProfile.firstName.charAt(0) : user.email?.charAt(0)}
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {isBusinessOwner && (
                      <Link
                        href={`/businesses/${businessId}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Business Profile
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    {isBusinessOwner && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Business Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register/business"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium"
                >
                  Register Business
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="px-4 py-2 rounded-lg text-gray-800 w-full"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <Link href="/businesses" className="py-2 hover:text-blue-100">
                Businesses
              </Link>
              <Link href="/news-feed" className="py-2 hover:text-blue-100">
                News Feed
              </Link>
              <Link href="/map" className="py-2 hover:text-blue-100">
                Map
              </Link>

              {user ? (
                <>
                  {isBusinessOwner && (
                    <>
                      <Link 
                        href={`/businesses/${businessId}`} 
                        className="py-2 hover:text-blue-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Business Profile
                      </Link>
                      <Link 
                        href="/dashboard" 
                        className="py-2 hover:text-blue-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Business Dashboard
                      </Link>
                    </>
                  )}
                  <Link 
                    href="/profile" 
                    className="py-2 hover:text-blue-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 hover:text-blue-100"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register/business"
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium text-center"
                  >
                    Register Business
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;