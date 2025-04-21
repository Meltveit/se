// src/app/posts/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';

// This will be replaced with actual posts data from database
// Placeholder empty posts array
const posts = [];

// Category filter options
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'Technology', name: 'Technology' },
  { id: 'Manufacturing', name: 'Manufacturing' },
  { id: 'Healthcare', name: 'Healthcare' },
  { id: 'Finance', name: 'Finance' },
  { id: 'Logistics', name: 'Logistics' },
];

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // This will filter posts when we have them
  // For now, we're using an empty array
  const filteredPosts = posts;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Industry News & Insights</h1>
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts by title, content, or company..."
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
              <h2 className="text-sm font-bold mb-3">Filter by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeCategory === category.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredPosts.length} 
            {filteredPosts.length === 1 ? ' post' : ' posts'} found
          </div>
          
          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map(post => (
                <Link 
                  href={`/posts/${post.slug}`} 
                  key={post.id}
                  className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className={`h-8 w-8 rounded-full ${post.company.bgColor} mr-2 flex items-center justify-center`}>
                        <span className={`text-xs font-medium ${post.company.textColor}`}>
                          {post.company.shortName}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{post.company.name}</p>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex-1">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 ${post.categoryColor} text-xs rounded-full`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.createdAt}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-md shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No posts found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}