'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBusiness } from '@/lib/firebase/db';
import { Business } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Card from '@/components/common/Card';
import PostForm from '@/components/posts/PostForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/contexts/ToastContext';

export default function NewPostPage() {
  const { businessId } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const businessData = await getBusiness(businessId);
        if (businessData) {
          setBusiness(businessData);
          
          // Check if profile is complete enough to create posts
          if (businessData.profileCompletionStatus.completionPercentage < 50) {
            setError('Your business profile must be at least 50% complete to create posts. Please complete your profile first.');
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

  // Handle successful post creation
  const handlePostSuccess = () => {
    showToast('Post created successfully!', 'success');
    router.push('/dashboard/posts');
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/dashboard/posts');
  };

  if (loading) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Create New Post">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Create New Post">
          <Card>
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Cannot Create Post</h3>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </Card>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth requireBusiness>
      <DashboardLayout title="Create New Post">
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">Create a New Post</h2>
            <p className="mt-1 text-sm text-gray-500">
              Share updates, news, or announcements with other businesses and users.
            </p>
          </div>
          
          {business && (
            <PostForm
              businessId={business.id}
              onSuccess={handlePostSuccess}
              onCancel={handleCancel}
            />
          )}
        </Card>
      </DashboardLayout>
    </AuthGuard>
  );
}