import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const completionLevel = business.profileCompletionStatus.completionPercentage;
  const isComplete = completionLevel >= 75;
  const initial = business.name.charAt(0).toUpperCase();

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
              href={`/businesses/${business.id}`}
              className="block"
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
        
        {/* Rest of the component remains the same */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {business.shortDescription || business.description
            ? (business.shortDescription || business.description?.substring(0, 120) + (business.description && business.description.length > 120 ? '...' : ''))
            : 'No description available.'}
        </p>
        
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