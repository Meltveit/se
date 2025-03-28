'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPosts, deletePost } from '@/lib/firebase/db';
import { Post } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/contexts/ToastContext';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

export default function PostsPage() {
  const { businessId } = useAuth();
  const { showToast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const result = await getPosts(100, undefined, businessId);
        setPosts(result.posts);
      } catch {
        console.error('Error fetching posts');
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [businessId]);

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return '';
    }
  };

  // Handle delete
  const handleDelete = async (postId: string) => {
    try {
      setIsDeleting(true);
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      showToast('Post deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAuth requireBusiness>
        <DashboardLayout title="Manage Posts">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth requireBusiness>
      <DashboardLayout title="Manage Posts">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Your Posts</h2>
            <Link href="/dashboard/posts/new">
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Post
              </Button>
            </Link>
          </div>
          
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2v-7.41l-7 5.51-7-5.51V17a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
              <div className="mt-6">
                <Link href="/dashboard/posts/new">
                  <Button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Post
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <li key={post.id}>
                    <div className="block hover:bg-gray-50">
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          {post.coverImage && (
                            <div className="flex-shrink-0 h-16 w-16 mr-4">
                              <div className="relative h-16 w-16 rounded overflow-hidden">
                                <Image
                                  src={post.coverImage}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <div className="min-w-0 flex-1 px-4">
                            <div>
                              <p className="text-sm font-medium text-blue-600 truncate">{post.title}</p>
                              <p className="mt-1 text-sm text-gray-500 truncate">
                                {post.summary || post.content.substring(0, 100)}
                                {(!post.summary && post.content.length > 100) ? '...' : ''}
                              </p>
                              <div className="mt-2 flex">
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                                <div className="ml-4 flex items-center text-sm text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span>{post.viewCount || 0} views</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          {deleteConfirmId === post.id ? (
                            <div className="flex space-x-2">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                                isLoading={isDeleting}
                                disabled={isDeleting}
                              >
                                Delete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={isDeleting}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <Link href={`/dashboard/posts/${post.id}`}>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirmId(post.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </DashboardLayout>
    </AuthGuard>
  );
}