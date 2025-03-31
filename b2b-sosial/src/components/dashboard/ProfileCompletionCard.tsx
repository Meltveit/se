// src/components/dashboard/ProfileCompletionCard.tsx
import React from 'react';
import Link from 'next/link';
import { Business } from '@/types';
import Card from '@/components/common/Card';
import ProgressBar from '@/components/common/ProgressBar';
import Button from '@/components/common/Button';

interface ProfileCompletionCardProps {
  business: Business;
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ business }) => {
  const { profileCompletionStatus } = business;
  const completionPercentage = profileCompletionStatus.completionPercentage;
  
  // Define steps and their status
  const completionSteps = [
    {
      name: 'Basic Information',
      description: 'Company name, description, industry, etc.',
      completed: profileCompletionStatus.basicInfo,
      href: '/dashboard/profile/basic-info',
    },
    {
      name: 'Contact Details',
      description: 'Address, phone, email, contact person',
      completed: profileCompletionStatus.contactDetails,
      href: '/dashboard/profile/contact',
    },
    {
      name: 'Media',
      description: 'Logo, banner, and photo gallery',
      completed: profileCompletionStatus.media,
      href: '/dashboard/profile/media',
    },
    {
      name: 'Categories & Tags',
      description: 'Business category and up to 3 relevant tags',
      completed: profileCompletionStatus.categoriesAndTags,
      href: '/dashboard/profile/categories',
    },
  ];

  // Find next incomplete step
  const nextIncompleteStep = completionSteps.find(step => !step.completed);

  return (
    <Card
      title="Complete Your Profile"
      subtitle={`${Math.round(completionPercentage)}% complete`}
    >
      <div className="space-y-6">
        <ProgressBar 
          percentage={completionPercentage} 
          color={completionPercentage < 50 ? 'red' : completionPercentage < 75 ? 'yellow' : 'green'}
        />

        {completionPercentage < 100 ? (
          <>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Next steps to complete</h4>
              <ul className="space-y-3">
                {completionSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mt-0.5 ${
                      step.completed ? 'bg-green-100 border-green-500' : 'border-gray-300'
                    }`}>
                      {step.completed ? (
                        <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="h-3 w-3"></span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{step.name}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    <div className="ml-auto">
                      {!step.completed && (
                        <Link href={step.href} className="text-xs text-blue-600 hover:text-blue-500">
                          Complete
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {nextIncompleteStep && (
              <div className="border-t border-gray-200 pt-4">
                <Link href={nextIncompleteStep.href}>
                  <Button fullWidth>
                    Continue Profile Setup
                  </Button>
                </Link>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Complete your profile to increase visibility and connect with more businesses
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="border-t border-gray-200 pt-4 text-center">
            <div className="mb-4 text-green-600 flex items-center justify-center">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Profile Complete!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your business profile is now complete. You can edit it anytime from the dashboard.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/profile">
                <Button variant="outline" fullWidth>
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Profile Visibility Information */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Visibility</h4>
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-xs text-blue-700">
                  {completionPercentage < 50 
                    ? 'Your profile appears in our directory with minimal info.' 
                    : completionPercentage < 75 
                    ? 'Your profile now appears in search results and category pages.'
                    : completionPercentage < 100 
                    ? 'Your profile is eligible to be featured on our homepage!'
                    : 'Your profile has a "Verified" badge and priority in listings!'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletionCard;