// src/app/businesses/[id]/page.tsx
import { Metadata } from 'next';
import { getBusiness, getBusinesses } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import BusinessHeader from '@/components/businesses/BusinessHeader';
import BusinessDetails from '@/components/businesses/BusinessDetails';
import BusinessContact from '@/components/businesses/BusinessContact';
import BusinessGallery from '@/components/businesses/BusinessGallery';
import BusinessPostsList from '@/components/businesses/BusinessPostsList';

export async function generateStaticParams() {
  try {
    const result = await getBusinesses(100); // Fetch up to 100 businesses
    return result.businesses.map((business) => ({
      id: business.id,
    }));
  } catch (error) {
    console.error('Error fetching businesses for static generation:', error);
    return [];
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  try {
    const business = await getBusiness(params.id);
    
    if (!business) {
      return {
        title: 'Business Not Found',
        description: 'The requested business profile could not be found.'
      };
    }
    
    return {
      title: business.name,
      description: business.shortDescription || business.description,
      openGraph: {
        title: business.name,
        description: business.shortDescription || business.description,
        images: business.logoUrl ? [{ url: business.logoUrl }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Error Loading Business',
      description: 'An error occurred while loading the business profile.'
    };
  }
}

export default async function BusinessProfilePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  try {
    const business = await getBusiness(params.id);
    
    if (!business) {
      return (
        <MainLayout>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Business Not Found
              </h1>
              <p className="text-gray-500 mb-6">
                The business profile you are looking for does not exist or has been removed.
              </p>
            </div>
          </div>
        </MainLayout>
      );
    }

    return (
      <MainLayout>
        <BusinessHeader business={business} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <BusinessDetails business={business} />
              
              {business.gallery && business.gallery.length > 0 && (
                <BusinessGallery business={business} />
              )}
              
              {business.profileCompletionStatus.completionPercentage >= 50 && (
                <BusinessPostsList business={business} limit={5} showViewAll />
              )}
            </div>
            
            <div>
              <BusinessContact 
                business={business} 
                onSendMessage={() => {}} 
              />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Business Profile
            </h1>
            <p className="text-gray-500 mb-6">
              An error occurred while loading the business profile. Please try again later.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }
}