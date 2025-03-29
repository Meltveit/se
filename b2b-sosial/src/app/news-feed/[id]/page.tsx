import { Metadata } from 'next';
import { getPost, getBusiness, getPosts } from '@/lib/firebase/db';
import MainLayout from '@/components/layout/MainLayout';
import PostDetailClient from '@/components/posts/PostDetailClient';
import { notFound } from 'next/navigation';
import { Post } from '@/types';

// Type for page props
type PageProps = {
  params: { id: string };
};

// Generate static params
export async function generateStaticParams() {
  try {
    const postsData = await getPosts(100); // Get up to 100 posts
    
    return postsData.posts.map((post: Post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('Error fetching posts for static generation:', error);
    return [];
  }
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const postData = await getPost(params.id);
    
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

// Server component for post detail
export default async function PostDetailPage({ params }: PageProps) {
  try {
    // Fetch post data
    const postData = await getPost(params.id);
    
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