import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

interface FileUploadProps {
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  className?: string;
}

export interface FileUploadRef {
  reset: () => void;
}

const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  (
    {
      label,
      hint,
      error,
      accept = 'image/*',
      maxSize = 5, // Default max size 5MB
      multiple = false,
      onUpload,
      className = '',
    },
    ref
  ) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Convert bytes to more readable format
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFiles = (filesToValidate: File[]): boolean => {
      // Check file size
      const maxSizeBytes = maxSize * 1024 * 1024;
      for (const file of filesToValidate) {
        if (file.size > maxSizeBytes) {
          setFileError(`File ${file.name} exceeds maximum size of ${maxSize}MB`);
          return false;
        }
      }

      setFileError(null);
      return true;
    };

    const handleFilesSelected = (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      const fileList = Array.from(selectedFiles);
      if (validateFiles(fileList)) {
        setFiles(multiple ? [...files, ...fileList] : fileList);
        if (onUpload) {
          onUpload(multiple ? [...files, ...fileList] : fileList);
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFilesSelected(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFilesSelected(e.dataTransfer.files);
    };

    const handleRemoveFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      if (onUpload) {
        onUpload(newFiles);
      }
    };

    const reset = () => {
      setFiles([]);
      setFileError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      reset,
    }));

    return (
      <div className={className}>
        {label && <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>}

        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : error || fileError
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              Drag and drop your {multiple ? 'files' : 'file'} here, or{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 focus:outline-none"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {accept === 'image/*'
                ? 'Supported formats: JPEG, PNG, GIF, etc.'
                : `Accepted formats: ${accept}`}{' '}
              (Max size: {maxSize}MB)
            </p>
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <ul className="mt-3 divide-y divide-gray-200 border rounded-md">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between py-2 px-3">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => handleRemoveFile(index)}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {(error || fileError) && (
          <p className="mt-1 text-sm text-red-600">{error || fileError}</p>
        )}
        {hint && !error && !fileError && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;