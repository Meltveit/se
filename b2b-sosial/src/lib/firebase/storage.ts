import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './config';

// Helper function to extract path from Firebase Storage URL
function extractPathFromUrl(url: string): string {
  if (!url.startsWith('http')) {
    return url;
  }
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/o/')[1];
    if (path) {
      return decodeURIComponent(path);
    }
  } catch (e) {
    console.error('Error parsing URL:', e);
  }
  return url;
}

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

// Delete a file from Firebase Storage
export const deleteFile = async (url: string): Promise<void> => {
  if (!url) return;
  try {
    const path = extractPathFromUrl(url);
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    console.log('File deleted successfully:', path);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Upload a business logo with auto-deletion of old logo
export const uploadBusinessLogo = async (
  businessId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    const businessSnapshot = await getDoc(businessRef);
    const businessData = businessSnapshot.exists() ? businessSnapshot.data() : null;
    const oldLogoUrl = businessData?.logoUrl;
    const fileExtension = file.name.split('.').pop() || 'png';
    const path = `businesses/${businessId}/logo.${fileExtension}`;
    const newLogoUrl = await uploadFile(file, path, onProgress);
    await updateDoc(businessRef, {
      logoUrl: newLogoUrl,
      updatedAt: serverTimestamp(),
    });
    if (oldLogoUrl && oldLogoUrl !== newLogoUrl) {
      try {
        await deleteFile(oldLogoUrl);
      } catch (deleteError) {
        console.error('Error deleting old logo:', deleteError);
      }
    }
    return newLogoUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
};

// Upload a business banner with auto-deletion of old banner
export const uploadBusinessBanner = async (
  businessId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    const businessSnapshot = await getDoc(businessRef);
    const businessData = businessSnapshot.exists() ? businessSnapshot.data() : null;
    const oldBannerUrl = businessData?.bannerUrl;
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const path = `businesses/${businessId}/banner.${fileExtension}`;
    const newBannerUrl = await uploadFile(file, path, onProgress);
    await updateDoc(businessRef, {
      bannerUrl: newBannerUrl,
      updatedAt: serverTimestamp(),
    });
    if (oldBannerUrl && oldBannerUrl !== newBannerUrl) {
      try {
        await deleteFile(oldBannerUrl);
      } catch (deleteError) {
        console.error('Error deleting old banner:', deleteError);
      }
    }
    return newBannerUrl;
  } catch (error) {
    console.error('Error uploading banner:', error);
    throw error;
  }
};

// Upload a gallery image for a business
export const uploadGalleryImage = async (
  businessId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const path = `businesses/${businessId}/gallery/image${index}.${fileExtension}`;
  return uploadFile(file, path, onProgress);
};

// Upload a message attachment
export const uploadMessageAttachment = async (
  conversationId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop() || 'file';
  const path = `messages/${conversationId}/${timestamp}-${index}.${fileExtension}`;
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
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const path = `posts/${businessId}/${postId}/image${index}.${fileExtension}`;
  return uploadFile(file, path, onProgress);
};

// Update business gallery and clean up removed images
export const updateBusinessGallery = async (
  businessId: string,
  newGalleryUrls: string[]
): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    const businessSnapshot = await getDoc(businessRef);
    if (!businessSnapshot.exists()) {
      throw new Error('Business not found');
    }
    const businessData = businessSnapshot.data();
    const oldGalleryUrls = businessData.gallery || [];
    await updateDoc(businessRef, {
      gallery: newGalleryUrls,
      updatedAt: serverTimestamp(),
    });

    // Delete old gallery images that are not in the new gallery
    const removedUrls = oldGalleryUrls.filter((url: string) => !newGalleryUrls.includes(url));
    for (const url of removedUrls) {
      try {
        await deleteFile(url);
      } catch (error) {
        console.error('Error deleting old gallery image:', error);
      }
    }
  } catch (error) {
    console.error('Error updating gallery:', error);
    throw error;
  }
};