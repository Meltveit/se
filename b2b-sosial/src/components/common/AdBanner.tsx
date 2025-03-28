import React from 'react';

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
  // Removed unused adRef
  React.useEffect(() => {
    if (platform === 'google' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Google AdSense error:', error);
      }
    }
  }, [platform, adSlot]);

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

  // Load Media.net script
  React.useEffect(() => {
    if (platform === 'medianet') {
      const script = document.createElement('script');
      script.src = 'https://contextual.media.net/dmedianet.js?cid=' + 
        process.env.NEXT_PUBLIC_MEDIANET_PUBLISHER_ID;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        try {
          // Safely set window properties
          if (window) {
            window.medianet_width = width;
            window.medianet_height = height;
            window.medianet_crid = adSlot;
            window.medianet_versionId = 'test';
            
            if (window.Media_NET) {
              window.Media_NET.render();
            }
          }
        } catch (error) {
          console.error('Media.net rendering error:', error);
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [platform, adSlot, width, height]);

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      {platform === 'google' ? renderGoogleAd() : renderMediaNetAd()}
    </div>
  );
};

export default AdBanner;