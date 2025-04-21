// src/types/company.ts
import { Timestamp } from 'firebase/firestore';

export interface Company {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string | null;
  coverImage: string | null;
  website: string;
  email: string;
  phone: string;
  yearFounded: number | null;
  
  // Location
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  location?: {
    lat: number;
    lng: number;
  };
  
  // Business details
  sector: string;
  subsector?: string;
  employeeCount: string;
  businessType: string;
  tags: string[];
  
  // Relationships
  createdBy: string; // User ID
  members: string[]; // Array of user IDs
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  verified: boolean;
  featured: boolean;
  
  // Stats
  viewCount: number;
  followerCount: number;
}

export interface CompanyFormData {
  name: string;
  tagline: string;
  description: string;
  website: string;
  yearFounded: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  sector: string;
  employeeCount: string;
  businessType: string;
  tags: string;
}