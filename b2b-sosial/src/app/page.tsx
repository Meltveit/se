// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { getFeaturedBusinesses, getCategories, getPosts } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import BusinessCard from '@/components/businesses/BusinessCard';
import PostCard from '@/components/posts/PostCard';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';

// Generate static params for the homepage
export async function generateStaticParams() {
  return [{}]; // Empty params for the home page
}

// Define the page component with no props
export default async function HomePage() {
  // Fetch featured businesses, latest posts, and categories
  const featuredBusinesses = await getFeaturedBusinesses(6);
  const postsData = await getPosts(3);
  const categories = await getCategories();
  
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

      {/* Featured Businesses Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Businesses</h2>
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
              <p className="text-gray-500">No featured businesses yet. Be the first!</p>
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

      {/* Categories Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Business Categories</h2>
            <p className="mt-2 text-gray-600">Browse businesses by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/businesses?category=${category.id}`}
                className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                  {category.icon ? (
                    <span dangerouslySetInnerHTML={{ __html: category.icon }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>

          {categories.length > 8 && (
            <div className="text-center mt-8">
              <Link href="/businesses">
                <Button variant="outline">View All Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Latest Posts Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            <Link href="/news-feed" className="text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          
          {postsData.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {postsData.posts.slice(0, 2).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {/* Integrated ad in the feed, looks like a regular post */}
              <div className="md:col-span-1">
                <SubtleAdPlacement type="sidebar-native" className="h-full" />
              </div>
              
              {postsData.posts.slice(2).map((post) => (
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

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              B2B Social makes it easy to connect and collaborate with other businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Create Your Profile</h3>
              <p className="text-gray-600">Register your business and complete your profile to showcase your products or services.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Connect With Businesses</h3>
              <p className="text-gray-600">Find and follow other businesses that align with your interests and needs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Collaborate & Grow</h3>
              <p className="text-gray-600">Share updates, message other businesses, and find new opportunities for collaboration.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Discrete footer ad */}
      <div className="container mx-auto">
        <SubtleAdPlacement type="footer-discrete" />
      </div>
    </MainLayout>
  );
}