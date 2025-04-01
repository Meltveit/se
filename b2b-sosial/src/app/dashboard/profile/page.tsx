// src/app/dashboard/profile/page.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBusiness, updateBusiness } from '@/lib/firebase/db';
import { uploadBusinessLogo, uploadBusinessBanner } from '@/lib/firebase/storage';
import { useToast } from '@/contexts/ToastContext';
import { Business } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CATEGORIES, TAGS, TagCategory } from '@/lib/geographic-data';
import FileUpload, { FileUploadRef } from '@/components/common/FileUpload';

export default function BusinessProfileEditPage() {
  const { businessId } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const logoUploadRef = useRef<FileUploadRef>(null);
  const bannerUploadRef = useRef<FileUploadRef>(null);

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Image states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // Initialize form state with empty values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    yearFounded: '',
    employeeCount: '',
    businessType: '',
    email: '',
    phone: '',
    website: '',
  });
  
  // State for tags management
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<{value: string, label: string}[]>([]);

  // Fetch business data when component mounts
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const businessData = await getBusiness(businessId);
        
        if (businessData) {
          setBusiness(businessData);

          // Populate form with existing business data
          setFormData({
            name: businessData.name || '',
            description: businessData.description || '',
            shortDescription: businessData.shortDescription || '',
            category: businessData.category || '',
            yearFounded: businessData.yearFounded?.toString() || '',
            employeeCount: businessData.employeeCount?.toString() || '',
            businessType: businessData.businessType || '',
            email: businessData.email || '',
            phone: businessData.phone || '',
            website: businessData.website || '',
          });
          
          // Set logo and banner previews if they exist
          if (businessData.logoUrl) {
            setLogoPreview(businessData.logoUrl);
          }

          if (businessData.bannerUrl) {
            setBannerPreview(businessData.bannerUrl);
          }
          
          // Set tags if they exist
          if (businessData.tags && businessData.tags.length > 0) {
            setSelectedTags(businessData.tags);
          }
          
          // Initialize available tags based on category
          if (businessData.category) {
            updateAvailableTags(businessData.category);
          }
        } else {
          setError('Business profile not found.');
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

  // Function to update available tags based on selected category
  const updateAvailableTags = (categoryValue: string) => {
    if (categoryValue && TAGS[categoryValue as TagCategory]) {
      const categoryTags = TAGS[categoryValue as TagCategory] || [];
      setAvailableTags(categoryTags.map(tag => ({
        value: tag.value,
        label: tag.label
      })));
    } else {
      // If no category is selected or the category doesn't have tags, show all tags
      setAvailableTags(
        Object.values(TAGS).flatMap(tagGroup => 
          tagGroup.map(tag => ({
            value: tag.value,
            label: tag.label
          }))
        )
      );
    }
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for category changes to update available tags
    if (name === 'category' && value !== formData.category) {
      updateAvailableTags(value);
      
      // Clear selected tags when changing category to avoid tag mismatch
      setSelectedTags([]);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle tag selection/deselection
  const handleTagToggle = (tagValue: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tagValue)) {
        // Remove tag if already selected
        return prevTags.filter(tag => tag !== tagValue);
      } else {
        // Add tag if not already selected (max 3 tags)
        return prevTags.length < 3 ? [...prevTags, tagValue] : prevTags;
      }
    });
  };

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Business name is required');
      return;
    }

    setSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload files and get URLs if they have been changed
      let logoUrl = business?.logoUrl || '';
      let bannerUrl = business?.bannerUrl || '';
      
      // Upload new logo if selected
      if (logoFile) {
        try {
          const imageUrl = await uploadBusinessLogo(
            businessId!,
            logoFile,
            (progress) => {
              setUploadProgress(Math.round(progress * 0.5)); // First 50% for logo
            }
          );
          logoUrl = imageUrl;
        } catch (error) {
          console.error('Error uploading logo:', error);
          showToast('Failed to upload logo image', 'error');
        }
      }
      
      // Upload new banner if selected
      if (bannerFile) {
        try {
          const imageUrl = await uploadBusinessBanner(
            businessId!,
            bannerFile,
            (progress) => {
              setUploadProgress(50 + Math.round(progress * 0.5)); // Second 50% for banner
            }
          );
          bannerUrl = imageUrl;
        } catch (error) {
          console.error('Error uploading banner:', error);
          showToast('Failed to upload banner image', 'error');
        }
      }

      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        category: formData.category,
        tags: selectedTags,
        yearFounded: formData.yearFounded ? parseInt(formData.yearFounded) : undefined,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
        businessType: formData.businessType,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        logoUrl,
        bannerUrl
      };

      // Update business in Firestore
      await updateBusiness(businessId!, updateData);

      // Show success message
      showToast('Business profile updated successfully!', 'success');

      // Reset file inputs
      if (logoUploadRef.current) {
        logoUploadRef.current.reset();
      }
      if (bannerUploadRef.current) {
        bannerUploadRef.current.reset();
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating business profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Edit Business Profile">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth requireBusiness>
      <DashboardLayout title="Edit Business Profile">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Business Profile</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your business information, logo, and banner image
              </p>
            </div>

            {/* Logo and Banner Upload Section */}
            <div className="space-y-6 border-b border-gray-200 pb-6">
              <h3 className="text-md font-medium text-gray-900">Business Images</h3>
              
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Logo
                </label>
                <div className="flex items-start gap-4">
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
                  
                  <div className="flex-1">
                    <FileUpload
                      accept="image/*"
                      maxSize={2} // 2MB max
                      multiple={false}
                      onUpload={handleLogoUpload}
                      ref={logoUploadRef}
                      hint="Upload a square image (recommended size: 500x500px). Max 2MB."
                    />
                  </div>
                </div>
              </div>
              
              {/* Banner Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Banner Image
                </label>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
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
                    maxSize={5} // 5MB max
                    multiple={false}
                    onUpload={handleBannerUpload}
                    ref={bannerUploadRef}
                    hint="Upload a wide banner image (recommended size: 1200x300px). Max 5MB."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Basic Information */}
              <h3 className="text-md font-medium text-gray-900">Business Details</h3>
              <Input
                label="Business Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <Textarea
                label="Business Description"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                fullWidth
                hint="Provide a comprehensive description of your business"
              />

              <Textarea
                label="Short Description"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                fullWidth
                hint="A brief summary that will appear in listings"
              />

              <Select
                label="Business Category"
                id="category"
                name="category"
                options={CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))}
                value={formData.category}
                onChange={handleChange}
                fullWidth
              />
              
              {/* Tags Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Tags (Select up to 3)
                </label>
                <div className="mt-2">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedTags.map(tag => {
                      // Find the tag label
                      const tagObject = availableTags.find(t => t.value === tag);
                      const tagLabel = tagObject ? tagObject.label : tag;
                      
                      return (
                        <div 
                          key={tag} 
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          <span>{tagLabel}</span>
                          <button 
                            type="button" 
                            onClick={() => handleTagToggle(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path 
                                fillRule="evenodd" 
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  {formData.category ? (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableTags.map(tag => (
                        <div key={tag.value} className="flex items-center">
                          <input
                            id={`tag-${tag.value}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedTags.includes(tag.value)}
                            onChange={() => handleTagToggle(tag.value)}
                            disabled={!selectedTags.includes(tag.value) && selectedTags.length >= 3}
                          />
                          <label 
                            htmlFor={`tag-${tag.value}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {tag.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Please select a category first to see available tags
                    </p>
                  )}
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Tags help potential partners find your business more easily. 
                    Select up to 3 tags that best describe your business.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Business Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <Input
                    label="Business Phone"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                  />
                </div>
                
                <Input
                  label="Website"
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  fullWidth
                  className="mt-4"
                  placeholder="https://"
                />
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                <Input
                  label="Year Founded"
                  id="yearFounded"
                  name="yearFounded"
                  type="number"
                  value={formData.yearFounded}
                  onChange={handleChange}
                  fullWidth
                  min={1800}
                  max={new Date().getFullYear()}
                />
                
                <Input
                  label="Number of Employees"
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  fullWidth
                  min={0}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md">
                <p>{error}</p>
              </div>
            )}

            {/* Upload Progress */}
            {submitting && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-center text-gray-500">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit" 
                isLoading={submitting}
                disabled={submitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </DashboardLayout>
    </AuthGuard>
  );
}