// src/types/sector.ts
import { Timestamp } from 'firebase/firestore';

export interface Sector {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  subcategories: Subcategory[];
  companyCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sectorId: string;
  companyCount: number;
}