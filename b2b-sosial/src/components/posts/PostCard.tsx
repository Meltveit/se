import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Business } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  business?: Business;
}

const PostCard: React.FC<PostCardProps> = ({ post, business }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-48">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Business Info (if provided) */}
        {business && (
          <Link href={`/businesses/${business.id}`} className="flex items-center mb-3 group">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
              {business.logoUrl ? (
                <Image
                  src={business.logoUrl}
                  alt={business.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <span className="font-bold">{business.name.charAt(0)}</span>
              )}
            </div>
            <span className="ml-2 text-sm font-medium group-hover:text-blue-600">
              {business.name}
            </span>
          </Link>
        )}

        {/* Post Title and Summary */}
        <Link href={`/news-feed/${post.id}`} className="block group">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {post.summary || post.content.substring(0, 150)}
            {(!post.summary && post.content.length > 150) ? '...' : ''}
          </p>
        </Link>

        {/* Post Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            {formatDate(post.createdAt)}
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.viewCount}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{post.likeCount}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;