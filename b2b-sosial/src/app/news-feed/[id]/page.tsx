'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost, getBusiness } from '@/lib/firebase/db';
import { Post, Business } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import SubtleAdPlacement from '@/components/common/SubtleAdPlacement';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch post and business data
  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        
        // Fetch post
        const postData = await getPost(postId);
        if (!postData) {
          setError('Post not found');
          return;
        }
        
        setPost(postData);
        
        // Fetch business
        const businessData = await getBusiness(postData.businessId);
        if (businessData) {
          setBusiness(businessData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      return format(date, 'MMMM d, yyyy');
    } catch (err) {
      return '';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                {error || 'Post not found'}
              </h2>
              <p className="text-gray-500 mb-6">
                The post you are looking for might have been removed or is temporarily unavailable.
              </p>
              <Button onClick={() => router.push('/news-feed')} variant="outline">
                Back to News Feed
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            {/* Business Info and Post Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center">
                {business && (
                  <Link href={`/businesses/${business.id}`} className="flex items-center group">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {business.logoUrl ? (
                        <Image
                          src={business.logoUrl}
                          alt={business.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 font-semibold">{business.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {business.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
              
              <div className="flex space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.viewCount || 0} views</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8">
              <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <Card className="mb-8 prose prose-blue max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </Card>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link key={index} href={`/news-feed?tag=${tag}`}>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Subtle Ad */}
          <SubtleAdPlacement type="content-bottom" />
          
          {/* Share and Navigation */}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => router.push('/news-feed')}>
              Back to News Feed
            </Button>
            
            {business && (
              <Link href={`/businesses/${business.id}`}>
                <Button>
                  View {business.name}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}