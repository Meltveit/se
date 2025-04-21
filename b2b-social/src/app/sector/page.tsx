// src/app/sector/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Compass, Building, User, MessageSquare, Globe, Briefcase, Star } from 'lucide-react';

// This will be replaced with actual sectors data from database
// Default sector icons for placeholder
const sectorIcons = {
  technology: <Compass />,
  manufacturing: <Building />,
  finance: <Briefcase />,
  healthcare: <User />,
  education: <MessageSquare />,
  logistics: <Globe />,
  energy: <Star />,
};

// Placeholder empty sectors array
const sectors = [];

export default function SectorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  // This will filter sectors when we have them
  // For now, we're using an empty array
  const filteredSectors = sectors;

  // Toggle expanded sector
  const toggleSector = (sectorId: string) => {
    if (expandedSector === sectorId) {
      setExpandedSector(null);
    } else {
      setExpandedSector(sectorId);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Explore Business Sectors</h1>
            <p className="text-gray-600 mb-6">
              Discover companies across different industries and find potential business partners in your sector
            </p>
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search sectors or subcategories..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Sectors List */}
          <div className="space-y-4">
            {filteredSectors.length > 0 ? (
              filteredSectors.map(sector => (
                <div 
                  key={sector.id}
                  className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button 
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSector(sector.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${sector.color} rounded-md flex items-center justify-center mr-3`}>
                        {sector.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">{sector.name}</h3>
                        <p className="text-sm text-gray-600">{sector.companyCount} companies</p>
                      </div>
                    </div>
                    <svg 
                      className={`h-5 w-5 text-gray-500 transition-transform ${expandedSector === sector.id ? 'transform rotate-180' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Expanded Content */}
                  {expandedSector === sector.id && (
                    <div className="p-4 border-t border-gray-200">
                      <p className="text-gray-600 mb-4">{sector.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Subcategories</h4>
                        <div className="flex flex-wrap gap-2">
                          {sector.subcategories.map((sub, index) => (
                            <Link 
                              key={index}
                              href={`/company/search?sector=${sector.id}&subcategory=${encodeURIComponent(sub)}`}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      <Link 
                        href={`/company/search?sector=${sector.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        View all companies in this sector
                        <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-md shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-1">No sectors found</h3>
                <p className="text-gray-600">Try adjusting your search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}