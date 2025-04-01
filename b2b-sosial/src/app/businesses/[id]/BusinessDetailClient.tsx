'use client';

import { Business } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import BusinessHeader from '@/components/businesses/BusinessHeader';
import BusinessDetails from '@/components/businesses/BusinessDetails';
import BusinessContact from '@/components/businesses/BusinessContact';
import BusinessGallery from '@/components/businesses/BusinessGallery';
import BusinessPostsList from '@/components/businesses/BusinessPostsList';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';

interface BusinessDetailClientProps {
  initialBusiness: Business | null;
}

export default function BusinessDetailClient({
  initialBusiness,
}: BusinessDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!initialBusiness) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Business Not Found
            </h2>
            <p className="text-gray-500 mb-6">
              The business you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => router.push('/businesses')}>
              Browse Businesses
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const someQuery = searchParams.get('key'); // Eksempel, fjern eller tilpass etter behov

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