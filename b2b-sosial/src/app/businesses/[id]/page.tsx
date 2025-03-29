import { Metadata } from 'next';
import { getBusiness } from '@/lib/firebase/db';
import { notFound } from 'next/navigation';
import BusinessDetailClient from './BusinessDetailClient';

// Type definition for this page's route params
interface PageParams {
  id: string;
}

export async function generateMetadata({ 
  params 
}: { 
  params: PageParams 
}): Promise<Metadata> {
  try {
    const business = await getBusiness(params.id);
    
    if (!business) {
      return {
        title: 'Business Not Found | B2B Social',
        description: 'The requested business could not be found.'
      };
    }
    
    return {
      title: `${business.name} | B2B Social`,
      description: business.shortDescription || business.description || 'View business profile and details.',
      openGraph: {
        title: business.name,
        description: business.shortDescription || business.description || 'Business profile on B2B Social',
        images: business.logoUrl ? [{ url: business.logoUrl }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Business Profile | B2B Social',
      description: 'View business details and profile information.',
    };
  }
}

export default async function BusinessDetailPage({ 
  params 
}: { 
  params: PageParams 
}) {
  try {
    const business = await getBusiness(params.id);
    
    if (!business) {
      notFound();
    }
    
    return <BusinessDetailClient initialBusiness={business} />;
  } catch (error) {
    console.error('Error loading business:', error);
    throw error; // This will be caught by the closest error boundary
  }
}