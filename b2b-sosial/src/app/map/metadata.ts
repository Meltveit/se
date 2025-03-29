import { Metadata } from 'next';
import { getBusinesses } from '@/lib/firebase/db';

export async function generateMapMetadata(): Promise<Metadata> {
  try {
    // Fetch some businesses to potentially use in metadata
    const result = await getBusinesses(5);
    const businesses = result.businesses;

    // Generate a dynamic description
    const businessCount = businesses.length;
    const description = businessCount > 0
      ? `Explore an interactive map of ${businessCount} businesses across various locations and industries.`
      : 'Discover businesses on an interactive map. Connect with local and global companies.';

    return {
      title: 'Business Map | B2B Social',
      description: description,
      openGraph: {
        title: 'Business Map | B2B Social',
        description: description,
        type: 'website',
        images: businesses.length > 0 && businesses[0].logoUrl 
          ? [{ url: businesses[0].logoUrl }] 
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Business Map | B2B Social',
        description: description,
        images: businesses.length > 0 && businesses[0].logoUrl 
          ? [businesses[0].logoUrl] 
          : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating map metadata:', error);
    
    return {
      title: 'Business Map | B2B Social',
      description: 'Explore businesses on an interactive map. Find local connections and opportunities.',
      openGraph: {
        title: 'Business Map | B2B Social',
        description: 'Discover businesses near you or in specific regions.',
      },
    };
  }
}