"use client";

import React, { useEffect, useRef } from 'react';

// Add TypeScript declaration for window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  adSlot: string;
  width?: number;
  height?: number;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  width = 728,
  height = 90,
  format = 'auto',
  className = '',
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Google AdSense is loaded
    if (window.adsbygoogle) {
      try {
        // Push the ad to Google AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    } else {
      console.log('AdSense not loaded yet');
    }
  }, [adSlot]);

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: format === 'auto' ? '100%' : `${width}px`, height: format === 'auto' ? 'auto' : `${height}px` }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx'}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;