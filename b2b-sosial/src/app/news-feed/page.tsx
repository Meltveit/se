'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import PostList from '@/components/posts/PostList';
import Card from '@/components/common/Card';
import { getCategories, getTags } from '@/lib/firebase/db';
import { Category, Tag } from '@/types';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Component that uses the useSearchParams hook
function NewsFeedContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get('category') || undefined;
  const tagId = searchParams?.get('tag') || undefined;
  const businessId = searchParams?.get('business') || undefined;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter selection
  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">News Feed</h1>
        </div>
        
        <div className="lg:flex lg:gap-8">
          {/* Left Sidebar with filters */}
          <div className="lg:w-1/4 mb-6 lg:mb-0 space-y-6">
            {/* Post Filters */}
            <Card title="Filters">
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleFilterSelect('all')}
                >
                  All Posts
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeFilter === 'following' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleFilterSelect('following')}
                >
                  Following
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeFilter === 'popular' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleFilterSelect('popular')}
                >
                  Most Popular
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeFilter === 'recent' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleFilterSelect('recent')}
                >
                  Most Recent
                </button>
              </div>
            </Card>
            
            {/* Categories */}
            <Card title="Categories">
              <div className="space-y-2">
                {loading ? (
                  <p className="text-gray-500 text-sm">Loading categories...</p>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <a
                      key={category.id}
                      href={`/news-feed?category=${category.id}`}
                      className={`block px-3 py-2 rounded-md text-sm ${
                        categoryId === category.id 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No categories available</p>
                )}
              </div>
            </Card>
            
            {/* Subtle native ad widget in sidebar */}
            <SubtleAdPlacement type="sidebar-native" />
            
            {/* Popular Tags */}
            <Card title="Popular Tags">
              <div className="flex flex-wrap gap-2">
                {loading ? (
                  <p className="text-gray-500 text-sm">Loading tags...</p>
                ) : tags.length > 0 ? (
                  tags.slice(0, 15).map((tag) => (
                    <a
                      key={tag.id}
                      href={`/news-feed?tag=${tag.id}`}
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        tagId === tag.id 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {tag.name}
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tags available</p>
                )}
              </div>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            {/* Custom PostList med integrerte annonser */}
            <div className="space-y-6">
              {/* First 3 posts */}
              <PostList 
                businessId={businessId}
                categoryId={categoryId}
                tagId={tagId}
                initialLimit={3}
                hideLoadMore={true}
              />
              
              {/* Discrete ad that looks like a post */}
              <div className="my-2">
                <SubtleAdPlacement type="feed-integrated" />
              </div>
              
              {/* Rest of the posts */}
              <PostList 
                businessId={businessId}
                categoryId={categoryId}
                tagId={tagId}
                initialLimit={6}
                skip={3}
              />
              
              {/* Ad at the bottom of the page */}
              <div className="mt-8">
                <SubtleAdPlacement type="content-bottom" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export component with Suspense
export default function NewsFeedPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      }>
        <NewsFeedContent />
      </Suspense>
    </MainLayout>
  );
}