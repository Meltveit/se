import React from 'react';
import AdBanner from './AdBanner';

export type SubtleAdPlacementType = 
  | 'content-bottom'       // Subtil annonse nederst i innhold
  | 'sidebar-native'       // Nativ annonse i sidebar som ligner på vanlig innhold
  | 'feed-integrated'      // Integrert annonse i feed som en naturlig del av listen
  | 'footer-discrete';     // Diskret annonse i bunnen av siden

interface SubtleAdPlacementProps {
  type: SubtleAdPlacementType;
  className?: string;
}

const SubtleAdPlacement: React.FC<SubtleAdPlacementProps> = ({ type, className = '' }) => {
  // Konfigurasjon for ulike annonsetyper med subtil utforming
  const adConfig: Record<
    SubtleAdPlacementType, 
    { adSlot: string; width: number; height: number; format: 'auto' | 'rectangle' | 'horizontal' | 'vertical'; style: React.CSSProperties }
  > = {
    'content-bottom': {
      adSlot: '1234567890', // Erstatt med din faktiske annonse-ID
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
      adSlot: '2345678901', // Erstatt med din faktiske annonse-ID
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
      adSlot: '3456789012', // Erstatt med din faktiske annonse-ID
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
      adSlot: '4567890123', // Erstatt med din faktiske annonse-ID
      width: 728,
      height: 90,
      format: 'horizontal',
      style: { 
        margin: '10px auto',
        borderTop: '1px solid #eaeaea',
        paddingTop: '15px',
        opacity: 0.85 // Litt mindre fremtredende
      }
    }
  };

  const config = adConfig[type];

  // Vis diskret placeholder i utviklingsmodus
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
        <p className="text-gray-400 text-xs">Diskret annonse</p>
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