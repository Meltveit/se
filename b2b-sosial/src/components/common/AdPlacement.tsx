import React from 'react';
import AdBanner from './AdBanner';

export type AdPlacementType = 
  | 'homepage-banner'
  | 'business-list-sidebar'
  | 'news-feed-inline'
  | 'profile-sidebar'
  | 'dashboard-banner'
  | 'footer-banner';

interface AdPlacementProps {
  type: AdPlacementType;
  className?: string;
}

const AdPlacement: React.FC<AdPlacementProps> = ({ type, className = '' }) => {
  // Configuration for different ad placements
  const adConfig: Record<
    AdPlacementType, 
    { adSlot: string; width: number; height: number; format: 'auto' | 'rectangle' | 'horizontal' | 'vertical' }
  > = {
    'homepage-banner': {
      adSlot: '1234567890',  // Replace with your actual ad slot ID
      width: 728,
      height: 90,
      format: 'horizontal',
    },
    'business-list-sidebar': {
      adSlot: '2345678901',  // Replace with your actual ad slot ID
      width: 300,
      height: 600,
      format: 'vertical',
    },
    'news-feed-inline': {
      adSlot: '3456789012',  // Replace with your actual ad slot ID
      width: 728,
      height: 90,
      format: 'horizontal',
    },
    'profile-sidebar': {
      adSlot: '4567890123',  // Replace with your actual ad slot ID
      width: 300,
      height: 250,
      format: 'rectangle',
    },
    'dashboard-banner': {
      adSlot: '5678901234',  // Replace with your actual ad slot ID
      width: 970,
      height: 90,
      format: 'horizontal',
    },
    'footer-banner': {
      adSlot: '6789012345',  // Replace with your actual ad slot ID
      width: 728,
      height: 90,
      format: 'horizontal',
    },
  };

  const config = adConfig[type];

  // Display placeholder in development mode
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: config.width, height: config.height, maxWidth: '100%' }}
      >
        <p className="text-gray-500 text-sm">Ad Placement: {type}</p>
        <p className="text-gray-500 text-xs">{config.width}x{config.height}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <AdBanner
        adSlot={config.adSlot}
        width={config.width}
        height={config.height}
        format={config.format}
      />
    </div>
  );
};

export default AdPlacement;