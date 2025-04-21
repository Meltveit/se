// src/app/company/search/page.tsx
'use client';

import React, { useState } from 'react';
import { Search, Filter, Building } from 'lucide-react';
import Link from 'next/link';

// This will be replaced with actual company data from database
// Placeholder empty company array
const companies = [];

// Sector filter options
const sectors = [
  { id: 'all', name: 'All Sectors' },
  { id: 'technology', name: 'Technology' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'finance', name: 'Finance' },
  { id: 'logistics', name: 'Logistics' },
];

export default function CompanySearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // This will filter companies when we have them
  // For now, we're using an empty array
  const filteredCompanies = companies;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Companies</h1>
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by company name, location, or keywords..."
                className="input pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Filter Bar */}
          {showFilters && (
            <div className="mb-6 p-4 bg-white rounded-md shadow-sm border border-gray-200">
              <h2 className="text-sm font-bold mb-3">Filter by Sector</h2>
              <div className="flex flex-wrap gap-2">
                {sectors.map(sector => (
                  <button
                    key={sector.id}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeSector === sector.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveSector(sector.id)}
                  >
                    {sector.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredCompanies.length} 
            {filteredCompanies.length === 1 ? ' company' : ' companies'} found
          </div>
          
          {/* Company Results */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompanies.map(company => (
                <Link 
                  href={`/company/${company.slug}`} 
                  key={company.id}
                  className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className={`h-16 ${company.color} relative`}>
                    <div className="absolute -bottom-4 left-4 w-8 h-8 rounded-md border border-white bg-white flex items-center justify-center">
                      <Building size={16} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="p-3 pt-6">
                    <h3 className="font-bold text-sm mb-1">{company.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {company.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-gray-500">
                          {tag}{idx < company.tags.length - 1 ? ' • ' : ''}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{company.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-md shadow-sm">
              <Building size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No companies found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}