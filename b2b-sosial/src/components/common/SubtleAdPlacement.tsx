// src/components/common/SubtleAdPlacement.tsx
"use client";

import React from 'react';
import AdBanner from './AdBanner';

export type SubtleAdPlacementType = 
  | 'content-bottom'    // Subtle ad at bottom of content
  | 'sidebar-native'    // Native ad in sidebar resembling normal content
  | 'feed-integrated'   // Integrated ad in feed as natural part of list
  | 'footer-discrete'   // Discrete ad at bottom of page
  | 'business-list-sidebar' // Sidebar ad in business listing page
  | 'news-feed-inline'  // Inline ad in news feed
  | 'footer-banner';    // Banner ad in footer

interface SubtleAdPlacementProps {
  type: SubtleAdPlacementType;
  className?: string;
}

const SubtleAdPlacement: React.FC<SubtleAdPlacementProps> = ({ type, className = '' }) => {
  // Ad configuration with different placements and settings
  const adConfig = {
    'content-bottom': {
      platform: 'google',
      adSlot: '1234567890', // Google AdSense slot
      width: 728,
      height: 90,
      format: 'horizontal',
    },
    'sidebar-native': {
      platform: 'medianet',
      adSlot: '2345678901', // Media.net slot
      width: 300,
      height: 250,
      format: 'rectangle',
    },
    'feed-integrated': {
      platform: 'google',
      adSlot: '3456789012', // Google AdSense slot
      width: 468,
      height: 60,
      format: 'horizontal',
    },
    'footer-discrete': {
      platform: 'medianet',
      adSlot: '4567890123', // Media.net slot
      width: 728,
      height: 90,
      format: 'horizontal',
    },
    'business-list-sidebar': {
      platform: 'google',
      adSlot: '5678901234', // Google AdSense slot  
      width: 300,
      height: 600,
      format: 'rectangle',
    },
    'news-feed-inline': {
      platform: 'medianet',
      adSlot: '6789012345', // Media.net slot
      width: 468,
      height: 60,
      format: 'horizontal',
    },
    'footer-banner': {
      platform: 'google',
      adSlot: '7890123456', // Google AdSense slot
      width: 970,
      height: 90,
      format: 'horizontal',
    }
  };

  // Validate ad type
  if (!adConfig[type]) {
    console.warn(`Invalid ad type: ${type}`);
    return null;
  }

  // Development mode: Show placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          width: adConfig[type].width, 
          height: adConfig[type].height 
        }}
      >
        <p className="text-gray-500 text-xs">Ad Placeholder: {type}</p>
      </div>
    );
  }

  // Production: Render actual ad
  return (
    <div className={className}>
      <AdBanner
        platform={adConfig[type].platform as 'google' | 'medianet'}
        adSlot={adConfig[type].adSlot}
        width={adConfig[type].width}
        height={adConfig[type].height}
        format={adConfig[type].format as 'horizontal' | 'rectangle' | 'auto'}
      />
    </div>
  );
};

export default SubtleAdPlacement;