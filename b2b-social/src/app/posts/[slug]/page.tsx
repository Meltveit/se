// src/app/posts/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Share2, 
  MessageSquare,
  Building
} from 'lucide-react';
import { getPostBySlug } from '@/lib/db/posts';
import { getCompanyById } from '@/lib/db/companies';
import { Post } from '@/types/post';
import { Company } from '@/types/company';

export default function PostDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        
        // Fetch post data
        if (typeof slug === 'string') {
          const postData = await getPostBySlug(slug);
          
          if (postData) {
            setPost(postData);
            
            // Fetch company data
            const companyData = await getCompanyById(postData.companyId);
            setCompany(companyData);
          } else {
            setError('Post not found');
          }
        } else {
          setError('Invalid post URL');
        }
      } catch (err) {
        console.error('Error fetching post data:', err);
        setError('Failed to load post data');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [slug]);

  const handleLike = () => {
    setLiked(!liked);
    // In a real app, we would call an API to update the like count
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
          <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">The post you're looking for could not be found.</p>
          <Link href="/posts" className="btn btn-primary">
            Browse Posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post || !company) {
    return null;
  }

  // Format date
  const publishedDate = post.publishedAt?.toDate 
    ? post.publishedAt.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Draft';

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Company Info */}
          <div className="mb-6">
            <Link
              href={`/company/${company.slug}`}
              className="flex items-center space-x-3 hover:text-blue-600 transition-colors"
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building size={24} className="text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-600">{company.tagline}</p>
              </div>
            </Link>
          </div>

          {/* Post Header */}
          <div className="bg-white rounded-t-lg p-6 border border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{publishedDate}</span>
              </div>
              
              <div className="flex items-center">
                <Eye size={16} className="mr-1" />
                <span>{post.viewCount} views</span>
              </div>
              
              <div className="flex items-center">
                <ThumbsUp size={16} className="mr-1" />
                <span>{post.likeCount} likes</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-1" />
                <span>{post.commentCount} comments</span>
              </div>
            </div>
            
            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {post.category}
              </span>
              
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-6">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
          
          {/* Post Content */}
          <div className="bg-white p-6 border-x border-b border-gray-200 rounded-b-lg mb-6">
            <div className="prose max-w-none">
              {/* In a real app, this would be a rich text renderer */}
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                    liked ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                  onClick={handleLike}
                >
                  <ThumbsUp size={18} />
                  <span>Like</span>
                </button>
                
                <button
                  className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100"
                  onClick={handleShare}
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
              
              <Link
                href={`/company/${company.slug}`}
                className="text-blue-600 hover:text-blue-800"
              >
                More from {company.name}
              </Link>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Comments</h3>
            
            {/* Comment Form */}
            <div className="mb-6">
              <textarea
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button className="btn btn-primary">Post Comment</button>
              </div>
            </div>
            
            {/* Comments List */}
            <div className="space-y-6">
              {post.commentCount > 0 ? (
                // This would be replaced with actual comments
                <div className="p-8 text-center text-gray-500">
                  <p>Comments would be displayed here</p>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare size={32} className="mx-auto mb-3" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}