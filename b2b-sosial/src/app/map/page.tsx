'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import MainLayout from '@/components/layout/MainLayout';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Business } from '@/types';
import { getBusinesses, getCategories } from '@/lib/firebase/db';

// Default map center (Oslo, Norway) - will be used as fallback
const DEFAULT_CENTER = { lat: 59.9139, lng: 10.7522 };
const DEFAULT_ZOOM = 14; // Slightly closer zoom level for better context

// Component that uses useSearchParams
function MapContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || '';
  const initialCountry = searchParams?.get('country') || '';
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Google Maps state
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  // Get user's location immediately on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
          if (map) {
            map.setCenter(userPos);
            map.setZoom(DEFAULT_ZOOM);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Silently fall back to default location
        },
        { 
          enableHighAccuracy: true, 
          timeout: 5000,
          maximumAge: 0 
        }
      );
    }
  }, [map]);

  // Fetch businesses and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories([
          { value: '', label: 'All Categories' },
          ...categoriesData.map(cat => ({ value: cat.id, label: cat.name }))
        ]);
        
        // Fetch businesses
        const result = await getBusinesses(100);
        const businessesWithLocation = result.businesses.filter(b => b.location);
        setBusinesses(businessesWithLocation);
        
        // Only fall back to a business location if we don't have user location
        if (!userLocation && businessesWithLocation.length > 0 && businessesWithLocation[0].location) {
          // Convert location format from { latitude, longitude } to { lat, lng }
          const location = businessesWithLocation[0].location;
          setMapCenter({
            lat: location.latitude,
            lng: location.longitude
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [userLocation]);

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
    
    // If we already have the user location when map loads, center on it
    if (userLocation) {
      map.setCenter(userLocation);
      map.setZoom(DEFAULT_ZOOM);
    }
  }, [userLocation]);

  // Handle marker click
  const handleMarkerClick = (businessId: string) => {
    setActiveMarker(businessId);
  };

  // Handle info window close
  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  // Center on user location function - can be called from a button if needed
  const centerOnUserLocation = () => {
    if (userLocation && map) {
      map.setCenter(userLocation);
      map.setZoom(DEFAULT_ZOOM);
    }
  };

  // Apply filters
  const applyFilters = () => {
    // Reset active marker when filters change
    setActiveMarker(null);
    
    // Auto center map if we have filtered businesses
    if (filteredBusinesses.length > 0 && filteredBusinesses[0].location) {
      const location = filteredBusinesses[0].location;
      const mapLocation = {
        lat: location.latitude,
        lng: location.longitude
      };
      setMapCenter(mapLocation);
      if (map) map.setCenter(mapLocation);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSearchQuery('');
    setActiveMarker(null);
    
    // Reset map to user location or default
    if (userLocation) {
      setMapCenter(userLocation);
      if (map) map.setCenter(userLocation);
    } else {
      setMapCenter(DEFAULT_CENTER);
      if (map) map.setCenter(DEFAULT_CENTER);
    }
    if (map) map.setZoom(DEFAULT_ZOOM);
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
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Business Map</h1>
          {userLocation && (
            <Button onClick={centerOnUserLocation} variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              My Location
            </Button>
          )}
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
                  {/* User location marker */}
                  {userLocation && (
                    <MarkerF
                      position={userLocation}
                      icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      }}
                    >
                      <InfoWindowF
                        position={userLocation}
                        options={{ 
                          pixelOffset: new google.maps.Size(0, -30) 
                        }}
                      >
                        <div>
                          <p className="font-medium">Your Location</p>
                        </div>
                      </InfoWindowF>
                    </MarkerF>
                  )}
                  
                  {/* Markers for each business */}
                  {filteredBusinesses.map((business) => {
                    if (!business.location) return null;
                    
                    // Convert business location to Google Maps format
                    const position = {
                      lat: business.location.latitude,
                      lng: business.location.longitude
                    };
                    
                    return (
                      <MarkerF
                        key={business.id}
                        position={position}
                        onClick={() => handleMarkerClick(business.id)}
                        icon={{
                          url: business.logoUrl || '/marker-icon.png',
                          scaledSize: new google.maps.Size(40, 40),
                        }}
                      >
                        {/* Info Window when marker is clicked */}
                        {activeMarker === business.id && (
                          <InfoWindowF
                            position={position}
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
                    );
                  })}
                </GoogleMap>
              )}
            </div>
          </div>
          
          {/* Business List - add your list component here */}
          <div className="lg:w-1/3">
            {/* Your business list component */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with suspense
export default function MapPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      }>
        <MapContent />
      </Suspense>
    </MainLayout>
  );
}