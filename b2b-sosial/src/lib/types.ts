export interface Business {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    description: string;
    categories: string[];
    profileImage?: string;
    bannerImage?: string;
    contactPerson: string;
    orgNumber: string;
  }