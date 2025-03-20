export interface Business {
    id: string;
    name: string;
    description: string;
    tags: string[];
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  }