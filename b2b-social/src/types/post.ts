// src/types/post.ts
import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  
  // Relationships
  companyId: string;
  authorId: string;
  
  // Categorization
  category: string;
  tags: string[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
  status: 'draft' | 'published';
  
  // Stats
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  status: 'draft' | 'published';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  companyId?: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: number;
}