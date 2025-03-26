import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut as firebaseSignOut,
    sendEmailVerification,
    User,
    UserCredential
  } from 'firebase/auth';
  import { auth, db } from './config';
  import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
  
  export interface RegisterUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: string;
    region?: string;
  }
  
  export interface RegisterBusinessData {
    name: string;
    orgNumber: string;
    contactPersonEmail: string;
    contactPersonName: string;
    password: string;
    acceptTerms: boolean;
    subscribeNewsletter?: boolean;
  }
  
  // Register a new user
  export const registerUser = async (userData: RegisterUserData): Promise<UserCredential> => {
    const { email, password, ...profileData } = userData;
    
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        ...profileData,
        isBusinessAdmin: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return userCredential;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  
  // Register a new business
  export const registerBusiness = async (businessData: RegisterBusinessData): Promise<UserCredential> => {
    const { name, orgNumber, contactPersonEmail, contactPersonName, password } = businessData;
    
    try {
      // Create user in Firebase Auth (contact person will be the user)
      const userCredential = await createUserWithEmailAndPassword(auth, contactPersonEmail, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: contactPersonEmail,
        firstName: contactPersonName.split(' ')[0],
        lastName: contactPersonName.split(' ').slice(1).join(' '),
        isBusinessAdmin: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Create business document in Firestore
      const businessRef = doc(db, 'businesses', user.uid);
      await setDoc(businessRef, {
        name,
        orgNumber,
        contactPerson: {
          name: contactPersonName,
          email: contactPersonEmail,
        },
        profileCompletionStatus: {
          basicInfo: false,
          contactDetails: false,
          media: false,
          categoriesAndTags: false,
          completionPercentage: 25, // 25% complete after initial registration
        },
        ownerId: user.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return userCredential;
    } catch (error) {
      console.error('Error registering business:', error);
      throw error;
    }
  };
  
  // Sign in user
  export const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  
  // Sign out user
  export const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  // Reset password
  export const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };
  
  // Get user profile data
  export const getUserProfile = async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };
  
  // Check if user is a business admin
  export const isBusinessAdmin = async (user: User): Promise<boolean> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data().isBusinessAdmin === true;
      }
      return false;
    } catch (error) {
      console.error('Error checking business admin status:', error);
      return false;
    }
  };