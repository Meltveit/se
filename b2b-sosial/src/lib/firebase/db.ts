// src/lib/firebase/db.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  addDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  QueryDocumentSnapshot,
  DocumentReference
} from 'firebase/firestore';
import { db } from './config';
import { Business, Post, User } from '@/types';
// Import Conversation og Message typene
import { Conversation, Message } from '@/types/message';
import { sendMessage } from '@/lib/firebase/messaging';
import { uploadMessageAttachment } from '@/lib/firebase/messageStorage';
  
// Business related functions
export const getBusinesses = async (
  limitCount = 10, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>, 
  filters?: QueryConstraint[]
) => {
  try {
    let businessQuery = collection(db, 'businesses');
    
    const constraints: QueryConstraint[] = [];
    if (filters && filters.length > 0) {
      constraints.push(...filters);
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(limitCount));
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(businessQuery, ...constraints);
    const snapshot = await getDocs(q);
    
    const businesses: Business[] = [];
    snapshot.forEach((doc) => {
      businesses.push({
        id: doc.id,
        ...doc.data() as Omit<Business, 'id'>
      });
    });
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    return { businesses, lastVisible };
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

// ... resten av dine eksisterende funksjoner ...

// Implementer getConversation som returnerer en Conversation
export const getConversation = async (conversationId: string): Promise<Conversation | null> => {
  try {
    const docRef = doc(db, 'conversations', conversationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Omit<Conversation, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

// Implementer getMessages som returnerer Message-array
export const getMessages = async (conversationId: string): Promise<Message[]> => {  
  try {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const messages: Message[] = [];
    
    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data() as Omit<Message, 'id'>
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const markConversationAsRead = async (conversationId: string, userId: string): Promise<void> => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`readBy.${userId}`]: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Omit<User, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};