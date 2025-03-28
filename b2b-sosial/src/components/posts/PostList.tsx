// src/components/posts/PostList.tsx
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
  skip?: number; // Legg til denne
  hideLoadMore?: boolean; // Legg til denne
}

const PostList: React.FC<PostListProps> = ({
  businessId,
  categoryId,
  tagId,
  initialLimit = 10,
  skip = 0, // Default verdi
  hideLoadMore = false, // Default verdi
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [businesses, setBusinesses] = useState<{ [key: string]: Business }>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Resten av komponenten
  // ...
  
  return (
    // Din eksisterende kode
    <div>
      {/* PostList innehold her */}
    </div>
  );
};

export default PostList;