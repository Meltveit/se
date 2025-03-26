import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload a file to Firebase Storage
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
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
          console.error('Error uploading file:', error);
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

// Upload a business logo
export const uploadBusinessLogo = async (
  businessId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `businesses/${businessId}/logo.${file.name.split('.').pop()}`;
  return uploadFile(file, path, onProgress);
};

// Upload a business banner
export const uploadBusinessBanner = async (
  businessId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `businesses/${businessId}/banner.${file.name.split('.').pop()}`;
  return uploadFile(file, path, onProgress);
};

// Upload a gallery image for a business
export const uploadGalleryImage = async (
  businessId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `businesses/${businessId}/gallery/image${index}.${file.name.split('.').pop()}`;
  return uploadFile(file, path, onProgress);
};

// Upload a post image
export const uploadPostImage = async (
  businessId: string,
  postId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `posts/${businessId}/${postId}/image${index}.${file.name.split('.').pop()}`;
  return uploadFile(file, path, onProgress);
};

// Delete a file from Firebase Storage
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Convert the URL to a storage reference
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};