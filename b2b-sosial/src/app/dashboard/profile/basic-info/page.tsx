'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBusiness, updateBusiness, updateBusinessProfileCompletion } from '@/lib/firebase/db';
import { useToast } from '@/contexts/ToastContext';
import { Business } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function BasicInfoPage() {
  const { businessId } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state (removed category)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    yearFounded: '',
    employeeCount: '',
    businessType: '',
  });

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const businessData = await getBusiness(businessId);
        if (businessData) {
          setBusiness(businessData);
          // Initialize form with existing data
          setFormData({
            name: businessData.name || '',
            description: businessData.description || '',
            shortDescription: businessData.shortDescription || '',
            yearFounded: businessData.yearFounded?.toString() || '',
            employeeCount: businessData.employeeCount?.toString() || '',
            businessType: businessData.businessType || '',
          });
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

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId || !business) return;
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Business name is required');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Update business data
      const updateData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        yearFounded: formData.yearFounded ? parseInt(formData.yearFounded) : undefined,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
        businessType: formData.businessType,
      };
      
      await updateBusiness(businessId, updateData);
      
      // Update completion status if needed
      if (!business.profileCompletionStatus.basicInfo) {
        await updateBusinessProfileCompletion(businessId, 'basicInfo', true);
      }
      
      showToast('Basic information saved successfully!', 'success');
      
      // Redirect to the next step
      router.push('/dashboard/profile/contact');
    } catch (err) {
      console.error('Error updating business:', err);
      setError('Failed to save basic information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Basic Information">
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
        <DashboardLayout title="Basic Information">
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
      <DashboardLayout title="Basic Information">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Business Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the basic details about your business.
              </p>
            </div>

            <div className="space-y-4">
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
                hint="Provide a comprehensive description of your business, services, and value proposition."
              />

              <Textarea
                label="Short Description"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                fullWidth
                hint="A brief one or two-sentence summary of your business. This will appear in search results and listings."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  hint={`Enter a year between 1800 and ${new Date().getFullYear()}`}
                />
                
                <Input
                  label="Number of Employees"
                  id="employeeCount"
                  name="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  fullWidth
                  min={1}
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

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              
              <div className="flex space-x-3">
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
        
        {/* Progress Indicator */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm text-gray-500">Step 1 of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Basic Info</span>
            <span>Contact</span>
            <span>Media</span>
            <span>Categories</span>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}