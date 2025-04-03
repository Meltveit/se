'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import BusinessCard from '@/components/businesses/BusinessCard';
import PostCard from '@/components/posts/PostCard';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Business, Post, Category } from '@/types';
import { categoryIcons, categoryColors, CategoryId } from '@/lib/categoryIcons';
import { Timestamp } from 'firebase/firestore';
import { CATEGORIES } from '@/lib/geographic-data';

export default function HomePage() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const fallbackCategories: Category[] = CATEGORIES.map(category => ({
    id: category.value,
    name: category.label,
    slug: category.value,
    order: CATEGORIES.findIndex(c => c.value === category.value) + 1,
    createdAt: Timestamp.fromDate(new Date())
  }));

  // Fetch user's location on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  // Fetch businesses and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { getBusinessesForHomepage, getCategories, getPosts } = await import('@/lib/firebase/db');
        
        // Prepare location and category options for business fetching
        const locationOptions = userLocation 
          ? { 
              latitude: userLocation.latitude, 
              longitude: userLocation.longitude, 
              maxDistance: 100 // 100 km radius
            } 
          : {};

        const [businessesData, categoriesData, postsResult] = await Promise.all([
          getBusinessesForHomepage(6, {
            ...locationOptions,
            category: selectedCategory || undefined
          }),
          getCategories(),
          getPosts(3)
        ]);
        
        console.log('Categories fetched:', categoriesData);
        console.log('Businesses fetched:', businessesData);
        
        setFeaturedBusinesses(businessesData);
        setCategories(categoriesData.length > 0 ? categoriesData : fallbackCategories);
        setPosts(postsResult.posts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories(fallbackCategories);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory, userLocation]);

  // Scroll categories horizontally
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.categories-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle category icon click
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Connect With Businesses That Matter
            </h1>
            <p className="mt-6 text-xl max-w-prose">
              B2B Social helps you find, connect, and collaborate with other businesses. Create your business profile, share updates, and grow your network.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/register/business">
                <Button size="lg">Register Your Business</Button>
              </Link>
              <Link href="/businesses" className="text-white font-semibold">
                Browse Businesses <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Business Categories</h2>
            <p className="mt-2 text-gray-600">Browse businesses by category</p>
          </div>

          <div className="relative">
            {/* Left scroll button */}
            <button 
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white md:flex hidden items-center justify-center"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Categories container */}
            <div className="categories-container flex overflow-x-auto space-x-6 py-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {categories.map((category) => {
                const categoryId = category.id as CategoryId;
                const IconComponent = categoryIcons[categoryId] || categoryIcons.other;
                const iconColor = categoryColors[categoryId] || categoryColors.other;
                const isSelected = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-24 p-2 rounded-lg transition duration-300 snap-start ${
                      isSelected ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 hover:bg-blue-200 transition duration-300">
                      <IconComponent className={`h-9 w-9 ${iconColor}`} />
                    </div>
                    <span className="text-sm text-gray-700 text-center truncate w-full">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Right scroll button */}
            <button 
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white md:flex hidden items-center justify-center"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Businesses Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory
                ? `Businesses in ${categories.find(cat => cat.id === selectedCategory)?.name}`
                : (userLocation ? 'Businesses Near You' : 'Featured Businesses')}
            </h2>
            <Link href="/businesses" className="text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          {featuredBusinesses && featuredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">
                {selectedCategory
                  ? `No businesses in this category yet.`
                  : 'No businesses found. Be the first to register!'}
              </p>
              <div className="mt-4">
                <Link href="/register/business">
                  <Button>Register Your Business</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle ad after featured businesses */}
      <div className="container mx-auto px-4">
        <SubtleAdPlacement type="content-bottom" />
      </div>

      {/* Latest Posts Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            <Link href="/news-feed" className="text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.slice(0, 2).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Integrated ad in the feed, looks like a regular post */}
              <div className="md:col-span-1">
                <SubtleAdPlacement type="sidebar-native" className="h-full" />
              </div>

              {posts.slice(2).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold">Ready to Connect?</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Join the growing network of businesses on our platform and expand your reach.
          </p>
          <div className="mt-8">
            <Link href="/register/business">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                Register Your Business
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Discrete footer ad */}
      <div className="container mx-auto">
        <SubtleAdPlacement type="footer-discrete" />
      </div>

      {/* Scrollbar Hide Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </MainLayout>
  );
}