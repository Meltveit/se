import React from 'react';
import { Post, Business } from '@/types';
import { getPosts } from '@/lib/firebase/db';
import Card from '@/components/common/Card';

interface PostListProps {
  businessId?: string;
  categoryId?: string;
  tagId?: string;
  initialLimit?: number;
  skip?: number;
  hideLoadMore?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  businessId,
  categoryId,
  tagId,
  initialLimit = 10,
  skip = 0,
  hideLoadMore = false
}) => {
  // Placeholder for actual implementation
  const posts: Post[] = [];
  const businesses: Record<string, Business> = {};

  const handleLoadMore = () => {
    // Placeholder for load more functionality
  };

  return (
    <div>
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts found.
        </div>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="mb-4">
            <div>
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-600 mt-2">
                {post.content.substring(0, 200)}
                {post.content.length > 200 ? '...' : ''}
              </p>
              
              {businesses[post.businessId] && (
                <div className="mt-4 flex items-center">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {businesses[post.businessId].name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {businesses[post.businessId].name}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Views: {post.viewCount}</span>
                <span>Likes: {post.likeCount}</span>
                <span>Comments: {post.commentCount}</span>
              </div>
            </div>
          </Card>
        ))
      )}

      {!hideLoadMore && posts.length > 0 && (
        <div className="text-center mt-6">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleLoadMore}
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;