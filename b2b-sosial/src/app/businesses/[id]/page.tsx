import { Metadata } from 'next';
import { where, QueryConstraint } from 'firebase/firestore';
import { getBusinesses, getCategories, getTags } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import BusinessCard from '@/components/businesses/BusinessCard';
import BusinessFilters from '@/components/businesses/BusinessFilters';
import Button from '@/components/common/Button';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';
import { COUNTRIES } from '@/lib/geographic-data';
import { Category, Tag, Country } from '@/types';

// Define the shape of the page's props
type PageProps = {
  searchParams?: { 
    category?: string; 
    tag?: string; 
    country?: string; 
  };
};

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

export default async function BusinessesPage({ searchParams }: PageProps) {
  try {
    // Prepare query constraints
    const queryConstraints: QueryConstraint[] = [];
    
    if (searchParams) {
      if (searchParams.category) {
        queryConstraints.push(where('category', '==', searchParams.category));
      }
      if (searchParams.country) {
        queryConstraints.push(where('country', '==', searchParams.country));
      }
      if (searchParams.tag) {
        queryConstraints.push(where('tags', 'array-contains', searchParams.tag));
      }
    }

    // Fetch initial data
    const [categoriesData, tagsData, businessesData] = await Promise.all([
      getCategories(),
      getTags(),
      getBusinesses(12, undefined, queryConstraints)
    ]);

    // Convert COUNTRIES to the correct Country[] type if needed
    const typedCountries: Country[] = COUNTRIES.map(country => ({
      code: country.value,
      name: country.label,
      currencies: [], // You might want to add these if available
      languages: [], // You might want to add these if available
      ...country
    }));

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
                countries={typedCountries}
                selectedCategory={searchParams?.category}
                selectedTags={searchParams?.tag ? [searchParams.tag] : []}
                selectedCountry={searchParams?.country}
                onFilterChange={() => {}}
              />
              
              <SubtleAdPlacement type="business-list-sidebar" />
            </div>
            
            {/* Main content */}
            <div className="lg:w-3/4">
              {businessesData.businesses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businessesData.businesses.map((business) => (
                      <BusinessCard 
                        key={business.id} 
                        business={business} 
                      />
                    ))}
                  </div>
                  
                  {businessesData.businesses.length === 12 && (
                    <div className="mt-8 text-center">
                      <Button variant="outline">
                        Load More Businesses
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 mx-auto text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1" 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No Businesses Found</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {searchParams?.category || searchParams?.tag || searchParams?.country 
                      ? "No businesses match your current filters." 
                      : "There are no businesses in the directory at the moment."}
                  </p>
                  <div className="mt-6">
                    <Button variant="outline">
                      Reset Filters
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Ad Placement */}
              <div className="mt-8">
                <SubtleAdPlacement type="content-bottom" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  } catch (_error) {
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
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
}