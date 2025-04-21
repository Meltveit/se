// src/types/user.ts
import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  companies: string[]; // Array of company IDs that the user is associated with
  isAdmin: boolean;
}

export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
}