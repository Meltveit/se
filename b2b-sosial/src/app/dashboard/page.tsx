'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBusiness } from '@/lib/firebase/db';
import { Business } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import QuickActions from '@/components/dashboard/QuickActions';
import BusinessPostsList from '@/components/businesses/BusinessPostsList';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardPage() {
  const { user, userProfile, businessId, loading: authLoading } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user has a verified email
  const isEmailVerified = user?.emailVerified;

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const businessData = await getBusiness(businessId);
        if (businessData) {
          setBusiness(businessData);
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

    if (businessId) {
      fetchBusinessData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [businessId, authLoading]);

  // Handle loading state
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Handle errors
  if (error || !businessId) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-lg font-medium text-red-600">
            {error || 'No business found for your account'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {error 
              ? 'Please try refreshing the page or contact our support team.'
              : 'You need to register a business to access the dashboard.'}
          </p>
          <div className="mt-4">
            <button
              onClick={() => router.push("/register/business/index.html")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register a Business
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!business) return null;

  // Check if the user is a new user (for welcome message)
  const isNewUser = business.profileCompletionStatus.completionPercentage <= 25;

  return (
    <AuthGuard requireAuth requireBusiness>
      <DashboardLayout title="Dashboard">
        <div className="space-y-6">
          {/* Email Verification Warning */}
          {!isEmailVerified && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please verify your email address to unlock all features.
                    <button
                      className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                      onClick={() => router.push("/register/business/verify/index.html")}
                    >
                      Resend verification email
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Banner */}
          <WelcomeBanner 
            user={userProfile!}
            business={business} 
            isNewUser={isNewUser}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <QuickActions business={business} />

              {/* Posts (if profile is complete enough) */}
              {business.profileCompletionStatus.completionPercentage >= 50 && (
                <BusinessPostsList business={business} limit={3} showViewAll />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Completion Card */}
              <ProfileCompletionCard business={business} />

              {/* Stats Card */}
              <Card title="Business Stats">
                <div className="divide-y divide-gray-200">
                  <div className="py-3 flex justify-between">
                    <span className="text-sm text-gray-500">Profile Views</span>
                    <span className="text-sm font-medium">{business.viewCount || 0}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-sm text-gray-500">Followers</span>
                    <span className="text-sm font-medium">{business.followerCount || 0}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-sm text-gray-500">Posts</span>
                    <span className="text-sm font-medium">0</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}