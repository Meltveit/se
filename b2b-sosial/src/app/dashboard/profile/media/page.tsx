'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getBusiness, updateBusiness, updateBusinessProfileCompletion } from '@/lib/firebase/db';
import { uploadBusinessLogo, uploadBusinessBanner, uploadGalleryImage } from '@/lib/firebase/storage';
import { useToast } from '@/contexts/ToastContext';
import { Business } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProfileCompletionSteps from '@/components/profile/ProfileCompletionSteps';
import LogoUploader from '@/components/profile/LogoUploader';
import ImageGalleryUploader from '@/components/profile/ImageGalleryUploader';
import FileUpload from '@/components/common/FileUpload';

export default function MediaUploadPage() {
  const { businessId } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // File uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  
  // Preview URLs
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const businessData = await getBusiness(businessId);
        if (businessData) {
          setBusiness(businessData);
          // Set existing image URLs if available
          if (businessData.logoUrl) setLogoPreview(businessData.logoUrl);
          if (businessData.bannerUrl) setBannerPreview(businessData.bannerUrl);
          if (businessData.gallery && businessData.gallery.length > 0) {
            setGalleryPreviews(businessData.gallery);
          }
        } else {
          setError('Business not found. Please contact support.');
        }
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError('Failed to load business data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  // Handle logo file selection
  const handleLogoUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setLogoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle banner file selection
  const handleBannerUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setBannerFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery files selection
  const handleGalleryUpload = (files: File[]) => {
    setGalleryFiles([...galleryFiles, ...files]);
    
    // Create preview URLs for new files
    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setGalleryPreviews([...galleryPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove a gallery image
  const removeGalleryImage = (index: number) => {
    // Check if it's an existing image or a new upload
    if (index < galleryPreviews.length - galleryFiles.length) {
      // It's an existing image
      const newPreviews = [...galleryPreviews];
      newPreviews.splice(index, 1);
      setGalleryPreviews(newPreviews);
    } else {
      // It's a new upload
      const newFileIndex = index - (galleryPreviews.length - galleryFiles.length);
      const newFiles = [...galleryFiles];
      newFiles.splice(newFileIndex, 1);
      setGalleryFiles(newFiles);
      
      const newPreviews = [...galleryPreviews];
      newPreviews.splice(index, 1);
      setGalleryPreviews(newPreviews);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId || !business) return;
    
    setSubmitting(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Upload files and get URLs
      let logoUrl = business.logoUrl || '';
      let bannerUrl = business.bannerUrl || '';
      let galleryUrls = business.gallery || [];
      
      // Remove gallery images that were deleted
      if (galleryPreviews.length < (business.gallery?.length || 0)) {
        galleryUrls = galleryPreviews.filter(url => 
          (business.gallery || []).includes(url)
        );
      }
      
      // Upload new logo if selected
      if (logoFile) {
        try {
          const imageUrl = await uploadBusinessLogo(
            businessId, 
            logoFile,
            (progress) => {
              setUploadProgress(progress * 0.33);
            }
          );
          logoUrl = imageUrl;
        } catch (error) {
          console.error('Error uploading logo:', error);
          showToast('Failed to upload logo', 'error');
          setSubmitting(false);
          return;
        }
      }
      
      // Upload new banner if selected
      if (bannerFile) {
        try {
          const imageUrl = await uploadBusinessBanner(
            businessId, 
            bannerFile,
            (progress) => {
              setUploadProgress(33 + progress * 0.33);
            }
          );
          bannerUrl = imageUrl;
        } catch (error) {
          console.error('Error uploading banner:', error);
          showToast('Failed to upload banner', 'error');
          setSubmitting(false);
          return;
        }
      }
      
      // Upload new gallery images if selected
      if (galleryFiles.length > 0) {
        try {
          const uploadedUrls = await Promise.all(
            galleryFiles.map((file, index) => 
              uploadGalleryImage(
                businessId,
                file,
                galleryUrls.length + index,
                (progress) => {
                  const singleFileContribution = 33 / galleryFiles.length;
                  setUploadProgress(
                    66 + (index * singleFileContribution) + (progress * singleFileContribution)
                  );
                }
              )
            )
          );
          
          galleryUrls = [...galleryUrls, ...uploadedUrls];
        } catch (error) {
          console.error('Error uploading gallery images:', error);
          showToast('Failed to upload gallery images', 'error');
          setSubmitting(false);
          return;
        }
      }
      
      // Update business data
      const updateData = {
        logoUrl,
        bannerUrl,
        gallery: galleryUrls,
      };
      
      await updateBusiness(businessId, updateData);
      
      // Update completion status if needed
      if (!business.profileCompletionStatus.media) {
        await updateBusinessProfileCompletion(businessId, 'media', true);
      }
      
      showToast('Media uploaded successfully!', 'success');
      
      // Redirect to the next step
      router.push('/dashboard/profile/categories');
    } catch (err) {
      console.error('Error uploading media:', err);
      setError('Failed to upload media. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Handle skipping this step
  const handleSkip = async () => {
    if (!businessId || !business) return;
    
    try {
      // Mark step as completed even if skipped
      if (!business.profileCompletionStatus.media) {
        await updateBusinessProfileCompletion(businessId, 'media', true);
      }
      
      showToast('Step skipped. You can add media later.', 'info');
      
      // Redirect to the next step
      router.push('/dashboard/profile/categories');
    } catch (err) {
      console.error('Error skipping step:', err);
      setError('Failed to skip this step. Please try again.');
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Media Upload">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  // Handle error state
  if (error && !submitting) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Media Upload">
          <Card>
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth requireBusiness>
      <DashboardLayout title="Media Upload">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Business Media</h2>
              <p className="mt-1 text-sm text-gray-500">
                Upload images to enhance your business profile.
              </p>
            </div>

            <div className="space-y-6">
              {/* Logo Upload using our custom component */}
              <LogoUploader 
                logoPreview={logoPreview}
                onFileSelect={handleLogoUpload}
              />
              
              {/* Banner Upload */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-1">Banner Image</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Your banner will appear at the top of your business profile.
                </p>
                
                <div className="flex flex-col gap-4">
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                    {bannerPreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={bannerPreview}
                          alt="Banner Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <svg className="h-10 w-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">No banner</p>
                      </div>
                    )}
                  </div>
                  
                  <FileUpload
                    accept="image/*"
                    maxSize={5}
                    multiple={false}
                    onUpload={handleBannerUpload}
                    hint="Recommended size: 1200x300 pixels (4:1 ratio). Max 5MB."
                  />
                </div>
              </div>
              
              {/* Gallery Upload using our custom component */}
              <div className="border-t border-gray-200 pt-6">
                <ImageGalleryUploader
                  galleryPreviews={galleryPreviews}
                  onFileSelect={handleGalleryUpload}
                  onRemoveImage={removeGalleryImage}
                  maxImages={10}
                  maxSize={5}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress Indicator */}
            {submitting && uploadProgress > 0 && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-center text-gray-500">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/profile/contact')}
              >
                Back
              </Button>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={submitting}
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  isLoading={submitting}
                  disabled={submitting}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </form>
        </Card>
        
        {/* Profile Completion Steps Component */}
        <ProfileCompletionSteps currentStep={3} />
      </DashboardLayout>
    </AuthGuard>
  );
}