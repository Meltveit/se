'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { getCountryOptions, getRegionOptions, CATEGORIES } from '@/lib/geographic-data';

// Define a type for country codes to use as keys
type CountryCode = 'no' | 'se' | 'dk' | 'fi' | 'us' | 'uk' | 'de' | 'fr' | 'ca' | 'au' | 'nl' | 'be' | 'es' | 'it';

// Country coordinates for zooming
const COUNTRY_COORDINATES: Record<CountryCode, { lat: number; lng: number; zoom: number }> = {
  'no': { lat: 60.472, lng: 8.4689, zoom: 6 },  // Norway
  'se': { lat: 62.1282, lng: 15.6435, zoom: 5 }, // Sweden
  'dk': { lat: 56.2639, lng: 9.5018, zoom: 7 },  // Denmark
  'fi': { lat: 61.9241, lng: 25.7482, zoom: 5 }, // Finland
  'us': { lat: 37.0902, lng: -95.7129, zoom: 4 }, // USA
  'uk': { lat: 55.3781, lng: -3.4360, zoom: 5 },  // UK
  'de': { lat: 51.1657, lng: 10.4515, zoom: 6 },  // Germany
  'fr': { lat: 46.2276, lng: 2.2137, zoom: 6 },   // France
  'ca': { lat: 56.1304, lng: -106.3468, zoom: 4 }, // Canada
  'au': { lat: -25.2744, lng: 133.7751, zoom: 4 }, // Australia
  'nl': { lat: 52.1326, lng: 5.2913, zoom: 7 },   // Netherlands
  'be': { lat: 50.5039, lng: 4.4699, zoom: 8 },   // Belgium
  'es': { lat: 40.4637, lng: -3.7492, zoom: 6 },  // Spain
  'it': { lat: 41.8719, lng: 12.5674, zoom: 6 },  // Italy
};

// Default map center (Oslo, Norway)
const DEFAULT_CENTER = { lat: 59.9139, lng: 10.7522 };
const DEFAULT_ZOOM = 6;

// Define libraries outside of component to prevent reloading
// Use the Libraries type from the Google Maps API
import { Libraries } from '@react-google-maps/api';
const mapLibraries: Libraries = ['places'];

export default function MapContent() {
  const router = useRouter();
  
  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: mapLibraries,
    preventGoogleFontsLoading: true, // Prevent loading Google Fonts to reduce CSP issues
  });

  // State for map data
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availableRegions, setAvailableRegions] = useState<{value: string, label: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API configuration options
  const mapOptions = useMemo(() => ({
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    zoomControl: true,
    gestureHandling: 'cooperative',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }), []);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // First try to fetch from database
        const dbCategories = await getCategories();
        
        if (dbCategories && dbCategories.length > 0) {
          setCategories(dbCategories.map(cat => ({
            id: cat.id,
            name: cat.name
          })));
        } else {
          // Fallback to static categories from geographic-data.ts
          setCategories(CATEGORIES.map(cat => ({
            id: cat.value,
            name: cat.label
          })));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to static categories
        setCategories(CATEGORIES.map(cat => ({
          id: cat.value,
          name: cat.label
        })));
      }
    };
    
    loadCategories();
  }, []);

  // Fetch businesses based on filters
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        
        // Create query constraints
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
        
        // Apply search query filter client-side
        let businesses = result.businesses;
        if (searchQuery) {
          const lowerSearch = searchQuery.toLowerCase();
          businesses = businesses.filter(business => 
            business.name.toLowerCase().includes(lowerSearch) ||
            (business.shortDescription && business.shortDescription.toLowerCase().includes(lowerSearch)) ||
            (business.tags && business.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
          );
        }
        
        setFilteredBusinesses(businesses);
        
        // Update map center based on results
        if (businesses.length > 0 && businesses[0].location) {
          setMapCenter({
            lat: businesses[0].location.latitude,
            lng: businesses[0].location.longitude
          });
          setZoom(10); // Closer zoom when we have a specific business
        } else if (selectedCountry) {
          // If no businesses but a country is selected, center on that country
          const countryCode = selectedCountry as CountryCode;
          // Check if this country code exists in our coordinates object
          if (COUNTRY_COORDINATES[countryCode]) {
            const countryCenter = COUNTRY_COORDINATES[countryCode];
            setMapCenter({ lat: countryCenter.lat, lng: countryCenter.lng });
            setZoom(countryCenter.zoom);
          }
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setError('Failed to load businesses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [selectedCategory, selectedCountry, selectedRegion, searchQuery]);

  // Update available regions when country changes
  useEffect(() => {
    const regions = selectedCountry ? getRegionOptions(selectedCountry) : [];
    setAvailableRegions(regions);
    setSelectedRegion('');
    
    // Update map center when country changes
    if (selectedCountry) {
      const countryCode = selectedCountry as CountryCode;
      // Only proceed if this is a recognized country code
      if (COUNTRY_COORDINATES[countryCode]) {
        const countryCenter = COUNTRY_COORDINATES[countryCode];
        setMapCenter({ lat: countryCenter.lat, lng: countryCenter.lng });
        setZoom(countryCenter.zoom);
      }
    }
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
          
          // Only set map center to user location if no country or filters are selected
          if (!selectedCountry && !selectedCategory && !selectedRegion && !searchQuery) {
            setMapCenter(location);
            setZoom(12); // Closer zoom for user location
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location or do nothing
        }
      );
    }
  }, [selectedCountry, selectedCategory, selectedRegion, searchQuery]);

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
      setZoom(14); // Closer zoom level for user location
    }
  };

  // Filter reset and apply functions
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedRegion('');
    setSearchQuery('');
    router.push('/map', { scroll: false });
    
    // Reset to user location if available, otherwise default
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(12);
    } else {
      setMapCenter(DEFAULT_CENTER);
      setZoom(DEFAULT_ZOOM);
    }
  };

  const applyFilters = () => {
    updateUrlParams();
  };

  // Navigate to business profile
  const navigateToBusiness = (businessId: string) => {
    router.push(`/businesses/${businessId}`);
  };

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle key press in search field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
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
      <div className="mb-6 bg-gray-50 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Category"
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
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
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
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
            {loadError ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Error Loading Map</h3>
                <p className="text-gray-600 mt-2">
                  There was a problem loading the map. Please check your internet connection and try again.
                </p>
              </div>
            ) : !isLoaded ? (
              <div className="h-full flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading map...</p>
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={zoom}
                options={mapOptions}
              >
                {/* User location marker */}
                {userLocation && (
                  <MarkerF
                    position={userLocation}
                    icon={{
                      url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDY2RkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzAwNjZGRiIgZmlsbC1vcGFjaXR5PSIwLjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjMDA2NkZGIi8+PC9zdmc+',
                      scaledSize: new google.maps.Size(32, 32),
                    }}
                  />
                )}
                
                {/* Markers for each business */}
                {filteredBusinesses.map((business) => {
                  if (!business.location) return null;
                  
                  // Convert business location to Google Maps format
                  const position = {
                    lat: business.location.latitude,
                    lng: business.location.longitude
                  };
                  
                  // Create a data URL for custom marker based on business logo or initial
                  let markerUrl = '';
                  if (business.logoUrl) {
                    markerUrl = business.logoUrl;
                  } else {
                    // Use a default marker with business initial
                    markerUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzNiODJmNiIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkI8L3RleHQ+PC9zdmc+';
                  }
                  
                  return (
                    <MarkerF
                      key={business.id}
                      position={position}
                      onClick={() => handleMarkerClick(business.id)}
                      icon={{
                        url: markerUrl,
                        scaledSize: new google.maps.Size(36, 36),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(18, 18)
                      }}
                      animation={google.maps.Animation.DROP}
                    >
                      {/* Info Window when marker is clicked */}
                      {activeMarker === business.id && (
                        <InfoWindowF
                          position={position}
                          onCloseClick={handleInfoWindowClose}
                          options={{ maxWidth: 300 }}
                        >
                          <div className="max-w-xs p-2">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{business.name}</h3>
                            
                            {/* Display business tags */}
                            {business.tags && business.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {business.tags.map((tag, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {business.shortDescription && (
                              <p className="text-sm text-gray-600 mt-1 mb-2">{business.shortDescription}</p>
                            )}
                            
                            {business.address && (
                              <p className="text-xs text-gray-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {business.address}
                                {business.city && `, ${business.city}`}
                                {business.country && `, ${business.country}`}
                              </p>
                            )}
                            
                            <div className="mt-2">
                              <Button 
                                onClick={() => navigateToBusiness(business.id)}
                                size="sm"
                                fullWidth
                              >
                                View Profile
                              </Button>
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
          <Card title={`${filteredBusinesses.length} Matching Businesses`}>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : filteredBusinesses.length === 0 ? (
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
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                {filteredBusinesses.map((business) => (
                  <div 
                    key={business.id}
                    onClick={() => {
                      // Center map on this business and open info window
                      if (business.location) {
                        setMapCenter({
                          lat: business.location.latitude,
                          lng: business.location.longitude
                        });
                        setZoom(10);
                        setActiveMarker(business.id);
                      }
                    }}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <BusinessCard 
                      business={business}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}