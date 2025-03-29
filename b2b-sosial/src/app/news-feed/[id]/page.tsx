// src/app/news-feed/[id]/page.tsx
import React from 'react';
import { getPost, getBusiness, getPosts } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import PostDetailClient from '@/components/posts/PostDetailClient';

// This function can be exported from a Server Component
export async function generateStaticParams() {
  try {
    const postsData = await getPosts(100); // Get up to 100 posts
    
    return postsData.posts.map((post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('Error fetching posts for static generation:', error);
    return [];
  }
}

// This is a Server Component that fetches data and passes it to the Client Component
export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const postId = params.id;
  
  try {
    // Fetch post data on the server
    const postData = await getPost(postId);
    
    if (!postData) {
      return (
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Post not found
              </h2>
              <p className="text-gray-500 mb-6">
                The post you are looking for might have been removed or is temporarily unavailable.
              </p>
            </div>
          </div>
        </MainLayout>
      );
    }
    
    // Fetch business data on the server
    const businessData = postData ? await getBusiness(postData.businessId) : null;
    
    // Pass the data to the Client Component
    return (
      <MainLayout>
        <PostDetailClient initialPost={postData} initialBusiness={businessData} />
      </MainLayout>
    );
  } catch (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Error loading post
            </h2>
            <p className="text-gray-500 mb-6">
              Failed to load post. Please try again later.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }
}