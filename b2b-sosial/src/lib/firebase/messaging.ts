import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryConstraint,
  WriteBatch,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { Conversation, Message } from '@/types/message';
import { Business, User } from '@/types';

// Create a new conversation
export const createConversation = async ({
  participants,
  subject,
  businessIds,
}: {
  participants: string[];
  subject?: string;
  businessIds?: string[];
}): Promise<string> => {
  try {
    // Check if a conversation between these participants already exists
    const existingConversation = await findExistingConversation(participants);
    
    if (existingConversation) {
      return existingConversation.id;
    }
    
    // Create a new conversation
    const conversationRef = await addDoc(collection(db, 'conversations'), {
      participants,
      businessIds: businessIds || [],
      lastMessage: {
        text: '',
        senderId: '',
        hasAttachment: false,
        createdAt: serverTimestamp(),
      },
      unreadCount: participants.reduce((acc: Record<string, number>, participantId) => {
        acc[participantId] = 0;
        return acc;
      }, {}),
      status: 'active',
      type: businessIds && businessIds.length > 0 ? 'business-to-business' : 'general',
      subject: subject || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return conversationRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// Find an existing conversation between participants
export const findExistingConversation = async (participants: string[]): Promise<Conversation | null> => {
  try {
    // Sort participant IDs to ensure consistent order for query
    const sortedParticipants = [...participants].sort();
    
    // Create a query to find existing conversation with exactly these participants
    const q = query(
      collection(db, 'conversations'),
      where('participants', '==', sortedParticipants),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    // Return the first matching conversation
    const conversationData = snapshot.docs[0].data() as Omit<Conversation, 'id'>;
    return {
      id: snapshot.docs[0].id,
      ...conversationData,
    };
  } catch (error) {
    console.error('Error finding existing conversation:', error);
    throw error;
  }
};

// Get conversations for a user
export const getConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    const conversations: Conversation[] = [];
    snapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data() as Omit<Conversation, 'id'>
      });
    });
    
    return conversations;
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

// Get a single conversation by ID
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
    console.error('Error getting conversation:', error);
    throw error;
  }
};

// Mark a conversation as read for a user
export const markConversationAsRead = async (conversationId: string, userId: string): Promise<void> => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      throw new Error('Conversation not found');
    }
    
    const conversation = conversationSnap.data();
    const unreadCount = { ...(conversation.unreadCount || {}) };
    
    // If the user has unread messages, mark them as read
    if (unreadCount[userId] && unreadCount[userId] > 0) {
      unreadCount[userId] = 0;
      
      await updateDoc(conversationRef, {
        unreadCount,
        updatedAt: serverTimestamp(),
      });
      
      // Also mark all messages as read
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId),
        where('read', '==', false)
      );
      
      const messagesSnapshot = await getDocs(q);
      
      const batch: WriteBatch = writeBatch(db);
      messagesSnapshot.forEach((messageDoc) => {
        const messageRef = doc(db, 'messages', messageDoc.id);
        batch.update(messageRef, {
          read: true,
          readAt: serverTimestamp(),
        });
      });
      
      await batch.commit();
    }
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};

// Get messages for a conversation
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
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async ({
  conversationId,
  text,
  senderId,
  attachments = [],
}: {
  conversationId: string;
  text: string;
  senderId: string;
  attachments?: any[];
}): Promise<string> => {
  try {
    // Create message
    const messageRef = await addDoc(collection(db, 'messages'), {
      conversationId,
      senderId,
      text,
      attachments,
      read: false,
      createdAt: serverTimestamp(),
    });
    
    // Update conversation with last message info
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      throw new Error('Conversation not found');
    }
    
    const conversation = conversationSnap.data();
    const participants = conversation.participants || [];
    const unreadCount = { ...(conversation.unreadCount || {}) };
    
    // Increment unread count for all participants except sender
    participants.forEach((participantId: string) => {
      if (participantId !== senderId) {
        unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
      }
    });
    
    await updateDoc(conversationRef, {
      lastMessage: {
        text,
        senderId,
        hasAttachment: attachments.length > 0,
        createdAt: serverTimestamp(),
      },
      unreadCount,
      updatedAt: serverTimestamp(),
    });
    
    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Search for users to message
export const searchUsers = async (queryText: string, limitNum: number = 5): Promise<User[]> => {
  try {
    // In a real implementation, you would have a more sophisticated search
    // For now, we'll use a simple startsWith query on the firstName and lastName fields
    const firstNameQuery = queryText.toLowerCase();
    const lastNameQuery = queryText.toLowerCase();
    
    const firstNameQ = query(
      collection(db, 'users'),
      where('firstName', '>=', firstNameQuery),
      where('firstName', '<=', firstNameQuery + String.fromCharCode(0xf8ff)),
      limit(limitNum)
    );
    
    const lastNameQ = query(
      collection(db, 'users'),
      where('lastName', '>=', lastNameQuery),
      where('lastName', '<=', lastNameQuery + String.fromCharCode(0xf8ff)),
      limit(limitNum)
    );
    
    const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([
      getDocs(firstNameQ),
      getDocs(lastNameQ)
    ]);
    
    const userMap = new Map<string, User>();
    
    // Add users from firstName query
    firstNameSnapshot.forEach((docSnapshot) => {
      const userData = docSnapshot.data() as User;
      userMap.set(docSnapshot.id, {
        ...userData,
        id: docSnapshot.id
      });
    });
    
    // Add users from lastName query
    lastNameSnapshot.forEach((docSnapshot) => {
      const userData = docSnapshot.data() as User;
      userMap.set(docSnapshot.id, {
        ...userData,
        id: docSnapshot.id
      });
    });
    
    // Convert map to array
    return Array.from(userMap.values());
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Search for businesses to message
export const searchBusinesses = async (queryText: string, limitNum: number = 5): Promise<Business[]> => {
  try {
    // In a real implementation, you would have a more sophisticated search
    // For now, we'll use a simple startsWith query on the name field
    const nameQuery = queryText.toLowerCase();
    
    const q = query(
      collection(db, 'businesses'),
      where('name', '>=', nameQuery),
      where('name', '<=', nameQuery + String.fromCharCode(0xf8ff)),
      limit(limitNum)
    );
    
    const snapshot = await getDocs(q);
    
    const businesses: Business[] = [];
    snapshot.forEach((docSnapshot) => {
      const businessData = docSnapshot.data() as Business;
      businesses.push({
        ...businessData,
        id: docSnapshot.id
      });
    });
    
    return businesses;
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
};