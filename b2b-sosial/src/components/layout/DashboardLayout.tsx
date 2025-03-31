import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/common/Header';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { userProfile } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="space-y-1">
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  Business Profile
                </Link>
                <Link 
                  href="/dashboard/posts" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  Posts
                </Link>
                <Link 
                  href="/dashboard/messages" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  Messages
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  Settings
                </Link>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="text-xs text-gray-500">
                  Logged in as:
                </div>
                <div className="font-medium text-sm mt-1">
                  {userProfile?.firstName} {userProfile?.lastName}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;