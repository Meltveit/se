// src/app/news-feed/[id]/page.tsx
import { Metadata } from 'next';
import { getPost, getBusiness } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import PostDetailClient from '@/components/posts/PostDetailClient';
import { notFound } from 'next/navigation';

// Generate static params with a simpler implementation
export async function generateStaticParams() {
  // Return at least a placeholder for static export
  return [{ id: 'placeholder' }];
}

// Generate metadata with Promise-based param typing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    
    // Special handling for placeholder during build
    if (resolvedParams.id === 'placeholder') {
      return {
        title: 'Post | B2B Social',
        description: 'View post details.'
      };
    }
    
    const postData = await getPost(resolvedParams.id);
    
    if (!postData) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.'
      };
    }
    
    return {
      title: postData.title,
      description: postData.summary || postData.content.substring(0, 160),
      openGraph: {
        title: postData.title,
        description: postData.summary || postData.content.substring(0, 160),
        images: postData.coverImage ? [{ url: postData.coverImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error Loading Post',
      description: 'An error occurred while loading the post.'
    };
  }
}

// Server component with Promise-based param typing
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const resolvedParams = await params;
    
    // Special handling for placeholder ID during static build
    if (resolvedParams.id === 'placeholder') {
      return (
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Post Not Found
              </h2>
              <p className="text-gray-500 mb-6">
                The requested post could not be found.
              </p>
            </div>
          </div>
        </MainLayout>
      );
    }
    
    // Fetch post data
    const postData = await getPost(resolvedParams.id);
    
    if (!postData) {
      notFound();
    }
    
    // Fetch associated business data
    const businessData = await getBusiness(postData.businessId);
    
    return (
      <MainLayout>
        <PostDetailClient 
          initialPost={postData} 
          initialBusiness={businessData} 
        />
      </MainLayout>
    );
  } catch (error) {
    console.error('Error loading post:', error);
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