'use client';

import { Business } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import BusinessHeader from '@/components/businesses/BusinessHeader';
import BusinessDetails from '@/components/businesses/BusinessDetails';
import BusinessContact from '@/components/businesses/BusinessContact';
import BusinessGallery from '@/components/businesses/BusinessGallery';
import BusinessPostsList from '@/components/businesses/BusinessPostsList';

interface BusinessDetailClientProps {
  initialBusiness: Business;
}

export default function BusinessDetailClient({ 
  initialBusiness 
}: BusinessDetailClientProps) {
  return (
    <MainLayout>
      <BusinessHeader business={initialBusiness} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BusinessDetails business={initialBusiness} />
            
            {initialBusiness.gallery && initialBusiness.gallery.length > 0 && (
              <BusinessGallery business={initialBusiness} />
            )}
            
            {initialBusiness.profileCompletionStatus.completionPercentage >= 50 && (
              <BusinessPostsList business={initialBusiness} limit={5} showViewAll />
            )}
          </div>
          
          <div>
            <BusinessContact 
              business={initialBusiness} 
              onSendMessage={() => {}} 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}