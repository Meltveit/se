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
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProfileCompletionSteps from '@/components/profile/ProfileCompletionSteps';

// Country options (simplified list)
const countryOptions = [
  { value: 'no', label: 'Norway' },
  { value: 'se', label: 'Sweden' },
  { value: 'dk', label: 'Denmark' },
  { value: 'fi', label: 'Finland' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
];

// Region options by country (simplified)
const regionOptions: Record<string, Array<{ value: string; label: string }>> = {
  'no': [
    { value: 'oslo', label: 'Oslo' },
    { value: 'viken', label: 'Viken' },
    { value: 'innlandet', label: 'Innlandet' },
    { value: 'vestfold-telemark', label: 'Vestfold og Telemark' },
    { value: 'agder', label: 'Agder' },
    { value: 'rogaland', label: 'Rogaland' },
    { value: 'vestland', label: 'Vestland' },
    { value: 'more-romsdal', label: 'Møre og Romsdal' },
    { value: 'trondelag', label: 'Trøndelag' },
    { value: 'nordland', label: 'Nordland' },
    { value: 'troms-finnmark', label: 'Troms og Finnmark' },
  ],
  'se': [
    { value: 'stockholm', label: 'Stockholm' },
    { value: 'uppsala', label: 'Uppsala' },
    { value: 'skane', label: 'Skåne' },
    { value: 'vastra-gotaland', label: 'Västra Götaland' },
  ],
  'dk': [
    { value: 'hovedstaden', label: 'Hovedstaden' },
    { value: 'sjaelland', label: 'Sjælland' },
    { value: 'syddanmark', label: 'Syddanmark' },
    { value: 'midtjylland', label: 'Midtjylland' },
    { value: 'nordjylland', label: 'Nordjylland' },
  ],
};

export default function ContactDetailsPage() {
  const { businessId } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    website: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    region: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    contactPersonPosition: '',
  });

  // Available regions based on selected country
  const [availableRegions, setAvailableRegions] = useState<Array<{ value: string; label: string }>>([]);

  // Update available regions when country changes
  useEffect(() => {
    if (formData.country && regionOptions[formData.country]) {
      setAvailableRegions(regionOptions[formData.country]);
      
      // If the current region is not in the new country, reset it
      if (formData.region && !regionOptions[formData.country].find(r => r.value === formData.region)) {
        setFormData(prev => ({ ...prev, region: '' }));
      }
    } else {
      setAvailableRegions([]);
      setFormData(prev => ({ ...prev, region: '' }));
    }
  }, [formData.country]);

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
            email: businessData.email || '',
            phone: businessData.phone || '',
            website: businessData.website || '',
            address: businessData.address || '',
            postalCode: businessData.postalCode || '',
            city: businessData.city || '',
            country: businessData.country || '',
            region: businessData.region || '',
            contactPersonName: businessData.contactPerson?.name || '',
            contactPersonEmail: businessData.contactPerson?.email || '',
            contactPersonPhone: businessData.contactPerson?.phone || '',
            contactPersonPosition: businessData.contactPerson?.position || '',
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!formData.email.trim()) {
      setError('Business email is required');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Update business data
      const updateData = {
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
        region: formData.region,
        contactPerson: {
          name: formData.contactPersonName,
          email: formData.contactPersonEmail,
          phone: formData.contactPersonPhone,
          position: formData.contactPersonPosition,
        },
      };
      
      await updateBusiness(businessId, updateData);
      
      // Update completion status if needed
      if (!business.profileCompletionStatus.contactDetails) {
        await updateBusinessProfileCompletion(businessId, 'contactDetails', true);
      }
      
      showToast('Contact details saved successfully!', 'success');
      
      // Redirect to the next step
      router.push('/dashboard/profile/media');
    } catch (err) {
      console.error('Error updating business:', err);
      setError('Failed to save contact details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Contact Details">
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
        <DashboardLayout title="Contact Details">
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
      <DashboardLayout title="Contact Details">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Business Contact Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Provide contact details for your business so potential partners can reach you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Business Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                placeholder="https://"
                fullWidth
              />

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">Business Address</h3>
                
                <Input
                  label="Street Address"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Input
                    label="Postal Code"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <Input
                    label="City"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <Select
                    label="Country"
                    id="country"
                    name="country"
                    options={countryOptions}
                    value={formData.country}
                    onChange={handleChange}
                    fullWidth
                  />
                </div>
                
                {availableRegions.length > 0 && (
                  <div className="mt-4">
                    <Select
                      label="Region/State"
                      id="region"
                      name="region"
                      options={availableRegions}
                      value={formData.region}
                      onChange={handleChange}
                      fullWidth
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">Primary Contact Person</h3>
                <p className="text-sm text-gray-500 mb-4">
                  This information will be displayed on your business profile.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Name"
                    id="contactPersonName"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <Input
                    label="Position/Title"
                    id="contactPersonPosition"
                    name="contactPersonPosition"
                    value={formData.contactPersonPosition}
                    onChange={handleChange}
                    fullWidth
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Contact Email"
                    id="contactPersonEmail"
                    name="contactPersonEmail"
                    type="email"
                    value={formData.contactPersonEmail}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <Input
                    label="Contact Phone"
                    id="contactPersonPhone"
                    name="contactPersonPhone"
                    type="tel"
                    value={formData.contactPersonPhone}
                    onChange={handleChange}
                    fullWidth
                  />
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
                onClick={() => router.push('/dashboard/profile/basic-info')}
              >
                Back
              </Button>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Save & Exit
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
        <ProfileCompletionSteps currentStep={2} />
      </DashboardLayout>
    </AuthGuard>
  );
}