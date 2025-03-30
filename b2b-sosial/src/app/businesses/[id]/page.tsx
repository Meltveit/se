// src/app/businesses/[id]/page.tsx
import { Metadata } from 'next';
import { getBusiness } from '@/lib/firebase/db';
import { notFound } from 'next/navigation';
import BusinessDetailClient from './BusinessDetailClient';

// Definer en enkel type for params (ikke en Promise)
type Params = {
  id: string;
}

// Korrekt inline typing for generateMetadata
export async function generateMetadata({
  params
}: {
  params: Params;
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
      // resten av metadataen...
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Business Profile | B2B Social',
      description: 'View business details and profile information.',
    };
  }
}

// Korrekt inline typing for page component
export default async function BusinessDetailPage({
  params
}: {
  params: Params;
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