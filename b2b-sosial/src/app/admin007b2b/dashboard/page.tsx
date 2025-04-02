'use client';

import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/geographic-data';
import { getBusinesses, setFeaturedBusinessStatus } from '@/lib/firebase/db';
import { Business } from '@/types';

export default function AdminDashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not_featured'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hent bedrifter
  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedBusinesses = await getBusinesses(1000); // Hent opptil 1000 bedrifter
      setBusinesses(fetchedBusinesses.businesses);
      setFilteredBusinesses(fetchedBusinesses.businesses);
    } catch (err) {
      setError('Kunne ikke laste bedrifter. Vennligst prøv igjen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Kjør ved første innlasting
  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Filtrer og sorter bedrifter
  useEffect(() => {
    if (!businesses.length) return;

    let result = [...businesses];

    // Søk etter navn
    if (searchQuery) {
      result = result.filter(business => 
        business.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrer på kategori
    if (selectedCategory) {
      result = result.filter(business => business.category === selectedCategory);
    }

    // Filtrer på featured status
    if (featuredFilter === 'featured') {
      result = result.filter(business => business.featured);
    } else if (featuredFilter === 'not_featured') {
      result = result.filter(business => !business.featured);
    }

    // Sorter slik at featured bedrifter kommer øverst
    result.sort((a, b) => 
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    );

    setFilteredBusinesses(result);
  }, [searchQuery, selectedCategory, featuredFilter, businesses]);

  // Endre fremhevet status
  const toggleFeaturedStatus = async (businessId: string) => {
    try {
      // Finn gjeldende bedrift
      const business = businesses.find(b => b.id === businessId);
      if (!business) return;

      // Oppdater featured status
      await setFeaturedBusinessStatus(businessId, !business.featured);
      
      // Oppdater lokal state
      const updatedBusinesses = businesses.map(b => 
        b.id === businessId 
          ? { ...b, featured: !b.featured } 
          : b
      );

      setBusinesses(updatedBusinesses);
    } catch (err) {
      console.error('Kunne ikke endre featured-status', err);
      alert('Kunne ikke endre fremhevet status. Prøv igjen.');
    }
  };

  // Visning ved lasting
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Visning ved feil
  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
        <button 
          onClick={fetchBusinesses} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  // Tom liste-visning
  if (!businesses.length) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Ingen bedrifter funnet</p>
        <button 
          onClick={fetchBusinesses} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Last på nytt
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Fremhevede Bedrifter</h1>

      {/* Søk og filtreringsseksjon */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Søkefelt */}
        <input 
          type="text"
          placeholder="Søk bedrifter etter navn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        
        {/* Kategori-dropdown */}
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Alle kategorier</option>
          {CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        
        {/* Featured filter */}
        <select 
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured' | 'not_featured')}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="all">Alle bedrifter</option>
          <option value="featured">Kun fremhevede</option>
          <option value="not_featured">Ikke fremhevede</option>
        </select>
      </div>

      {/* Bedriftsliste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map(business => (
          <div 
            key={business.id} 
            className={`
              bg-white rounded-lg shadow-md p-4 flex items-center justify-between
              ${business.featured ? 'border-2 border-blue-500' : ''}
            `}
          >
            <div>
              <h3 className="font-bold">{business.name}</h3>
              <p className="text-sm text-gray-500">
                {CATEGORIES.find(cat => cat.value === business.category)?.label}
              </p>
            </div>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={business.featured}
                onChange={() => toggleFeaturedStatus(business.id)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {business.featured ? 'Fremhevet' : 'Ikke fremhevet'}
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Antall resultater */}
      <div className="mt-4 text-gray-500 text-sm">
        Viser {filteredBusinesses.length} av {businesses.length} bedrifter
      </div>
    </div>
  );
}