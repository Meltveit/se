import React, { useRef } from 'react';
import Image from 'next/image';
import FileUpload, { FileUploadRef } from '@/components/common/FileUpload';

interface ImageGalleryUploaderProps {
  galleryPreviews: string[];
  onFileSelect: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  title?: string;
  subtitle?: string;
  maxSize?: number;
  maxImages?: number;
}

const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({
  galleryPreviews,
  onFileSelect,
  onRemoveImage,
  title = "Gallery Images",
  subtitle = "Add images to showcase your business, products or services.",
  maxSize = 5,
  maxImages = 10
}) => {
  const fileUploadRef = useRef<FileUploadRef>(null);
  
  const remainingImages = maxImages - galleryPreviews.length;

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">
        {subtitle}
      </p>
      
      {/* Gallery Grid */}
      {galleryPreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {galleryPreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={preview}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveImage(index)}
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* File Upload */}
      {remainingImages > 0 ? (
        <FileUpload
          accept="image/*"
          maxSize={maxSize}
          multiple={true}
          onUpload={onFileSelect}
          ref={fileUploadRef}
          hint={`You can add up to ${remainingImages} more images. Max ${maxSize}MB per image.`}
        />
      ) : (
        <p className="text-amber-600 text-sm">
          Maximum number of images reached ({maxImages}). Remove some images to add new ones.
        </p>
      )}
    </div>
  );
};

export default ImageGalleryUploader;