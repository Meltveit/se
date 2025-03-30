import React from 'react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import { Business } from '@/types';

interface QuickActionsProps {
  business: Business;
}

const QuickActions: React.FC<QuickActionsProps> = ({ business }) => {
  // Determine which actions to show based on profile completion
  const profileComplete = business.profileCompletionStatus.completionPercentage >= 100;
  const canCreatePosts = business.profileCompletionStatus.completionPercentage >= 50;

  // Define available actions
  const actions = [
    {
      name: 'View Your Business',
      description: 'See how your business appears to others',
      href: `/businesses/${business.id}/index.html`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      show: true,
    },
    {
      name: 'Create New Post',
      description: 'Share updates, news, or promotions',
      href: '/dashboard/posts/new/index.html',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      show: canCreatePosts,
    },
    {
      name: 'Manage Posts',
      description: 'Edit or delete your existing posts',
      href: '/dashboard/posts/index.html',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      show: canCreatePosts,
    },
    {
      name: 'Edit Profile',
      description: 'Update your business information',
      href: '/dashboard/profile/index.html',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      show: true,
    },
    {
      name: 'Check Messages',
      description: 'View and respond to messages',
      href: '/dashboard/messages/index.html',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      show: true,
    },
    {
      name: 'Browse Businesses',
      description: 'Find and connect with other businesses',
      href: '/businesses/index.html',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      show: true,
    },
  ].filter(action => action.show);

  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex items-start space-x-4 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div className="flex-shrink-0">{action.icon}</div>
            <div>
              <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600">
                {action.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {!profileComplete && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Some features are limited until you complete your profile ({Math.round(business.profileCompletionStatus.completionPercentage)}% complete).
                  <a href="/dashboard/profile/index.html" className="font-medium underline text-yellow-700 hover:text-yellow-600"> Complete your profile now</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuickActions;