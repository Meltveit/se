"use client";

import React from 'react';
import AdBanner from './AdBanner';

export type SubtleAdPlacementType = 
  | 'content-bottom'    // Subtle ad at bottom of content
  | 'sidebar-native'    // Native ad in sidebar resembling normal content
  | 'feed-integrated'   // Integrated ad in feed as natural part of list
  | 'footer-discrete';  // Discrete ad at bottom of page

interface SubtleAdPlacementProps {
  type: SubtleAdPlacementType;
  className?: string;
}

const SubtleAdPlacement: React.FC<SubtleAdPlacementProps> = ({ type, className = '' }) => {
  // Configuration for different ad types with subtle styling
  const adConfig: Record<SubtleAdPlacementType, {
    adSlot: string;
    width: number;
    height: number;
    format: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    style: React.CSSProperties;
  }> = {
    'content-bottom': {
      adSlot: '1234567890', // Replace with your actual ad ID
      width: 728,
      height: 90,
      format: 'horizontal',
      style: { 
        margin: '20px auto', 
        maxWidth: '100%',
        borderTop: '1px solid #eaeaea',
        borderBottom: '1px solid #eaeaea',
        padding: '15px 0'
      }
    },
    'sidebar-native': {
      adSlot: '2345678901', // Replace with your actual ad ID
      width: 300,
      height: 250,
      format: 'rectangle',
      style: { 
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        background: '#fff',
        margin: '15px 0'
      }
    },
    'feed-integrated': {
      adSlot: '3456789012', // Replace with your actual ad ID
      width: 468,
      height: 60,
      format: 'horizontal',
      style: { 
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '6px',
        margin: '12px 0'
      }
    },
    'footer-discrete': {
      adSlot: '4567890123', // Replace with your actual ad ID
      width: 728,
      height: 90,
      format: 'horizontal',
      style: { 
        margin: '10px auto',
        borderTop: '1px solid #eaeaea',
        paddingTop: '15px',
        opacity: 0.85 // Slightly less prominent
      }
    }
  };

  const config = adConfig[type];

  // Show discrete placeholder in development mode
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={`bg-gray-100 ${className}`}
        style={{ 
          ...config.style, 
          width: config.width, 
          height: config.height, 
          maxWidth: '100%', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <p className="text-gray-400 text-xs">Discrete Ad</p>
      </div>
    );
  }

  return (
    <div className={className} style={config.style}>
      <AdBanner
        adSlot={config.adSlot}
        width={config.width}
        height={config.height}
        format={config.format}
      />
    </div>
  );
};

export default SubtleAdPlacement;