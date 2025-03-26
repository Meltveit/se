'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getBusiness } from '@/lib/firebase/db';
import { Business } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import BusinessHeader from '@/components/businesses/BusinessHeader';
import BusinessDetails from '@/components/businesses/BusinessDetails';
import BusinessContact from '@/components/businesses/BusinessContact';
import BusinessGallery from '@/components/businesses/BusinessGallery';
import BusinessPostsList from '@/components/businesses/BusinessPostsList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

export default function BusinessProfilePage() {
  const params = useParams();
  const businessId = params?.id as string;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const businessData = await getBusiness(businessId);
        if (businessData) {
          setBusiness(businessData);
          // In a real app, you would check if the current user is following this business
          setIsFollowing(false);
        } else {
          setError('Business not found.');
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

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    if (!business) return;
    
    setIsFollowLoading(true);
    try {
      // In a real app, you would implement the actual follow/unfollow API call here
      // For now, we'll just toggle the state after a short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    setShowMessageModal(true);
    // In a real app, you would show a message modal component here
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error || !business) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {error || 'Business not found'}
            </h1>
            <p className="text-gray-500 mb-6">
              {error ? 'Please try again later.' : 'The business you are looking for does not exist or has been removed.'}
            </p>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Business Header (Banner, Logo, Name, etc.) */}
      <BusinessHeader 
        business={business} 
        isFollowing={isFollowing}
        onFollow={handleFollowToggle}
        isLoading={isFollowLoading}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (About and Posts) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <BusinessDetails business={business} />
            
            {/* Gallery (if exists) */}
            {business.gallery && business.gallery.length > 0 && (
              <BusinessGallery business={business} />
            )}
            
            {/* Posts Section */}
            {business.profileCompletionStatus.completionPercentage >= 50 && (
              <BusinessPostsList business={business} limit={5} showViewAll />
            )}
          </div>
          
          {/* Right Column (Contact Information) */}
          <div>
            <BusinessContact business={business} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
      
      {/* Message Modal (would be implemented as a separate component) */}
      {/* {showMessageModal && (
        <MessageModal 
          business={business}
          onClose={() => setShowMessageModal(false)}
        />
      )} */}
    </MainLayout>
  );
}