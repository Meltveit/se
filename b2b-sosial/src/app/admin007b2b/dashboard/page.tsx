'use client';

import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/geographic-data';
import { getBusinesses, setFeaturedBusinessStatus } from '@/lib/firebase/db';
import { Business } from '@/types';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

export default function AdminDashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not_featured'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  const SUPER_ADMIN_UID = '2pQt0csZO3cHekZZP0q1l1juUVr2';

  // Verify admin status first
  useEffect(() => {
    const verifyAdmin = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        router.push('/admin007b2b/login');
        return;
      }

      try {
        // Force token refresh to ensure we have the latest claims
        await currentUser.getIdToken(true);
        
        if (currentUser.uid !== SUPER_ADMIN_UID) {
          console.warn('Unauthorized access attempt by:', currentUser.uid);
          showToast('Ingen tilgang. Kun superadmin kan se dette.', 'error');
          router.push('/');
          return;
        }
        
        setIsVerifiedAdmin(true);
        fetchBusinesses();
      } catch (error) {
        console.error('Error verifying admin:', error);
        showToast('Autentiseringsfeil', 'error');
        router.push('/admin007b2b/login');
      }
    };

    verifyAdmin();
  }, [router, showToast]);

  const fetchBusinesses = async () => {
    if (!isVerifiedAdmin) return;
    
    setLoading(true);
    setError(null);

    try {
      const fetchedBusinesses = await getBusinesses(100);
      setBusinesses(fetchedBusinesses.businesses);
      setFilteredBusinesses(fetchedBusinesses.businesses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'En ukjent feil oppstod';
      console.error('Error fetching businesses:', err);
      setError(`Kunne ikke laste bedrifter: ${errorMessage}`);
      showToast('Feil ved lasting av bedrifter', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!businesses.length) return;

    let result = [...businesses];
    if (searchQuery) {
      result = result.filter(business => 
        business.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(business => business.category === selectedCategory);
    }

    if (featuredFilter === 'featured') {
      result = result.filter(business => business.featured);
    } else if (featuredFilter === 'not_featured') {
      result = result.filter(business => !business.featured);
    }

    result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    setFilteredBusinesses(result);
  }, [searchQuery, selectedCategory, featuredFilter, businesses]);

  const toggleFeaturedStatus = async (businessId: string) => {
    try {
      // Get current user
      const currentUser = auth.currentUser;
      
      // Check authentication
      if (!currentUser) {
        console.error('No user is currently logged in');
        showToast('Du må være logget inn som admin', 'error');
        router.push('/admin007b2b/login');
        return;
      }
      
      // Verify admin status by UID
      if (currentUser.uid !== SUPER_ADMIN_UID) {
        console.error('User is not authorized:', currentUser.uid);
        showToast('Kun superadmin kan endre fremhevet status', 'error');
        return;
      }
      
      // Force token refresh to ensure you have the latest claims
      await currentUser.getIdToken(true);
      console.log('Admin token refreshed for user:', currentUser.uid);
      
      // Find the business object
      const business = businesses.find(b => b.id === businessId);
      if (!business) {
        showToast('Bedrift ikke funnet', 'error');
        return;
      }
      
      // Set new featured status (toggle current value)
      const newFeaturedStatus = !business.featured;
      
      console.log(`Updating featured status for ${business.name} to ${newFeaturedStatus}`);
      
      // Call the function to update in Firestore
      await setFeaturedBusinessStatus(businessId, newFeaturedStatus, currentUser.uid);
      
      // Update local state
      const updatedBusinesses = businesses.map(b => 
        b.id === businessId ? { ...b, featured: newFeaturedStatus } : b
      );
      
      setBusinesses(updatedBusinesses);
      
      // If we're also displaying filtered businesses, update those too
      setFilteredBusinesses(prevFiltered => 
        prevFiltered.map(b => 
          b.id === businessId ? { ...b, featured: newFeaturedStatus } : b
        )
      );
      
      // Show success message
      showToast(
        `Bedrift ${business.name} er nå ${newFeaturedStatus ? 'fremhevet' : 'fjernet fra fremhevede'}`,
        'success'
      );
    } catch (error) {
      // Handle errors
      console.error('Error toggling featured status:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Kunne ikke endre fremhevet status';
      
      showToast(errorMessage, 'error');
      
      // If it seems like an auth error, redirect to login
      if (
        error instanceof Error && 
        (error.message.includes('permission') || 
         error.message.includes('auth') || 
         error.message.includes('Unauthorized'))
      ) {
        console.log('Authentication error detected, redirecting to login');
        router.push('/admin007b2b/login');
      }
    }
  };

  if (!isVerifiedAdmin || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Feil: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={fetchBusinesses} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Dashboard - Bedriftsadministrasjon</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Søk bedrifter
          </label>
          <input 
            id="search"
            type="text"
            placeholder="Søk etter bedriftsnavn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Velg kategori
          </label>
          <select 
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Alle kategorier</option>
            {CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="featured-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Fremhevede status
          </label>
          <select 
            id="featured-filter"
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured' | 'not_featured')}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Alle bedrifter</option>
            <option value="featured">Kun fremhevede</option>
            <option value="not_featured">Ikke fremhevede</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map(business => (
          <div 
            key={business.id} 
            className={`
              bg-white rounded-lg shadow-md p-4 flex flex-col justify-between
              ${business.featured ? 'border-2 border-blue-500' : 'border border-gray-200'}
            `}
          >
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{business.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {CATEGORIES.find(cat => cat.value === business.category)?.label || 'Ingen kategori'}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>ID: {business.id}</p>
                <p>Opprettet: {business.createdAt ? new Date(business.createdAt.toDate()).toLocaleDateString() : 'Ukjent'}</p>
                <p>Profil: {business.profileCompletionStatus?.completionPercentage || 0}% fullført</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span 
                className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${business.featured 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                  }
                `}
              >
                {business.featured ? 'Fremhevet' : 'Ikke fremhevet'}
              </span>
              
              <button
                onClick={() => toggleFeaturedStatus(business.id)}
                className={`
                  px-3 py-1 rounded text-xs font-medium transition-colors
                  ${business.featured 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }
                `}
              >
                {business.featured ? 'Fjern fremhevet' : 'Marker som fremhevet'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-gray-600 text-sm">
        Viser {filteredBusinesses.length} av {businesses.length} bedrifter
      </div>
    </div>
  );
}