// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

// Using a server component for the main page
export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find the Right Business Partners</h1>
            <p className="text-lg mb-8">Explore, connect and collaborate with companies across all sectors</p>
            
            {/* Search Bar */}
            <div className="bg-white p-1 rounded-md shadow-md flex max-w-2xl mx-auto">
              <div className="flex items-center flex-1">
                <Search size={20} className="text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  placeholder="Search for companies, sectors or services..."
                  className="w-full p-2 text-gray-800 focus:outline-none"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Explore Companies</h2>
            <Link href="/company/search" className="text-blue-600 hover:text-blue-800 text-sm">View all</Link>
          </div>
          
          {/* Featured Companies Grid - Will be populated from database */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder for empty state */}
            <div className="col-span-4 py-12 text-center">
              <div className="bg-gray-100 rounded-lg p-8 max-w-lg mx-auto">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No companies yet</h3>
                <p className="text-gray-600 mb-4">Be the first to create a company profile on our platform!</p>
                <Link href="/create-company" className="btn btn-primary inline-block">
                  Create Company
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Industry News</h2>
            <Link href="/posts" className="text-blue-600 hover:text-blue-800 text-sm">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for empty state */}
            <div className="col-span-3 py-12 text-center">
              <div className="bg-white rounded-lg p-8 max-w-lg mx-auto">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">
                  Once companies start sharing content, industry news and insights will appear here.
                </p>
                <Link href="/create-company" className="text-blue-600 hover:text-blue-800 font-medium">
                  Create a company to start posting
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Business Sectors</h2>
          
          {/* Static sector grid as placeholders */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {["Technology", "Manufacturing", "Finance", "Healthcare", "Education", "Logistics"].map((sector, index) => (
              <Link 
                href="/sector" 
                key={index} 
                className="bg-white border border-gray-200 rounded-md p-3 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-md mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs font-bold">{sector.charAt(0)}</span>
                </div>
                <h3 className="text-sm font-medium">{sector}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to expand your B2B network?</h2>
          <p className="mb-6">Join thousands of businesses already connecting and collaborating on our platform.</p>
          <Link href="/create-company" className="px-6 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 inline-block">
            Create Company Profile
          </Link>
        </div>
      </section>
    </div>
  );
}