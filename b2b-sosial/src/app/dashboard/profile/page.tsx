'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateBusiness } from '@/lib/firebase/db';
import { useToast } from '@/contexts/ToastContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import ProfileCompletionSteps from '@/components/profile/ProfileCompletionSteps';

// Industry options (can be moved to a separate file if needed)
const industryOptions = [
  { value: 'technology', label: 'Technology & IT' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'education', label: 'Education & Training' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing & Industry' },
  { value: 'services', label: 'Professional Services' },
  { value: 'construction', label: 'Construction & Real Estate' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'transport', label: 'Transportation & Logistics' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'agriculture', label: 'Agriculture & Farming' },
  { value: 'nonprofit', label: 'Non-profit & NGO' },
  { value: 'other', label: 'Other' },
];

export default function BusinessProfileEditPage() {
  const { business } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // Initialize form state with existing business data
  const [formData, setFormData] = useState({
    name: business?.name || '',
    description: business?.description || '',
    shortDescription: business?.shortDescription || '',
    category: business?.category || '',
    yearFounded: business?.yearFounded?.toString() || '',
    employeeCount: business?.employeeCount?.toString() || '',
    website: business?.website || '',
    email: business?.email || '',
    phone: business?.phone || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) return;

    // Basic validation
    if (!formData.name.trim()) {
      setError('Business name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        category: formData.category,
        yearFounded: formData.yearFounded ? parseInt(formData.yearFounded) : undefined,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
        website: formData.website.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      // Update business in Firestore
      await updateBusiness(business.id, updateData);

      // Show success toast
      showToast('Business profile updated successfully!', 'success');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating business profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no business found, show error
  if (!business) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Edit Profile">
          <div className="text-center py-12">
            <p className="text-red-500">Business profile not found.</p>
            <Button 
              onClick={() => router.push('/dashboard')} 
              variant="outline" 
              className="mt-4"
            >
              Back to Dashboard
            </Button>
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
              <h2 className="text-lg font-medium text-gray-900">Business Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your business profile information
              </p>
            </div>

            <div className="space-y-4">
              {/* Basic Information */}
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
                options={industryOptions}
                value={formData.category}
                onChange={handleChange}
                fullWidth
              />

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
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Progress Indicator */}
        <ProfileCompletionSteps currentStep={1} />
      </DashboardLayout>
    </AuthGuard>
  );
}