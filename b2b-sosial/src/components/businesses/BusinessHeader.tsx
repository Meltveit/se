// src/components/businesses/BusinessHeader.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Business } from '@/types';
import Button from '@/components/common/Button';

interface BusinessHeaderProps {
  business: Business;
  isFollowing?: boolean;
  onFollow?: (id: string) => void;
  isLoading?: boolean;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  business,
  isFollowing = false,
  onFollow,
  isLoading = false,
}) => {
  // Calculate completion level for conditional UI
  const completionLevel = business.profileCompletionStatus.completionPercentage;
  const isComplete = completionLevel >= 75;

  // Generate a placeholder initial for businesses without logos
  const initial = business.name.charAt(0).toUpperCase();

  return (
    <div className="relative mb-8">
      {/* Banner Image */}
      <div className="h-48 sm:h-64 lg:h-80 bg-gray-200 relative overflow-hidden">
        {business.bannerUrl ? (
          <Image
            src={business.bannerUrl}
            alt={`${business.name} banner`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
            <span className="text-white text-xl font-medium">{business.name}</span>
          </div>
        )}
      </div>

      {/* Logo and Business Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="relative z-10 bg-white rounded-lg shadow-md p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:items-center">
              {/* Logo */}
              <div className="flex-shrink-0 -mt-16 sm:mt-0">
                {business.logoUrl ? (
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden border-4 border-white shadow-sm">
                    <Image
                      src={business.logoUrl}
                      alt={business.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold border-4 border-white shadow-sm">
                    {initial}
                  </div>
                )}
              </div>

              {/* Business Info */}
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900 truncate max-w-[300px]">{business.name}</h1>
                  {isComplete && business.verified && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <div className="mt-1">
                  {business.category && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                      {business.category}
                    </span>
                  )}
                  {!isComplete && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Profile {Math.round(completionLevel)}% Complete
                    </span>
                  )}
                </div>

                {business.shortDescription && (
                  <p className="mt-2 text-sm text-gray-600 max-w-2xl line-clamp-2">{business.shortDescription}</p>
                )}

                {/* Tags */}
                {business.tags && business.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap">
                    {business.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-1 mb-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                type="button"
                variant={isFollowing ? 'outline' : 'primary'}
                onClick={() => onFollow && onFollow(business.id)}
                isLoading={isLoading}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button type="button" variant="secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;