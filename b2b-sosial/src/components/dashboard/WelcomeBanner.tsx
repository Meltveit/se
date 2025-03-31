import React from 'react';
import Link from 'next/link';
import { User, Business } from '@/types';
import Button from '@/components/common/Button';

interface WelcomeBannerProps {
  user: User;
  business: Business;
  isNewUser?: boolean;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, business, isNewUser = false }) => {
  // Get first name for greeting
  const firstName = user.firstName || user.email.split('@')[0];
  
  // Determine what actions to show based on profile completion
  const profilePercentage = business.profileCompletionStatus.completionPercentage;
  const showProfileCompletion = profilePercentage < 100;
  const showCreatePost = profilePercentage >= 50; // Only show post creation if profile is at least 50% complete

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {isNewUser 
                ? `Welcome to B2B Social, ${firstName}!` 
                : `Welcome back, ${firstName}!`
              }
            </h2>
            <p className="mt-1 text-sm text-gray-500 max-w-xl">
              {isNewUser 
                ? 'Thanks for registering your business. Complete your profile to connect with other businesses and maximize your visibility.'
                : profilePercentage < 100 
                  ? 'Continue setting up your business profile to improve your visibility in the platform.'
                  : 'Your business profile is complete! Check out what\'s new with other businesses.'
              }
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0 flex space-x-3">
            {showProfileCompletion && (
              <Link href="/dashboard/profile/index.html">
                <Button variant={profilePercentage < 50 ? 'primary' : 'outline'}>
                  Complete Profile
                </Button>
              </Link>
            )}
            
            {showCreatePost && (
              <Link href="/dashboard/posts/new/index.html">
                <Button variant={profilePercentage >= 50 && profilePercentage < 100 ? 'primary' : 'outline'}>
                  Create Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {isNewUser && (
        <div className="bg-blue-50 px-6 py-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Need help getting started? <a href="/help" className="font-medium underline text-blue-700 hover:text-blue-600">Check out our guides</a> or <a href="/support" className="font-medium underline text-blue-700 hover:text-blue-600">contact support</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeBanner;