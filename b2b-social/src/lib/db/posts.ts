// src/lib/db/posts.ts
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    limit, 
    orderBy,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    increment,
    startAfter,
    DocumentSnapshot,
    QueryDocumentSnapshot
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '../firebase/config';
  import { Post, PostFormData } from '@/types/post';
  
  // Create a slug from post title
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  // Create a new post
  export const createPost = async (
    postData: PostFormData, 
    companyId: string,
    userId: string,
    featuredImage?: File
  ): Promise<string> => {
    try {
      // Create post ID and slug
      const postRef = doc(collection(db, 'posts'));
      const slug = createSlug(postData.title);
      
      let imageURL = null;
      
      // Upload featured image if provided
      if (featuredImage) {
        const imageRef = ref(storage, `post-images/${postRef.id}_${Date.now()}`);
        await uploadBytes(imageRef, featuredImage);
        imageURL = await getDownloadURL(imageRef);
      }
      
      // Process tags
      const tags = postData.tags
        ? postData.tags.split(',').map(tag => tag.trim())
        : [];
      
      // Prepare post document
      const now = serverTimestamp();
      const post: Omit<Post, 'id'> = {
        title: postData.title,
        slug,
        content: postData.content,
        excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
        featuredImage: imageURL,
        
        companyId,
        authorId: userId,
        
        category: postData.category,
        tags,
        
        createdAt: now,
        updatedAt: now,
        publishedAt: postData.status === 'published' ? now : null,
        status: postData.status,
        
        viewCount: 0,
        likeCount: 0,
        commentCount: 0
      };
      
      await setDoc(postRef, post);
      
      // Update company post count
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        postCount: increment(1),
        updatedAt: serverTimestamp()
      });
      
      return postRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  
  // Get a post by ID
  export const getPostById = async (id: string): Promise<Post | null> => {
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Post;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  };
  
  // Get a post by slug
  export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    try {
      const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Post;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting post by slug:', error);
      throw error;
    }
  };
  
  // Get posts with pagination and filters
  export const getPosts = async (
    categoryFilter?: string,
    companyId?: string,
    searchQuery?: string,
    lastDoc?: DocumentSnapshot,
    pageSize = 10
  ) => {
    try {
      let q: any;
      
      // Base query builder depending on filters
      if (companyId) {
        // Posts from a specific company
        q = query(
          collection(db, 'posts'),
          where('companyId', '==', companyId),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc'),
          limit(pageSize)
        );
      } else if (categoryFilter && categoryFilter !== 'all') {
        // Posts in a specific category
        q = query(
          collection(db, 'posts'),
          where('category', '==', categoryFilter),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc'),
          limit(pageSize)
        );
      } else {
        // All published posts
        q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc'),
          limit(pageSize)
        );
      }
      
      // Add pagination if lastDoc is provided
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];
      let lastVisible: QueryDocumentSnapshot | null = null;
      
      if (!querySnapshot.empty) {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() } as Post);
        });
        
        // Filter by search query if provided
        if (searchQuery) {
          const search = searchQuery.toLowerCase();
          return {
            posts: posts.filter(
              post => 
                post.title.toLowerCase().includes(search) ||
                post.content.toLowerCase().includes(search) ||
                post.tags.some(tag => tag.toLowerCase().includes(search))
            ),
            lastDoc: lastVisible
          };
        }
      }
      
      return { posts, lastDoc: lastVisible };
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  };
  
  // Update a post
  export const updatePost = async (
    id: string, 
    postData: Partial<Post>,
    featuredImage?: File
  ): Promise<void> => {
    try {
      const postRef = doc(db, 'posts', id);
      const updateData: any = { ...postData, updatedAt: serverTimestamp() };
      
      // Upload new featured image if provided
      if (featuredImage) {
        const imageRef = ref(storage, `post-images/${id}_${Date.now()}`);
        await uploadBytes(imageRef, featuredImage);
        updateData.featuredImage = await getDownloadURL(imageRef);
      }
      
      // Update publishedAt if status changed to published
      if (postData.status === 'published' && !postData.publishedAt) {
        updateData.publishedAt = serverTimestamp();
      }
      
      await updateDoc(postRef, updateData);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };
  
  // Delete a post
  export const deletePost = async (id: string): Promise<void> => {
    try {
      const postRef = doc(db, 'posts', id);
      
      // Get post data first to update related documents
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        
        // Update company's post count
        const companyRef = doc(db, 'companies', postData.companyId);
        await updateDoc(companyRef, {
          postCount: increment(-1),
          updatedAt: serverTimestamp()
        });
      }
      
      // Delete the post document
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };
  
  // Increment post view count
  export const incrementPostView = async (id: string): Promise<void> => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        viewCount: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing post view:', error);
    }
  };
  
  // Like or unlike a post
  export const togglePostLike = async (id: string, liked: boolean): Promise<void> => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        likeCount: increment(liked ? 1 : -1)
      });
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw error;
    }
  };