// Currently only keeping function signatures that are used
export const generateThumbnail = async (_file: File): Promise<string | null> => {
  // This would typically be implemented with a cloud function or client-side image processing
  // For simplicity, we'll just return null for now
  return null;
};

export const getReadableFileSize = (size: number): string => {
  if (size === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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