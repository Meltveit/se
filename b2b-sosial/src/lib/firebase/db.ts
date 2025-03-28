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
import { Business, Post, User, Conversation, Message } from '@/types'; // Added Conversation and Message

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

export const getFeaturedBusinesses = async (limitCount = 6) => {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    const businesses: Business[] = [];
    snapshot.forEach((doc) => {
      businesses.push({
        id: doc.id,
        ...doc.data() as Omit<Business, 'id'>
      });
    });
    
    return businesses;
  } catch (error) {
    console.error('Error fetching featured businesses:', error);
    throw error;
  }
};

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

export const updateBusinessProfileCompletion = async (
  businessId: string, 
  section: 'basicInfo' | 'contactDetails' | 'media' | 'categoriesAndTags',
  complete: boolean
): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    const businessDoc = await getDoc(businessRef);
    
    if (businessDoc.exists()) {
      const data = businessDoc.data();
      const profileCompletionStatus = data.profileCompletionStatus || {
        basicInfo: false,
        contactDetails: false,
        media: false,
        categoriesAndTags: false,
        completionPercentage: 25
      };
      
      profileCompletionStatus[section] = complete;
      
      const sections = ['basicInfo', 'contactDetails', 'media', 'categoriesAndTags'];
      const completedSections = sections.filter(s => profileCompletionStatus[s]).length;
      profileCompletionStatus.completionPercentage = 25 + (completedSections / sections.length) * 75;
      
      await updateDoc(businessRef, {
        profileCompletionStatus,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating business profile completion:', error);
    throw error;
  }
};

// Post related functions
export const createPost = async (businessId: string, postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const q = query(
      collection(db, 'posts'),
      where('businessId', '==', businessId),
      where('createdAt', '>=', oneWeekAgo),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.size >= 2) {
      throw new Error('Maximum post frequency reached (2 posts per week)');
    }
    
    const postRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      businessId,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return postRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (
  limitCount = 10, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  businessId?: string
) => {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (businessId) {
      constraints.push(where('businessId', '==', businessId));
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
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
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

export const updatePost = async (postId: string, data: Partial<Post>): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Categories and tags
export const getCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    const categories: any[] = [];
    
    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getTags = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'tags'));
    const tags: any[] = [];
    
    snapshot.forEach((doc) => {
      tags.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Conversation and Message related functions
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