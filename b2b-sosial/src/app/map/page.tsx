'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import BusinessCard from '@/components/businesses/BusinessCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Business } from '@/types';
import { getBusinesses, getCategories } from '@/lib/firebase/db';

// Default map center (Oslo, Norway)
const DEFAULT_CENTER = { lat: 59.9139, lng: 10.7522 };
const DEFAULT_ZOOM = 10;

export default function MapPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || '';
  const initialCountry = searchParams?.get('country') || '';
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Google Maps state
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  // Fetch businesses and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories([
          { value: '', label: 'All Categories' },
          ...categoriesData.map(cat => ({ value: cat.id, label: cat.name }))
        ]);
        
        // Fetch businesses
        const result = await getBusinesses(100);
        setBusinesses(result.businesses.filter(b => b.location)); // Only businesses with location data
        
        // Set map center if we have businesses with location
        if (result.businesses.length > 0 && result.businesses[0].location) {
          setMapCenter(result.businesses[0].location);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load map data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter businesses based on selected filters
  const filteredBusinesses = businesses.filter(business => {
    // Filter by category
    if (selectedCategory && business.category !== selectedCategory) {
      return false;
    }
    
    // Filter by country
    if (selectedCountry && business.country !== selectedCountry) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        business.name.toLowerCase().includes(query) ||
        (business.description && business.description.toLowerCase().includes(query)) ||
        (business.tags && business.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return true;
  });

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Handle marker click
  const handleMarkerClick = (businessId: string) => {
    setActiveMarker(businessId);
  };

  // Handle info window close
  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  // Apply filters
  const applyFilters = () => {
    // Reset active marker when filters change
    setActiveMarker(null);
    
    // Auto center map if we have filtered businesses
    if (filteredBusinesses.length > 0 && filteredBusinesses[0].location) {
      setMapCenter(filteredBusinesses[0].location);
      map?.setCenter(filteredBusinesses[0].location);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSearchQuery('');
    setActiveMarker(null);
    
    // Reset map to default center
    setMapCenter(DEFAULT_CENTER);
    map?.setCenter(DEFAULT_CENTER);
    map?.setZoom(DEFAULT_ZOOM);
  };

  // Get countries from businesses for the filter
  const countries = Array.from(new Set(businesses.map(b => b.country))).filter(Boolean).map(country => ({
    value: country as string,
    label: country as string,
  }));
  countries.unshift({ value: '', label: 'All Countries' });

  // Handle loading and error states
  if (loadError) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error loading Google Maps
            </h1>
            <p className="text-gray-500 mb-6">
              There was an error loading the map. Please try again later.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Business Map</h1>
          </div>
          
          {/* Filters Bar */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Category"
                options={categories}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                fullWidth
              />
              
              <Select
                label="Country"
                options={countries}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                fullWidth
              />
              
              <Input
                label="Search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses..."
                fullWidth
              />
              
              <div className="flex items-end space-x-2">
                <Button onClick={applyFilters} fullWidth>Apply Filters</Button>
                <Button onClick={resetFilters} variant="outline">Reset</Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Map Container */}
            <div className="lg:w-2/3 mb-6 lg:mb-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: '70vh' }}>
                {!isLoaded ? (
                  <div className="h-full flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={DEFAULT_ZOOM}
                    onLoad={onMapLoad}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {/* Markers for each business */}
                    {filteredBusinesses.map((business) => (
                      business.location && (
                        <MarkerF
                          key={business.id}
                          position={business.location}
                          onClick={() => handleMarkerClick(business.id)}
                          icon={{
                            url: business.logoUrl || '/marker-icon.png',
                            scaledSize: new google.maps.Size(40, 40),
                          }}
                        >
                          {/* Info Window when marker is clicked */}
                          {activeMarker === business.id && (
                            <InfoWindowF
                              position={business.location}
                              onCloseClick={handleInfoWindowClose}
                            >
                              <div className="max-w-xs">
                                <h3 className="font-bold text-gray-900">{business.name}</h3>
                                {business.shortDescription && (
                                  <p className="text-sm text-gray-600 mt-1">{business.shortDescription}</p>
                                )}
                                <div className="mt-2">
                                  <a
                                    href={`/businesses/${business.id}`}
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                  >
                                    View Profile
                                  </a>
                                </div>
                              </div>
                            </InfoWindowF>
                          )}
                        </MarkerF>
                      )
                    ))}
                  </GoogleMap>
                )}
              </div>
            </div>
            
            {/* Business List */}
            <div className="lg:w-1/3">
              <Card title={`Businesses (${filteredBusinesses.length})`}>
                <div className="space-y-4 max-h-[65vh] overflow-y-auto p-1">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : filteredBusinesses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No businesses found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredBusinesses.map((business) => (
                      <div
                        key={business.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          activeMarker === business.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleMarkerClick(business.id)}
                      >
                        <h3 className="font-medium text-gray-900">{business.name}</h3>
                        
                        {business.category && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mt-1">
                            {business.category}
                          </span>
                        )}
                        
                        {business.shortDescription && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{business.shortDescription}</p>
                        )}
                        
                        <div className="mt-2 flex justify-between items-center">
                          <a
                            href={`/businesses/${business.id}`}
                            className="text-xs text-blue-600 hover:text-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Profile
                          </a>
                          
                          {business.location && (
                            <button
                              className="text-xs text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (map && business.location) {
                                  map.setCenter(business.location);
                                  map.setZoom(15);
                                  handleMarkerClick(business.id);
                                }
                              }}
                            >
                              Center on Map
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}