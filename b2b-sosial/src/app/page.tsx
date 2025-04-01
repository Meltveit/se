// src/app/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { getFeaturedBusinesses, getCategories, getPosts } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import BusinessCard from '@/components/businesses/BusinessCard';
import PostCard from '@/components/posts/PostCard';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';
import {
  Computer,
  DollarSign,
  Stethoscope,
  GraduationCap,
  ShoppingCart,
  Factory,
  Briefcase,
  Building2,
  Film,
  Hotel,
  Truck,
  Flame,
  Leaf,
  CupSoda,
  Network,
  Rocket,
  HeartHandshake,
  Cog,
  Palette,
  MoreHorizontal
} from 'lucide-react';

// Define category icon mapping
const categoryIcons = {
  technology: Computer,
  finance: DollarSign,
  healthcare: Stethoscope,
  education: GraduationCap,
  retail: ShoppingCart,
  manufacturing: Factory,
  services: Briefcase,
  construction: Building2,
  media: Film,
  hospitality: Hotel,
  transportation: Truck,
  energy: Flame,
  agriculture: Leaf,
  foodBeverage: CupSoda,
  distribution: Network,
  startup: Rocket,
  nonprofit: HeartHandshake,
  production: Cog,
  creative: Palette,
  other: MoreHorizontal
};

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

      {/* Categories Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Business Categories</h2>
            <p className="mt-2 text-gray-600">Browse businesses by category</p>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto space-x-4 py-4 px-4 scrollbar-hide scroll-smooth">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || MoreHorizontal;
                return (
                  <Link
                    key={category.id}
                    href={`/businesses?category=${category.id}`}
                    className="flex-shrink-0 flex flex-col items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 group-hover:shadow-md transition-all duration-300">
                      <Icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </div>
                    <span className="text-xs text-gray-700 text-center capitalize group-hover:text-blue-800 transition-colors">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Scroll indicators */}
            <div className="hidden md:block">
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-100/50 hover:bg-gray-200/50 rounded-full p-2 cursor-pointer scroll-left-btn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-100/50 hover:bg-gray-200/50 rounded-full p-2 cursor-pointer scroll-right-btn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
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

      {/* Latest Posts Section */}
      <div className="py-12 bg-white">
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