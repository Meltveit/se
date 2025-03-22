// src/lib/types.ts
export interface Business {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  companyType: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  website?: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
  };
  userId: string;
  createdAt: string;
  profileImage?: string; // URL til profilbildet
  backgroundImage?: string; // URL til bakgrunnsbildet
  galleryImages?: string[]; // URL-er til bilder i galleriet (kun for bedrifter)
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profession?: string;
  industry?: string;
  newsletter: boolean;
  createdAt: string;
  profileImage?: string; // URL til profilbildet
  backgroundImage?: string; // URL til bakgrunnsbildet
}