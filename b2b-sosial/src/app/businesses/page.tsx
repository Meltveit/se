'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBusinesses, getCategories, getTags } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import BusinessCard from '@/components/businesses/BusinessCard';
import BusinessFilters from '@/components/businesses/BusinessFilters';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AdPlacement from '@/components/common/AdPlacement';
import { Business, Category, Tag, Country, Region } from '@/types';

// Mock country data - would be replaced with actual data
const countries: Country[] = [
  { code: 'no', name: 'Norway', flag: '🇳🇴', phoneCode: '+47', currencies: ['NOK'], languages: ['no'], hasRegions: true },
  { code: 'se', name: 'Sweden', flag: '🇸🇪', phoneCode: '+46', currencies: ['SEK'], languages: ['sv'], hasRegions: true },
  { code: 'dk', name: 'Denmark', flag: '🇩🇰', phoneCode: '+45', currencies: ['DKK'], languages: ['da'], hasRegions: true },
  { code: 'us', name: 'United States', flag: '🇺🇸', phoneCode: '+1', currencies: ['USD'], languages: ['en'], hasRegions: true },
];

// Mock regions data - would be replaced with actual data
const regions: Region[] = [
  { code: 'oslo', name: 'Oslo', countryCode: 'no' },
  { code: 'bergen', name: 'Bergen', countryCode: 'no' },
  { code: 'stockholm', name: 'Stockholm', countryCode: 'se' },
  { code: 'gothenburg', name: 'Gothenburg', countryCode: 'se' },
  { code: 'copenhagen', name: 'Copenhagen', countryCode: 'dk' },
  { code: 'aarhus', name: 'Aarhus', countryCode: 'dk' },
  { code: 'ca', name: 'California', countryCode: 'us' },
  { code: 'ny', name: 'New York', countryCode: 'us' },
];

export default function BusinessesPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || undefined;
  const initialTag = searchParams?.get('tag') || undefined;
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    tags: initialTag ? [initialTag] : [],
    country: undefined,
    region: undefined,
  });

  // Fetch businesses, categories, and tags
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories and tags
        const categoriesData = await getCategories();
        const tagsData = await getTags();
        setCategories(categoriesData);
        setTags(tagsData);
        
        // Fetch businesses with filters
        const result = await getBusinesses(10);
        setBusinesses(result.businesses);
        setLastDoc(result.lastVisible);
        setHasMore(result.businesses.length === 10);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load more businesses
  const handleLoadMore = async () => {
    if (!lastDoc || loadingMore) return;

    setLoadingMore(true);
    try {
      const result = await getBusinesses(10, lastDoc);
      setBusinesses((prev) => [...prev, ...result.businesses]);
      setLastDoc(result.lastVisible);
      setHasMore(result.businesses.length === 10);
    } catch (err) {
      console.error('Error fetching more businesses:', err);
      setError('Failed to load more businesses. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: {
    category?: string;
    tags?: string[];
    country?: string;
    region?: string;
  }) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
    
    // Reset businesses and fetch with new filters
    // This would include actual filter implementation in a real app
    // For now, we'll just simulate a delay
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <MainLayout>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Businesses Directory</h1>
          </div>
          
          <div className="lg:flex lg:gap-8">
            {/* Sidebar with filters */}
            <div className="lg:w-1/4 mb-6 lg:mb-0 space-y-6">
              <BusinessFilters
                categories={categories}
                tags={tags}
                countries={countries}
                regions={regions}
                selectedCategory={filters.category}
                selectedTags={filters.tags}
                selectedCountry={filters.country}
                selectedRegion={filters.region}
                onFilterChange={handleFilterChange}
              />
              
              {/* Ad in sidebar */}
              <div className="mt-6">
                <AdPlacement type="business-list-sidebar" className="mx-auto" />
              </div>
            </div>
            
            {/* Main content */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">{error}</div>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">No businesses found matching your criteria.</p>
                  {Object.values(filters).some(Boolean) && (
                    <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {businesses.slice(0, 3).map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                  </div>
                  
                  {/* Mid-listing ad */}
                  <div className="my-6 flex justify-center">
                    <AdPlacement type="news-feed-inline" />
                  </div>
                  
                  {/* Remaining businesses */}
                  {businesses.length > 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                      {businesses.slice(3).map((business) => (
                        <BusinessCard key={business.id} business={business} />
                      ))}
                    </div>
                  )}
                  
                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        isLoading={loadingMore}
                        disabled={loadingMore}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                  
                  {/* Bottom ad */}
                  <div className="mt-12 flex justify-center">
                    <AdPlacement type="footer-banner" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}