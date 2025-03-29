'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { where, QueryConstraint } from 'firebase/firestore';

import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';
import BusinessCard from '@/components/businesses/BusinessCard';

import { Business } from '@/types';
import { getBusinesses, getCategories } from '@/lib/firebase/db';
import { 
  getCountryOptions, 
  getRegionOptions 
} from '@/lib/geographic-data';

// Default map center (Oslo, Norway) - will be used as fallback
const DEFAULT_CENTER = { lat: 59.9139, lng: 10.7522 };
const DEFAULT_ZOOM = 14; // Slightly closer zoom level for better context

export default function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // Initialize state with search params, handle null properly
  const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get('category') || ''
  );
  const [selectedCountry, setSelectedCountry] = useState(
    searchParams?.get('country') || ''
  );
  const [selectedRegion, setSelectedRegion] = useState(
    searchParams?.get('region') || ''
  );
  const [availableRegions, setAvailableRegions] = useState<{value: string, label: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get('search') || ''
  );
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories([
          { value: '', label: 'All Categories' },
          ...categoriesData.map(cat => ({
            value: cat.id, 
            label: cat.name
          }))
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set empty categories as fallback
        setCategories([{ value: '', label: 'All Categories' }]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch businesses based on filters
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Create query constraints with proper Firebase typing
        const queryConstraints: QueryConstraint[] = [];
        if (selectedCategory) {
          queryConstraints.push(where('category', '==', selectedCategory));
        }
        if (selectedCountry) {
          queryConstraints.push(where('country', '==', selectedCountry));
        }
        if (selectedRegion) {
          queryConstraints.push(where('region', '==', selectedRegion));
        }
        const result = await getBusinesses(100, undefined, queryConstraints);
        const businesses = result.businesses.filter(business => 
          !searchQuery || 
          business.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBusinesses(businesses);
        // Update map center if businesses exist
        if (businesses.length > 0 && businesses[0].location) {
          setMapCenter({
            lat: businesses[0].location.latitude,
            lng: businesses[0].location.longitude
          });
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setFilteredBusinesses([]);
      }
    };

    fetchBusinesses();
  }, [selectedCategory, selectedCountry, selectedRegion, searchQuery]);

  // Update available regions when country changes
  useEffect(() => {
    const regions = selectedCountry ? getRegionOptions(selectedCountry) : [];
    setAvailableRegions(regions);
    setSelectedRegion('');
  }, [selectedCountry]);

  // Try to get user's location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location or do nothing
        }
      );
    }
  }, []);

  // Update URL with current filters
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedRegion) params.set('region', selectedRegion);
    if (searchQuery) params.set('search', searchQuery);

    router.push(`/map?${params.toString()}`, { scroll: false });
  };

  // Map interaction handlers
  const handleMarkerClick = (businessId: string) => {
    setActiveMarker(businessId);
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  };

  // Filter reset and apply functions
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedRegion('');
    setSearchQuery('');
    router.push('/map', { scroll: false });
  };

  const applyFilters = () => {
    updateUrlParams();
  };

  return (
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
            options={getCountryOptions()}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            fullWidth
          />
          
          {selectedCountry && availableRegions.length > 0 && (
            <Select
              label="Region"
              options={availableRegions}
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              fullWidth
            />
          )}
          
          <Input
            label="Search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search businesses..."
            fullWidth
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button onClick={resetFilters} variant="outline">Reset</Button>
        </div>
      </div>
      
      {/* Map and Results */}
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
          
          <div className="mt-6">
            <SubtleAdPlacement type="content-bottom" />
          </div>
        </div>
        
        {/* Results List */}
        <div className="lg:w-1/3">
          <Card title="Matching Businesses">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Businesses Found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {(selectedCategory || selectedCountry || selectedRegion || searchQuery)
                    ? "No businesses match your current filters." 
                    : "There are no businesses in the directory at the moment."}
                </p>
                <div className="mt-6">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBusinesses.map((business) => (
                  <BusinessCard 
                    key={business.id} 
                    business={business} 
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}