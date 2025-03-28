import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Business } from '@/types';
import { getPosts } from '@/lib/firebase/db';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

interface BusinessPostsListProps {
  business: Business;
  limit?: number;
  showViewAll?: boolean;
}

const BusinessPostsList: React.FC<BusinessPostsListProps> = ({
  business,
  limit = 3,
  showViewAll = true,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPosts(limit, undefined, business.id);
        setPosts(result.posts);
        setHasMore(result.posts.length === limit);
      } catch {
        // Removed unused 'err' parameter
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [business.id, limit]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <Card title="Posts">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Posts">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card title="Posts">
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-300"
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
          <p className="mt-2 text-gray-500">No posts available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Posts"
      footer={
        showViewAll && hasMore ? (
          <Link href={`/businesses/${business.id}/posts`}>
            <Button variant="outline" fullWidth>
              View All Posts
            </Button>
          </Link>
        ) : null
      }
    >
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <Link href={`/news-feed/${post.id}`}>
              <div className="group">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  {post.title}
                </h3>
                
                {post.coverImage && (
                  <div className="mt-2 aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={640}
                      height={360}
                      className="object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}
                
                <div className="mt-2 text-sm text-gray-500">
                  <p className="line-clamp-3">
                    {post.summary || post.content.substring(0, 200)}
                    {(!post.summary && post.content.length > 200) ? '...' : ''}
                  </p>
                </div>
                
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="mx-1">•</span>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap">
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="mr-1 text-blue-600"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && <span>+{post.tags.length - 2}</span>}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BusinessPostsList;