'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Business } from '@/types';
import Card from '@/components/common/Card';

interface BusinessGalleryProps {
  business: Business;
}

const BusinessGallery: React.FC<BusinessGalleryProps> = ({ business }) => {
  const [activeImage, setActiveImage] = useState<string | null>(
    business.gallery && business.gallery.length > 0 ? business.gallery[0] : null
  );

  // If no gallery images exist, show a placeholder
  if (!business.gallery || business.gallery.length === 0) {
    return (
      <Card title="Gallery">
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No gallery images available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Gallery">
      <div className="space-y-4">
        {/* Main image display */}
        {activeImage && (
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={activeImage}
              alt={`${business.name} gallery image`}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {business.gallery.map((image, index) => (
            <button
              key={index}
              className={`relative aspect-w-1 aspect-h-1 overflow-hidden rounded-md ${
                activeImage === image ? 'ring-2 ring-blue-500' : 'hover:opacity-75'
              }`}
              onClick={() => setActiveImage(image)}
            >
              <Image
                src={image}
                alt={`${business.name} gallery thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BusinessGallery;