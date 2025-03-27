import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

// Upload a message attachment
export const uploadMessageAttachment = async (
  conversationId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const path = `messages/${conversationId}/${timestamp}-${index}.${fileExtension}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Error uploading attachment:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    } catch (error) {
      console.error('Error starting upload:', error);
      reject(error);
    }
  });
};

// Generate a thumbnail for an image attachment
export const generateThumbnail = async (file: File): Promise<string | null> => {
  // This would typically be implemented with a cloud function or client-side image processing
  // For simplicity, we'll just return null for now
  return null;
};

// Get file size in a readable format
export const getReadableFileSize = (size: number): string => {
  if (size === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on file type
export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) {
    return 'image';
  } else if (fileType.startsWith('video/')) {
    return 'video';
  } else if (fileType.startsWith('audio/')) {
    return 'audio';
  } else if (fileType === 'application/pdf') {
    return 'pdf';
  } else if (
    fileType === 'application/msword' ||
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'word';
  } else if (
    fileType === 'application/vnd.ms-excel' ||
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return 'excel';
  } else if (
    fileType === 'application/vnd.ms-powerpoint' ||
    fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return 'powerpoint';
  } else {
    return 'file';
  }
};

// Check if file type is allowed
export const isAllowedFileType = (fileType: string): boolean => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    
    // Other
    'application/json',
    'text/csv',
  ];
  
  return allowedTypes.includes(fileType);
};

// Get maximum file size based on file type
export const getMaxFileSize = (fileType: string): number => {
  if (fileType.startsWith('image/')) {
    return 10 * 1024 * 1024; // 10MB
  } else if (fileType.startsWith('video/')) {
    return 50 * 1024 * 1024; // 50MB
  } else if (fileType.startsWith('audio/')) {
    return 30 * 1024 * 1024; // 30MB
  } else {
    return 20 * 1024 * 1024; // 20MB
  }
};