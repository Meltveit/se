import { Timestamp } from 'firebase/firestore';
import { User, Business } from './index';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachments?: Attachment[];
  read: boolean;
  readAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  businessIds?: string[]; // Business IDs if applicable
  lastMessage: {
    text: string;
    senderId: string;
    hasAttachment: boolean;
    createdAt: Timestamp;
  };
  unreadCount: {
    [userId: string]: number;
  };
  status: 'active' | 'archived';
  type: 'inquiry' | 'application' | 'business-to-business' | 'general';
  subject?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ConversationWithParticipants extends Conversation {
  participantDetails: (User | Business)[];
  otherParticipant?: User | Business; // The other participant (in a 1-to-1 conversation)
}