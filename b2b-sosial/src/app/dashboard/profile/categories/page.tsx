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
  
  // Fetch business data, categories, and tags
  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const [businessData, categoriesData, tagsData] = await Promise.all([
          getBusiness(businessId),
          getCategories(),
          getTags()
        ]);
        
        if (businessData) {
          setBusiness(businessData);
          // Set existing category and tags if available
          if (businessData.category) setSelectedCategory(businessData.category);
          if (businessData.tags && businessData.tags.length > 0) {
            setSelectedTags(businessData.tags.slice(0, 3));
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
  }, [businessId]);

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tagId]);
      } else {
        showToast('You can select up to 3 tags', 'error');
      }
    }
  };

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

              {/* Tags Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Tags ({selectedTags.length}/3)
                </label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagSelect(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag.id)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      disabled={selectedTags.length >= 3 && !selectedTags.includes(tag.id)}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                
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
                disabled={submitting}
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