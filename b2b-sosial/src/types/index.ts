import { Timestamp } from 'firebase/firestore';

// Basic Types
export type FirebaseTimestamp = Timestamp;

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  phone?: string;
  profession?: string;
  industry?: string;
  bio?: string;
  country: string;
  region?: string;
  city?: string;
  isBusinessAdmin: boolean;
  businessId?: string;
  savedBusinesses?: string[];
  settings?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };
  lastActive?: FirebaseTimestamp;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// Business Types
export interface ProfileCompletionStatus {
  basicInfo: boolean;
  contactDetails: boolean;
  media: boolean;
  categoriesAndTags: boolean;
  completionPercentage: number;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone?: string;
  position?: string;
}

export interface SocialMedia {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface Business {
  id: string;
  name: string;
  orgNumber: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  subcategories?: string[];
  tags?: string[];
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  region?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  yearFounded?: number;
  employeeCount?: number;
  contactPerson: ContactPerson;
  socialMedia?: SocialMedia;
  logoUrl?: string;
  bannerUrl?: string;
  gallery?: string[];
  featured?: boolean;
  verified?: boolean;
  profileCompletionStatus: ProfileCompletionStatus;
  followerCount?: number;
  viewCount?: number;
  ownerId: string;
  admins?: string[];
  status: 'active' | 'pending' | 'suspended';
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// Post Types
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface ExternalLink {
  title: string;
  url: string;
  description?: string;
}

export interface Post {
  id: string;
  businessId: string;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  imageUrls?: string[];
  coverImage?: string;
  tags?: string[];
  attachments?: Attachment[];
  externalLinks?: ExternalLink[];
  status: 'published' | 'draft';
  publishedAt?: FirebaseTimestamp;
  featured?: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  authorId: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  attachments?: Attachment[];
  attachmentType?: string;
  read: boolean;
  readAt?: FirebaseTimestamp;
  createdAt: FirebaseTimestamp;
}

export interface Conversation {
  id: string;
  participants: string[];
  businessIds?: string[];
  lastMessage: {
    text: string;
    senderId: string;
    hasAttachment: boolean;
    createdAt: FirebaseTimestamp;
  };
  unreadCount: Record<string, number>;
  status: 'active' | 'archived';
  type?: string;
  subject?: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// Location Types
export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  currencies: string[];
  languages: string[];
  hasRegions: boolean;
}

export interface Region {
  code: string;
  name: string;
  countryCode: string;
}

// Category and Tag Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent?: string;
  order: number;
  createdAt: FirebaseTimestamp;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  count: number;
  createdAt: FirebaseTimestamp;
}

// Form state types
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}