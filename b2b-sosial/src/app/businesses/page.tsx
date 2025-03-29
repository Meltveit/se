// src/app/businesses/page.tsx
import { Metadata } from 'next';
import { getBusinesses, getCategories, getTags } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import BusinessCard from '@/components/businesses/BusinessCard';
import BusinessFilters from '@/components/businesses/BusinessFilters';
import Button from '@/components/common/Button';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';

// Mock data for countries and regions 
const countries = [
  { code: 'no', name: 'Norway', flag: '🇳🇴', phoneCode: '+47', currencies: ['NOK'], languages: ['no'], hasRegions: true },
  { code: 'se', name: 'Sweden', flag: '🇸🇪', phoneCode: '+46', currencies: ['SEK'], languages: ['sv'], hasRegions: true },
  // Add other countries
];

const regions = [
  { code: 'oslo', name: 'Oslo', countryCode: 'no' },
  { code: 'stockholm', name: 'Stockholm', countryCode: 'se' },
  // Add other regions
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Business Directory | B2B Social',
    description: 'Find and connect with businesses across various industries and regions.',
    openGraph: {
      title: 'Business Directory | B2B Social',
      description: 'Discover and network with businesses that match your interests.',
    },
  };
}

export default async function BusinessesPage() {
  try {
    // Fetch initial data
    const [categoriesData, tagsData, businessesData] = await Promise.all([
      getCategories(),
      getTags(),
      getBusinesses(12) // Initial businesses load
    ]);

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Businesses Directory</h1>
          </div>
          
          <div className="lg:flex lg:gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4 mb-6 lg:mb-0 space-y-6">
              <BusinessFilters
                categories={categoriesData}
                tags={tagsData}
                countries={countries}
                regions={regions}
                selectedCategory={undefined}
                selectedTags={[]}
                selectedCountry={undefined}
                selectedRegion={undefined}
                onFilterChange={() => {}}
              />
              
              <SubtleAdPlacement type="business-list-sidebar" />
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessesData.businesses.map((business) => (
                  <BusinessCard 
                    key={business.id} 
                    business={business} 
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {businessesData.businesses.length === 12 && (
                <div className="mt-8 text-center">
                  <Button variant="outline">
                    Load More Businesses
                  </Button>
                </div>
              )}
              
              <SubtleAdPlacement type="content-bottom" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Error Loading Businesses
            </h2>
            <p className="text-gray-500 mb-6">
              Failed to load businesses. Please try again later.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }
}