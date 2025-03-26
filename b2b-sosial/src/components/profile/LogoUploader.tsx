import React, { useRef } from 'react';
import Image from 'next/image';
import FileUpload, { FileUploadRef } from '@/components/common/FileUpload';

interface LogoUploaderProps {
  logoPreview: string;
  onFileSelect: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  maxSize?: number;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  logoPreview, 
  onFileSelect, 
  title = "Business Logo", 
  subtitle = "Your logo will appear in search results and on your profile.",
  maxSize = 2
}) => {
  const fileUploadRef = useRef<FileUploadRef>(null);

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Logo Preview */}
        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
          {logoPreview ? (
            <div className="relative w-full h-full">
              <Image
                src={logoPreview}
                alt="Logo Preview"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="text-center p-4">
              <svg className="h-10 w-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-500 mt-1">No logo</p>
            </div>
          )}
        </div>
        
        {/* File Upload */}
        <div className="flex-1">
          <FileUpload
            accept="image/*"
            maxSize={maxSize}
            multiple={false}
            onUpload={onFileSelect}
            ref={fileUploadRef}
            hint={`Recommended size: Square image (500x500 pixels). Max ${maxSize}MB.`}
          />
        </div>
      </div>
    </div>
  );
};

export default LogoUploader;