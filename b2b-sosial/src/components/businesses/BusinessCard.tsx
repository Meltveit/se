import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Business } from '@/types';
import Button from '@/components/common/Button';

interface BusinessCardProps {
  business: Business;
  isFollowing?: boolean;
  onFollow?: (id: string) => void;
  isLoading?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
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

  // Handle follow/unfollow action
  const handleFollowClick = () => {
    if (onFollow) {
      onFollow(business.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          {business.logoUrl ? (
            <div className="w-12 h-12 relative rounded-full overflow-hidden">
              <Image
                src={business.logoUrl}
                alt={business.name}
                fill
                sizes="3rem"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-800">
              <span className="font-bold">{initial}</span>
            </div>
          )}
          
          <div className="ml-3 min-w-0 flex-1">
            <Link 
              href={`/businesses/${business.id}/index.html`} 
              passHref
              prefetch={false}
            >
              <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors truncate max-w-full">
                {business.name}
              </h3>
            </Link>
            
            {business.tags && business.tags.length > 0 && (
              <div className="flex flex-wrap">
                {business.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1"
                  >
                    {tag}
                  </span>
                ))}
                {business.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{business.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {business.shortDescription || business.description
            ? (business.shortDescription || business.description?.substring(0, 120) + (business.description && business.description.length > 120 ? '...' : ''))
            : 'No description available.'}
        </p>
        
        {isComplete && business.verified && (
          <div className="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-green-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-green-600 font-medium">Verified Business</span>
          </div>
        )}
        
        {!isComplete && (
          <div className="mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-yellow-600 font-medium">
              Profile {Math.round(completionLevel)}% Complete
            </span>
          </div>
        )}
        
        <Button
          type="button"
          variant={isFollowing ? 'outline' : 'primary'}
          fullWidth
          onClick={handleFollowClick}
          isLoading={isLoading}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};

export default BusinessCard;