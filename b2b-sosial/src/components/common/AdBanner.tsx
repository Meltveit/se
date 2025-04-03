// src/components/common/AdBanner.tsx
import React, { useEffect, useRef } from 'react';

// Extend Window interface with additional properties
declare global {
  interface Window {
    adsbygoogle?: any[];
    medianet_width?: number;
    medianet_height?: number;
    medianet_crid?: string;
    medianet_versionId?: string;
    Media_NET?: {
      render: () => void;
    };
  }
}

export type AdPlatform = 'google' | 'medianet';

interface AdBannerProps {
  platform: AdPlatform;
  adSlot: string;
  width?: number;
  height?: number;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  platform,
  adSlot,
  width = 728,
  height = 90,
  format = 'auto',
  className = '',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;
    
    // Handle Google AdSense
    if (platform === 'google' && window.adsbygoogle) {
      try {
        // Check if the script is already loaded
        const hasAdScript = document.querySelector('script[src*="adsbygoogle"]');
        
        if (!hasAdScript) {
          // If not loaded, add the script
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-2602658229657216'
          }`;
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);
        }
        
        // Initialize the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Google AdSense error:', error);
      }
    } 
    // Handle Media.net
    else if (platform === 'medianet') {
      try {
        // Check if the script is already loaded
        const hasMediaNetScript = document.querySelector('script[src*="media.net"]');
        
        if (!hasMediaNetScript) {
          // If not loaded, add the script
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://contextual.media.net/dmedianet.js?cid=' + 
            process.env.NEXT_PUBLIC_MEDIANET_PUBLISHER_ID;
          document.body.appendChild(script);
        }
        
        // Set up Media.net properties
        window.medianet_width = width;
        window.medianet_height = height;
        window.medianet_crid = adSlot;
        window.medianet_versionId = 'test';
        
        // Render Media.net ad if the API is available
        if (window.Media_NET) {
          window.Media_NET.render();
        }
      } catch (error) {
        console.error('Media.net rendering error:', error);
      }
    }
    
    // Cleanup function
    return () => {
      // No cleanup needed for AdSense as it's a global script
    };
  }, [platform, adSlot, width, height]);

  const renderGoogleAd = () => (
    <ins
      className="adsbygoogle"
      style={{ 
        display: 'block', 
        width: format === 'auto' ? '100%' : `${width}px`, 
        height: format === 'auto' ? 'auto' : `${height}px` 
      }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );

  const renderMediaNetAd = () => (
    <div 
      id={`medianet_${adSlot}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px` 
      }}
    />
  );

  // In development mode, show placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          width: width, 
          height: height 
        }}
      >
        <p className="text-gray-500 text-xs">Ad Placeholder: {platform} ({adSlot})</p>
      </div>
    );
  }

  // In production, render actual ad
  return (
    <div className={`ad-container overflow-hidden ${className}`} ref={adRef}>
      {platform === 'google' ? renderGoogleAd() : renderMediaNetAd()}
    </div>
  );
};

export default AdBanner;