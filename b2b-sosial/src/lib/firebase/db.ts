import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { Business, Post, User, Category, Tag } from '@/types';
import { Conversation, Message } from '@/types/message';

// Business related functions
export const getBusinesses = async (
  limitCount = 10, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>, 
  filters?: QueryConstraint[]
) => {
  try {
    const businessQuery = collection(db, 'businesses');
    
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

// Get a single business by ID
export const getBusiness = async (businessId: string): Promise<Business | null> => {
  try {
    const docRef = doc(db, 'businesses', businessId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Omit<Business, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching business:', error);
    throw error;
  }
};

// Update a business
export const updateBusiness = async (businessId: string, data: Partial<Business>): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating business:', error);
    throw error;
  }
};

// Update business profile completion status
export const updateBusinessProfileCompletion = async (
  businessId: string,
  field: keyof Business['profileCompletionStatus'],
  value: boolean
): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    const businessSnap = await getDoc(businessRef);
    
    if (!businessSnap.exists()) {
      throw new Error('Business not found');
    }
    
    const data = businessSnap.data();
    const completionStatus = data.profileCompletionStatus || {};
    completionStatus[field] = value;
    
    // Calculate completion percentage based on required fields
    const requiredFields = ['basicInfo', 'contactDetails', 'media', 'categoriesAndTags'];
    const completedFields = requiredFields.filter(f => completionStatus[f]).length;
    const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
    
    completionStatus.completionPercentage = completionPercentage;
    
    await updateDoc(businessRef, {
      profileCompletionStatus: completionStatus,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating business profile completion:', error);
    throw error;
  }
};

// Get featured businesses
export const getBusinessesForHomepage = async (
  limitCount = 6, 
  options: {
    category?: string;
    latitude?: number;
    longitude?: number;
    maxDistance?: number; // in kilometers
  } = {}
): Promise<Business[]> => {
  try {
    const { category, latitude, longitude, maxDistance } = options;
    
    // Prepare base query constraints
    const constraints: QueryConstraint[] = [];
    
    // Add category filter if provided
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    // Add geospatial filtering if location is provided
    if (latitude && longitude && maxDistance) {
      // Note: This is a simplified approach. 
      // Proper geospatial querying typically requires a geohash or geospatial index
      // You might need to implement more sophisticated geospatial filtering
      
      // Rough approximation of latitude/longitude bounding box
      const earthRadius = 6371; // kilometers
      const latDelta = maxDistance / earthRadius * (180 / Math.PI);
      const lonDelta = latDelta / Math.cos(latitude * Math.PI / 180);
      
      constraints.push(
        where('location.latitude', '>=', latitude - latDelta),
        where('location.latitude', '<=', latitude + latDelta),
        where('location.longitude', '>=', longitude - lonDelta),
        where('location.longitude', '<=', longitude + lonDelta)
      );
    }
    
    // Always add sorting to ensure some randomness
    constraints.push(
      orderBy('createdAt', 'desc'), // Recent businesses first
      limit(limitCount)
    );
    
    // Create query
    const q = query(
      collection(db, 'businesses'),
      ...constraints
    );
    
    const snapshot = await getDocs(q);
    
    const businesses: Business[] = [];
    snapshot.forEach((doc) => {
      businesses.push({
        id: doc.id,
        ...doc.data() as Omit<Business, 'id'>
      });
    });
    
    // If we don't have enough businesses and a category was specified, 
    // fall back to fetching from all categories
    if (businesses.length < limitCount && category) {
      const fallbackQ = query(
        collection(db, 'businesses'),
        orderBy('createdAt', 'desc'),
        limit(limitCount - businesses.length)
      );
      
      const fallbackSnapshot = await getDocs(fallbackQ);
      fallbackSnapshot.forEach((doc) => {
        // Avoid duplicates
        if (!businesses.some(b => b.id === doc.id)) {
          businesses.push({
            id: doc.id,
            ...doc.data() as Omit<Business, 'id'>
          });
        }
      });
    }
    
    return businesses;
  } catch (error) {
    console.error('Error fetching businesses for homepage:', error);
    throw error;
  }
};

// Categories and Tags
export const getCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data() as Omit<Category, 'id'>
      });
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getTags = async (): Promise<Tag[]> => {
  try {
    const q = query(
      collection(db, 'tags'),
      orderBy('name', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    const tags: Tag[] = [];
    snapshot.forEach((doc) => {
      tags.push({
        id: doc.id,
        ...doc.data() as Omit<Tag, 'id'>
      });
    });
    
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Post related functions
export const getPosts = async (
  limitCount = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  businessId?: string,
  categoryId?: string,
  tagId?: string
): Promise<{ posts: Post[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Add filters
    if (businessId) {
      constraints.push(where('businessId', '==', businessId));
    }
    
    if (categoryId) {
      constraints.push(where('categoryId', '==', categoryId));
    }
    
    if (tagId) {
      constraints.push(where('tags', 'array-contains', tagId));
    }
    
    constraints.push(where('status', '==', 'published'));
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(limitCount));
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, 'posts'), ...constraints);
    const snapshot = await getDocs(q);
    
    const posts: Post[] = [];
    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data() as Omit<Post, 'id'>
      });
    });
    
    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    
    return { posts, lastVisible };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPost = async (postId: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Omit<Post, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

export const createPost = async (businessId: string, postData: Partial<Post>): Promise<string> => {
  try {
    // Get business to check post limit
    const business = await getBusiness(businessId);
    if (!business) {
      throw new Error('Business not found');
    }
    
    // Check if business profile is complete enough
    if (business.profileCompletionStatus.completionPercentage < 50) {
      throw new Error('Business profile must be at least 50% complete to create posts');
    }
    
    // Create post with complete data
    const postRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      businessId,
      status: postData.status || 'published',
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: postData.status === 'published' ? serverTimestamp() : null
    });
    
    return postRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (postId: string, postData: Partial<Post>): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    
    // Check if status is changing to published
    if (postData.status === 'published') {
      await updateDoc(postRef, {
        ...postData,
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(postRef, {
        ...postData,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      status: 'deleted',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// User Management
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

// Conversation and Messages
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

// Message handling
export const sendMessage = async (messageData: {
  conversationId: string;
  text: string;
  senderId: string;
  attachments?: any[];
}): Promise<string> => {
  const { conversationId, text, senderId, attachments = [] } = messageData;
  
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

// Set Featured Business Status
export const setFeaturedBusinessStatus = async (
  businessId: string, 
  isFeatured: boolean,
  adminUserId: string
): Promise<void> => {
  try {
    // First, verify this is actually the admin
    if (adminUserId !== '2pQt0csZO3cHekZZP0q1l1juUVr2') {
      console.error('Unauthorized user attempt:', adminUserId);
      throw new Error('Unauthorized: Only super admin can update featured status');
    }
    
    console.log(`Setting featured status for business: ${businessId} to ${isFeatured}`);
    
    // Get business first to confirm it exists
    const businessRef = doc(db, 'businesses', businessId);
    const businessDoc = await getDoc(businessRef);
    
    if (!businessDoc.exists()) {
      throw new Error(`Business with ID ${businessId} not found`);
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {
      featured: isFeatured,
      updatedAt: serverTimestamp(),
      lastModifiedBy: adminUserId
    };
    
    // Only add featuredAt if featuring (not when unfeaturing)
    if (isFeatured) {
      updateData.featuredAt = serverTimestamp();
    }
    
    // Update the business document
    await updateDoc(businessRef, updateData);
    
    console.log(`Successfully updated featured status for business ${businessId} to ${isFeatured}`);
  } catch (error) {
    console.error('Error setting featured status:', error);
    throw error;
  }
};