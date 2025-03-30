// src/app/businesses/page.tsx
// Make this a client component to handle event handlers
'use client';

import { useEffect, useState } from 'react';
import { where, QueryConstraint } from 'firebase/firestore';
import { getBusinesses, getCategories, getTags } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import BusinessCard from '@/components/businesses/BusinessCard';
import BusinessFilters from '@/components/businesses/BusinessFilters';
import Button from '@/components/common/Button';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';
import { COUNTRIES } from '@/lib/geographic-data';
import { Business, Category, Tag, Country } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function BusinessesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Convert COUNTRIES to the correct Country[] type
  const typedCountries: Country[] = COUNTRIES.map(country => ({
    code: country.value,
    name: country.label,
    flag: country.flag,
    phoneCode: country.phoneCode,
    currencies: [], 
    languages: [], 
    hasRegions: country.hasRegions
  }));

  // Initial data fetching
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        
        // Initial data fetch without filters
        const [categoriesData, tagsData, businessesData] = await Promise.all([
          getCategories(),
          getTags(),
          getBusinesses(12)
        ]);

        setCategories(categoriesData);
        setTags(tagsData);
        setBusinesses(businessesData.businesses);
      } catch (error) {
        console.error('Error loading businesses:', error);
        setError('Failed to load businesses. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  // Handle filter changes
  const handleFilterChange = async (filters: {
    category?: string;
    tags?: string[];
    country?: string;
    region?: string;
  }) => {
    try {
      setLoading(true);
      
      // Update filter states
      setSelectedCategory(filters.category || '');
      setSelectedTags(filters.tags || []);
      setSelectedCountry(filters.country || '');
      setSelectedRegion(filters.region || '');

      // Prepare query constraints
      const queryConstraints: QueryConstraint[] = [];
      
      if (filters.category) {
        queryConstraints.push(where('category', '==', filters.category));
      }
      
      if (filters.country) {
        queryConstraints.push(where('country', '==', filters.country));
      }
      
      if (filters.tags && filters.tags.length > 0) {
        // For simplicity, just use the first tag in the filter
        queryConstraints.push(where('tags', 'array-contains', filters.tags[0]));
      }

      // Fetch filtered businesses
      const businessesData = await getBusinesses(12, undefined, queryConstraints);
      setBusinesses(businessesData.businesses);
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setSelectedCountry('');
    setSelectedRegion('');
    
    // Refetch businesses without filters
    (async () => {
      try {
        setLoading(true);
        const businessesData = await getBusinesses(12);
        setBusinesses(businessesData.businesses);
      } catch (error) {
        console.error('Error resetting filters:', error);
      } finally {
        setLoading(false);
      }
    })();
  };

  // Load more businesses
  const handleLoadMore = async () => {
    try {
      setLoading(true);
      
      // Prepare query constraints
      const queryConstraints: QueryConstraint[] = [];
      
      if (selectedCategory) {
        queryConstraints.push(where('category', '==', selectedCategory));
      }
      
      if (selectedCountry) {
        queryConstraints.push(where('country', '==', selectedCountry));
      }
      
      if (selectedTags.length > 0) {
        queryConstraints.push(where('tags', 'array-contains', selectedTags[0]));
      }

      // We can't easily create a QueryDocumentSnapshot, so instead
      // let's just fetch the next batch without a startAfter cursor
      // and skip items we already have
      const moreBusinessesData = await getBusinesses(businesses.length + 12, undefined, queryConstraints);
      
      // Filter out businesses we already have
      const existingIds = new Set(businesses.map(b => b.id));
      const newBusinesses = moreBusinessesData.businesses.filter(b => !existingIds.has(b.id));
      
      // Append new businesses to existing businesses
      setBusinesses([...businesses, ...newBusinesses]);
    } catch (error) {
      console.error('Error loading more businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (error && !loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Error Loading Businesses
            </h2>
            <p className="text-gray-500 mb-6">
              {error}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              categories={categories}
              tags={tags}
              countries={typedCountries}
              regions={[
                { code: 'oslo', name: 'Oslo', countryCode: 'no' },
                { code: 'stockholm', name: 'Stockholm', countryCode: 'se' },
              ]}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              selectedCountry={selectedCountry}
              selectedRegion={selectedRegion}
              onFilterChange={handleFilterChange}
            />
            
            <SubtleAdPlacement type="business-list-sidebar" />
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {loading && businesses.length === 0 ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : businesses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <BusinessCard 
                      key={business.id} 
                      business={business} 
                    />
                  ))}
                </div>
                
                {/* Load More Button */}
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More Businesses'}
                  </Button>
                </div>
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
                  {selectedCategory || selectedTags.length > 0 || selectedCountry 
                    ? "No businesses match your current filters." 
                    : "There are no businesses in the directory at the moment."}
                </p>
                {(selectedCategory || selectedTags.length > 0 || selectedCountry) && (
                  <div className="mt-6">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                )}
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
}