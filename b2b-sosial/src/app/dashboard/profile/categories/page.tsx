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
  const [tagInput, setTagInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  
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
  }, [businessId]);

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      if (selectedTags.length < 10) {
        setSelectedTags([...selectedTags, tagId]);
      } else {
        showToast('You can select up to 10 tags', 'error');
      }
    }
  };

  // Handle custom tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addCustomTag();
    }
  };

  const addCustomTag = () => {
    const tag = tagInput.trim();
    if (tag && !customTags.includes(tag) && customTags.length + selectedTags.length < 10) {
      setCustomTags([...customTags, tag]);
      setTagInput('');
    } else if (customTags.length + selectedTags.length >= 10) {
      showToast('You can have up to 10 tags total', 'error');
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
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
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Update business data
      const allTags = [...selectedTags, ...customTags];
      
      const updateData = {
        category: selectedCategory,
        tags: allTags,
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
                Select a category and tags that best represent your business. This helps others find you.
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
                  Business Tags ({selectedTags.length + customTags.length}/10)
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
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                
                {/* Custom Tags */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Custom Tags
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="Add a custom tag and press Enter"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={customTags.length + selectedTags.length >= 10}
                    />
                    <Button
                      type="button"
                      onClick={addCustomTag}
                      className="ml-2"
                      disabled={!tagInput.trim() || customTags.length + selectedTags.length >= 10}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Press Enter or click Add to add a custom tag
                  </p>
                  
                  {customTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {customTags.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeCustomTag(tag)}
                            className="ml-2 text-green-700 hover:text-green-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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