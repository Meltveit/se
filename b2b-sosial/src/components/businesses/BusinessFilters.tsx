'use client';

import React, { useState } from 'react';
import { Category, Tag, Country, Region } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SearchableSelect from '@/components/common/SearchableSelect'; // Import our new component

interface BusinessFiltersProps {
  categories: Category[];
  tags: Tag[];
  countries: Country[];
  regions?: Region[];
  selectedCategory?: string;
  selectedTags: string[];
  selectedCountry?: string;
  selectedRegion?: string;
  onFilterChange: (filters: {
    category?: string;
    tags?: string[];
    country?: string;
    region?: string;
  }) => void;
}

const BusinessFilters: React.FC<BusinessFiltersProps> = ({
  categories,
  tags,
  countries,
  regions,
  selectedCategory,
  selectedTags,
  selectedCountry,
  selectedRegion,
  onFilterChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    location: true,
  });

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      category: selectedCategory === categoryId ? undefined : categoryId,
      tags: selectedTags,
      country: selectedCountry,
      region: selectedRegion,
    });
  };

  // Handle tag selection
  const handleTagsChange = (tagIds: string[]) => {
    onFilterChange({
      category: selectedCategory,
      tags: tagIds,
      country: selectedCountry,
      region: selectedRegion,
    });
  };

  // Handle country selection
  const handleCountryChange = (countryCode: string) => {
    onFilterChange({
      category: selectedCategory,
      tags: selectedTags,
      country: selectedCountry === countryCode ? undefined : countryCode,
      region: selectedCountry === countryCode ? undefined : selectedRegion,
    });
  };

  // Handle region selection
  const handleRegionChange = (regionCode: string) => {
    onFilterChange({
      category: selectedCategory,
      tags: selectedTags,
      country: selectedCountry,
      region: selectedRegion === regionCode ? undefined : regionCode,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      category: undefined,
      tags: [],
      country: undefined,
      region: undefined,
    });
  };

  // Check if the selected country has regions
  const selectedCountryHasRegions =
    selectedCountry &&
    countries.find((country) => country.code === selectedCountry)?.hasRegions;

  // Filter regions to only show those for the selected country
  const filteredRegions = selectedCountry
    ? regions?.filter((region) => region.countryCode === selectedCountry) || []
    : [];

  // Check if any filters are applied
  const hasFilters = selectedCategory || selectedTags.length > 0 || selectedCountry || selectedRegion;

  return (
    <Card title="Filters" className="sticky top-4">
      {hasFilters && (
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Filters applied</span>
          <button
            className="text-sm text-blue-600 hover:text-blue-500"
            onClick={handleClearFilters}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Categories Section */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="font-medium text-gray-900">Categories</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform ${
              expandedSections.categories ? 'rotate-180' : ''
            } text-gray-500`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {expandedSections.categories && (
          <div className="mt-2 space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  id={`category-${category.id}`}
                  name="category"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedCategory === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section - Using SearchableSelect */}
      <div className="mb-4 pt-4 border-t border-gray-200">
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() => toggleSection('tags')}
        >
          <h3 className="font-medium text-gray-900">Tags</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform ${expandedSections.tags ? 'rotate-180' : ''} text-gray-500`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {expandedSections.tags && (
          <div className="mt-2">
            <SearchableSelect
              options={tags.map(tag => ({ value: tag.id, label: tag.name }))}
              selectedValues={selectedTags}
              onChange={handleTagsChange}
              placeholder="Search tags..."
              maxSelections={5}
            />
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="mb-4 pt-4 border-t border-gray-200">
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() => toggleSection('location')}
        >
          <h3 className="font-medium text-gray-900">Location</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform ${
              expandedSections.location ? 'rotate-180' : ''
            } text-gray-500`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {expandedSections.location && (
          <div className="mt-2 space-y-4">
            {/* Countries */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCountry || ''}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Regions (only show if country selected and has regions) */}
            {selectedCountryHasRegions && filteredRegions.length > 0 && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedRegion || ''}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {filteredRegions.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Filters Button (Mobile Only) */}
      <div className="mt-6 md:hidden">
        <Button type="button" fullWidth>
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default BusinessFilters;