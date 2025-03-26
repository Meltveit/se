import React, { useState, useEffect } from 'react';
import { Post, Business } from '@/types';
import { getPosts } from '@/lib/firebase/db';
import { getBusiness } from '@/lib/firebase/db';
import PostCard from './PostCard';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface PostListProps {
  businessId?: string;
  categoryId?: string;
  tagId?: string;
  initialLimit?: number;
}

const PostList: React.FC<PostListProps> = ({
  businessId,
  categoryId,
  tagId,
  initialLimit = 10,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [businesses, setBusinesses] = useState<{ [key: string]: Business }>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = [];
        if (businessId) {
          // Filter is handled by the getPosts function
        }
        if (categoryId) {
          // Add category filter logic here
        }
        if (tagId) {
          // Add tag filter logic here
        }

        const result = await getPosts(initialLimit, undefined, businessId);
        setPosts(result.posts);
        setLastDoc(result.lastVisible);
        setHasMore(result.posts.length === initialLimit);

        // Fetch business details for each post
        const businessesData: { [key: string]: Business } = {};
        const businessIds = [...new Set(result.posts.map(post => post.businessId))];
        
        await Promise.all(
          businessIds.map(async (id) => {
            const business = await getBusiness(id);
            if (business) {
              businessesData[id] = business;
            }
          })
        );
        
        setBusinesses(businessesData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, [businessId, categoryId, tagId, initialLimit]);

  const handleLoadMore = async () => {
    if (!lastDoc || loadingMore) return;

    setLoadingMore(true);
    try {
      const result = await getPosts(initialLimit, lastDoc, businessId);
      setPosts((prevPosts) => [...prevPosts, ...result.posts]);
      setLastDoc(result.lastVisible);
      setHasMore(result.posts.length === initialLimit);

      // Fetch business details for new posts
      const newBusinessIds = [...new Set(result.posts.map(post => post.businessId))];
      const newBusinessesToFetch = newBusinessIds.filter(id => !businesses[id]);
      
      if (newBusinessesToFetch.length > 0) {
        const businessesData = { ...businesses };
        
        await Promise.all(
          newBusinessesToFetch.map(async (id) => {
            const business = await getBusiness(id);
            if (business) {
              businessesData[id] = business;
            }
          })
        );
        
        setBusinesses(businessesData);
      }
    } catch (err) {
      console.error('Error loading more posts:', err);
      setError('Failed to load more posts. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2v-7.41l-7 5.51-7-5.51V17a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-4 text-lg text-gray-600">No posts found</p>
        {(categoryId || tagId) && (
          <p className="mt-2 text-gray-500">Try adjusting your filters or check back later</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            business={businesses[post.businessId]}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            isLoading={loadingMore}
            disabled={loadingMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;