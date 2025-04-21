// src/app/company/[slug]/posts/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Image, X } from 'lucide-react';
import { getCompanyBySlug } from '@/lib/db/companies';
import { Company } from '@/types/company';

// Mock category options
const categories = [
  { id: 'news', name: 'News' },
  { id: 'product', name: 'Product' },
  { id: 'case-study', name: 'Case Study' },
  { id: 'article', name: 'Article' },
  { id: 'event', name: 'Event' },
  { id: 'announcement', name: 'Announcement' },
];

export default function CreatePostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'published', // or 'draft'
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // Fetch company data
        if (typeof slug === 'string') {
          const companyData = await getCompanyBySlug(slug);
          
          if (companyData) {
            setCompany(companyData);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company) {
      setError('Company information is required');
      return;
    }
    
    // Basic validation
    if (!formData.title || !formData.content || !formData.category) {
      setError('Title, content, and category are required');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Create FormData for the API request
      const apiFormData = new FormData();
      apiFormData.append('title', formData.title);
      apiFormData.append('content', formData.content);
      apiFormData.append('excerpt', formData.excerpt);
      apiFormData.append('category', formData.category);
      apiFormData.append('tags', formData.tags);
      apiFormData.append('status', formData.status);
      apiFormData.append('companyId', company.id);
      
      if (imageFile) {
        apiFormData.append('featuredImage', imageFile);
      }
      
      // TODO: In a real app, we would call the API to create the post
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: apiFormData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }
      
      // For now, simulate success after a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the company's posts page
      router.push(`/company/${slug}?tab=posts`);
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">Unable to create a post at this time.</p>
          <Link href="/company/search" className="btn btn-primary">
            Browse Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Post</h1>
            {company && (
              <p className="text-gray-600">
                Posting as{' '}
                <Link href={`/company/${company.slug}`} className="text-blue-600 hover:underline">
                  {company.name}
                </Link>
              </p>
            )}
          </div>
          
          {/* Create Post Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Post Details</h2>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Publishing...' : 'Publish Post'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Post Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter a title for your post"
                  required
                />
              </div>
              
              {/* Featured Image */}
              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                
                {imagePreview ? (
                  <div className="relative mb-3">
                    <img
                      src={imagePreview}
                      alt="Featured image preview"
                      className="max-h-64 w-auto rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-500 hover:text-red-500 shadow-md"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 mb-3">
                    <label htmlFor="featuredImage" className="cursor-pointer p-4 text-center">
                      <Image size={32} className="mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload an image</span>
                    </label>
                  </div>
                )}
                
                <input
                  type="file"
                  id="featuredImage"
                  name="featuredImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                <p className="text-xs text-gray-500">
                  Recommended size: 1200 x 630 pixels. Max file size: 2MB.
                </p>
              </div>
              
              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Post Content*
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="input"
                  rows={12}
                  placeholder="Write your post content here..."
                  required
                ></textarea>
              </div>
              
              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="input"
                  rows={3}
                  placeholder="A short summary of your post (optional)"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  If left empty, an excerpt will be generated from the beginning of your post.
                </p>
              </div>
              
              {/* Category & Tags */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. business, marketing, technology"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter tags separated by commas
                  </p>
                </div>
              </div>
              
              {/* Publishing Options */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing Options</h3>
                
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2">Publish immediately</span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2">Save as draft</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Form Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {formData.status === 'published' 
                  ? (submitting ? 'Publishing...' : 'Publish Post') 
                  : (submitting ? 'Saving...' : 'Save Draft')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}