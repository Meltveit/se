// src/app/company/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Tag, 
  Briefcase,
  FileText
} from 'lucide-react';
import { getCompanyBySlug } from '@/lib/db/companies';
import { getPosts } from '@/lib/db/posts';
import { Company } from '@/types/company';
import { Post } from '@/types/post';

export default function CompanyProfilePage() {
  const { slug } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // Fetch company data
        if (typeof slug === 'string') {
          const companyData = await getCompanyBySlug(slug);
          
          if (companyData) {
            setCompany(companyData);
            
            // Fetch company posts
            const { posts } = await getPosts(undefined, companyData.id);
            setPosts(posts);
          } else {
            setError('Company not found');
          }
        } else {
          setError('Invalid company URL');
        }
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <Building className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">The company you're looking for could not be found.</p>
          <Link href="/company/search" className="btn btn-primary">
            Browse Companies
          </Link>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Company Cover/Header */}
      <div className="bg-blue-600 h-48 md:h-64 relative">
        {company.coverImage ? (
          <div 
            className="w-full h-full bg-center bg-cover" 
            style={{ backgroundImage: `url(${company.coverImage})` }}
          ></div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">{company.name}</h1>
          </div>
        )}
        
        {/* Company Logo */}
        <div className="absolute -bottom-16 left-8 w-32 h-32 bg-white rounded-md shadow-md border-4 border-white flex items-center justify-center overflow-hidden">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
              className="w-full h-full object-contain"
            />
          ) : (
            <Building size={48} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Company Content Container */}
      <div className="container mx-auto px-4">
        <div className="pt-20 pb-8">
          {/* Company Basic Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>
              <p className="text-gray-600 mb-2">{company.tagline}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-1" />
                <span>
                  {[company.city, company.state, company.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link href={`/company/${slug}/contact`} className="btn btn-primary">
                Contact
              </Link>
              <button className="btn btn-secondary">
                Follow
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mt-8 border-b border-gray-200">
            <div className="flex space-x-8 overflow-x-auto">
              <button
                className={`pb-4 px-1 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`pb-4 px-1 text-sm font-medium ${
                  activeTab === 'posts'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('posts')}
              >
                Posts
              </button>
              <button
                className={`pb-4 px-1 text-sm font-medium ${
                  activeTab === 'about'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Description */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {company.name}</h2>
                  <div className="prose max-w-none">
                    <p>{company.description}</p>
                  </div>
                  
                  {/* Tags */}
                  {company.tags && company.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-gray-700 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {company.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recent Posts */}
                  {posts.length > 0 && (
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
                        <button
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setActiveTab('posts')}
                        >
                          View all
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {posts.slice(0, 3).map((post) => (
                          <Link
                            key={post.id}
                            href={`/posts/${post.slug}`}
                            className="block bg-white rounded-md border border-gray-200 p-4 hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-bold text-gray-900 mb-2">{post.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Company Info Sidebar */}
                <div>
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Company Information</h3>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {/* Basic Details */}
                      <div className="space-y-2">
                        {company.website && (
                          <div className="flex items-start">
                            <Globe size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <a 
                              href={company.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline break-all"
                            >
                              {company.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                        
                        {company.email && (
                          <div className="flex items-start">
                            <Mail size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <a 
                              href={`mailto:${company.email}`}  
                              className="text-blue-600 hover:underline break-all"
                            >
                              {company.email}
                            </a>
                          </div>
                        )}
                        
                        {company.phone && (
                          <div className="flex items-start">
                            <Phone size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <a 
                              href={`tel:${company.phone}`}
                              className="text-gray-700"
                            >
                              {company.phone}
                            </a>
                          </div>
                        )}
                        
                        {company.address && (
                          <div className="flex items-start">
                            <MapPin size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">
                              {[
                                company.address,
                                company.city,
                                company.state,
                                company.postalCode,
                                company.country
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <hr className="border-gray-200" />
                      
                      {/* Business Details */}
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Briefcase size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Sector</span>
                            <Link 
                              href={`/sector?id=${company.sector}`} 
                              className="text-gray-700 hover:text-blue-600"
                            >
                              {company.sector}
                            </Link>
                          </div>
                        </div>
                        
                        {company.yearFounded && (
                          <div className="flex items-start">
                            <Calendar size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-gray-500 text-sm block">Founded</span>
                              <span className="text-gray-700">{company.yearFounded}</span>
                            </div>
                          </div>
                        )}
                        
                        {company.employeeCount && (
                          <div className="flex items-start">
                            <Users size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-gray-500 text-sm block">Company Size</span>
                              <span className="text-gray-700">{company.employeeCount} employees</span>
                            </div>
                          </div>
                        )}
                        
                        {company.businessType && (
                          <div className="flex items-start">
                            <Tag size={16} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-gray-500 text-sm block">Type</span>
                              <span className="text-gray-700">{company.businessType}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Company Posts</h2>
                  
                  {/* This button would be conditional on user permissions */}
                  <Link href={`/company/${slug}/posts/new`} className="btn btn-primary">
                    <FileText size={16} className="mr-2" />
                    New Post
                  </Link>
                </div>
                
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        className="bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {post.featuredImage ? (
                          <div 
                            className="h-40 bg-center bg-cover" 
                            style={{ backgroundImage: `url(${post.featuredImage})` }}
                          ></div>
                        ) : (
                          <div className="h-40 bg-gray-200 flex items-center justify-center">
                            <FileText size={32} className="text-gray-400" />
                          </div>
                        )}
                        
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {post.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {post.publishedAt?.toDate().toLocaleDateString() || 'Draft'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-md shadow-sm">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
                    <p className="text-gray-600 mb-4">This company hasn't published any posts.</p>
                    
                    {/* This button would be conditional on user permissions */}
                    <Link href={`/company/${slug}/posts/new`} className="btn btn-primary">
                      Create First Post
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">About {company.name}</h2>
                
                <div className="prose max-w-none mb-8">
                  <p>{company.description}</p>
                </div>
                
                {/* Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-md border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Company Details</h3>
                    
                    <div className="space-y-4">
                      {company.yearFounded && (
                        <div className="flex items-start">
                          <Calendar size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Founded</span>
                            <span className="text-gray-700 font-medium">{company.yearFounded}</span>
                          </div>
                        </div>
                      )}
                      
                      {company.employeeCount && (
                        <div className="flex items-start">
                          <Users size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Company Size</span>
                            <span className="text-gray-700 font-medium">{company.employeeCount} employees</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <Briefcase size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500 text-sm block">Sector</span>
                          <Link 
                            href={`/sector?id=${company.sector}`} 
                            className="text-gray-700 hover:text-blue-600 font-medium"
                          >
                            {company.sector}
                          </Link>
                        </div>
                      </div>
                      
                      {company.businessType && (
                        <div className="flex items-start">
                          <Tag size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Business Type</span>
                            <span className="text-gray-700 font-medium">{company.businessType}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-md border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                    
                    <div className="space-y-4">
                      {company.website && (
                        <div className="flex items-start">
                          <Globe size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Website</span>
                            <a 
                              href={company.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline break-all font-medium"
                            >
                              {company.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {company.email && (
                        <div className="flex items-start">
                          <Mail size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Email</span>
                            <a 
                              href={`mailto:${company.email}`}  
                              className="text-blue-600 hover:underline break-all font-medium"
                            >
                              {company.email}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {company.phone && (
                        <div className="flex items-start">
                          <Phone size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Phone</span>
                            <a 
                              href={`tel:${company.phone}`}
                              className="text-gray-700 font-medium"
                            >
                              {company.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {company.address && (
                        <div className="flex items-start">
                          <MapPin size={20} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm block">Address</span>
                            <address className="text-gray-700 font-medium not-italic">
                              {company.address}<br />
                              {company.city}, {company.state} {company.postalCode}<br />
                              {company.country}
                            </address>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}