// src/app/dashboard/profile/categories/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBusiness, updateBusiness, updateBusinessProfileCompletion } from '@/lib/firebase/db';
import { getCategories, getTags } from '@/lib/firebase/db';
import { useToast } from '@/contexts/ToastContext';
import { Business, Category, Tag } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProfileCompletionSteps from '@/components/profile/ProfileCompletionSteps';
import Select from '@/components/common/Select';
import SearchableSelect from '@/components/common/SearchableSelect';
import { populateCategoriesAndTags, debugCategoriesAndTags } from '@/utils/categoryPopulateUtil';

export default function CategoriesAndTagsPage() {
  const { businessId } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Categories and Tags
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dataPopulated, setDataPopulated] = useState(false);
  
  // First, make sure categories and tags exist in the database
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Debug current state
        const debugResult = await debugCategoriesAndTags();
        
        // If no categories or tags, populate them
        if (debugResult.categoriesCount === 0 || debugResult.tagsCount === 0) {
          console.log('Need to populate categories and/or tags');
          const result = await populateCategoriesAndTags();
          if (result.success) {
            showToast('Categories and tags data initialized successfully', 'success');
            setDataPopulated(true);
          } else {
            console.error('Failed to populate data:', result.message);
            showToast('Error initializing data. Please refresh and try again.', 'error');
          }
        } else {
          console.log('Categories and tags already exist in database');
          setDataPopulated(true);
        }
      } catch (err) {
        console.error('Error initializing data:', err);
      }
    };

    initializeData();
  }, [showToast]);
  
  // Fetch business data, categories, and tags
  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || !dataPopulated) return;
      
      try {
        setLoading(true);
        const [businessData, categoriesData, tagsData] = await Promise.all([
          getBusiness(businessId),
          getCategories(),
          getTags()
        ]);
        
        // Debug what we got from the database
        console.log('Fetched categories:', categoriesData);
        console.log('Fetched tags:', tagsData);
        
        if (businessData) {
          setBusiness(businessData);
          // Set existing category and tags if available
          if (businessData.category) {
            console.log('Setting selected category:', businessData.category);
            setSelectedCategory(businessData.category);
          }
          if (businessData.tags && businessData.tags.length > 0) {
            console.log('Setting selected tags:', businessData.tags);
            setSelectedTags(businessData.tags);
          }
        } else {
          setError('Business not found. Please contact support.');
        }
        
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, dataPopulated]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId || !business) return;
    
    // Validate form
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }
    
    if (selectedTags.length === 0) {
      setError('Please select at least one tag');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Update business data
      const updateData = {
        category: selectedCategory,
        tags: selectedTags,
      };
      
      await updateBusiness(businessId, updateData);
      
      // Update completion status if needed
      if (!business.profileCompletionStatus.categoriesAndTags) {
        await updateBusinessProfileCompletion(businessId, 'categoriesAndTags', true);
      }
      
      showToast('Categories and tags saved successfully!', 'success');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating business:', err);
      setError('Failed to save categories and tags. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Categories and Tags">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  // Debug what category options we have to show in the dropdown
  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));
  console.log('Category options:', categoryOptions);
  
  // Debug what tag options we have to show
  const tagOptions = tags.map(tag => ({ value: tag.id, label: tag.name }));
  console.log('Tag options:', tagOptions);

  return (
    <AuthGuard requireAuth requireBusiness>
      <DashboardLayout title="Categories and Tags">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Business Categories and Tags</h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a category and up to 3 tags that best represent your business. This helps others find you.
              </p>
            </div>

            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Business Category
                </label>
                <Select
                  id="category"
                  name="category"
                  options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  fullWidth
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Choose the category that best represents your main business activity.
                </p>
              </div>

              {/* Tags Selection - Using SearchableSelect */}
              <div>
                <SearchableSelect
                  label="Business Tags"
                  options={tags.map(tag => ({ value: tag.id, label: tag.name }))}
                  selectedValues={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Search for tags..."
                  maxSelections={3}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Select up to 3 tags that best describe your business. These tags help potential partners and clients find you.
                </p>
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

            {(!categories || categories.length === 0) && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      No categories available. Please refresh the page or contact support.
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/profile/media')}
              >
                Back
              </Button>
              
              <Button
                type="submit"
                isLoading={submitting}
                disabled={submitting || !categories || categories.length === 0}
              >
                Complete Profile
              </Button>
            </div>
          </form>
        </Card>
        
        {/* Profile Completion Steps Component */}
        <ProfileCompletionSteps currentStep={4} />
      </DashboardLayout>
    </AuthGuard>
  );
}