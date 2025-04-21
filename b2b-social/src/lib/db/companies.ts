// src/lib/db/companies.ts
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
  import { Company, CompanyFormData } from '@/types/company';
  
  // Create a slug from company name
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  // Create a new company
  export const createCompany = async (
    companyData: CompanyFormData, 
    userId: string, 
    logoFile?: File
  ): Promise<string> => {
    try {
      // Create company ID and slug
      const companyRef = doc(collection(db, 'companies'));
      const slug = createSlug(companyData.name);
      
      let logoURL = null;
      
      // Upload logo if provided
      if (logoFile) {
        const logoRef = ref(storage, `company-logos/${companyRef.id}_${Date.now()}`);
        await uploadBytes(logoRef, logoFile);
        logoURL = await getDownloadURL(logoRef);
      }
      
      // Process tags
      const tags = companyData.tags
        ? companyData.tags.split(',').map(tag => tag.trim())
        : [];
      
      // Create company document
      const company: Omit<Company, 'id'> = {
        name: companyData.name,
        slug,
        tagline: companyData.tagline,
        description: companyData.description,
        logo: logoURL,
        coverImage: null,
        website: companyData.website,
        email: companyData.email,
        phone: companyData.phone,
        yearFounded: companyData.yearFounded ? parseInt(companyData.yearFounded) : null,
        
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        postalCode: companyData.postalCode,
        country: companyData.country,
        
        sector: companyData.sector,
        employeeCount: companyData.employeeCount,
        businessType: companyData.businessType,
        tags,
        
        createdBy: userId,
        members: [userId],
        
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        verified: false,
        featured: false,
        
        viewCount: 0,
        followerCount: 0
      };
      
      await setDoc(companyRef, company);
      
      // Add company to user's companies
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        companies: increment(1),
        updatedAt: serverTimestamp()
      });
      
      // Update sector counts
      const sectorRef = doc(db, 'sectors', companyData.sector);
      await updateDoc(sectorRef, {
        companyCount: increment(1)
      });
      
      return companyRef.id;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  };
  
  // Get a company by ID
  export const getCompanyById = async (id: string): Promise<Company | null> => {
    try {
      const docRef = doc(db, 'companies', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Company;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting company:', error);
      throw error;
    }
  };
  
  // Get a company by slug
  export const getCompanyBySlug = async (slug: string): Promise<Company | null> => {
    try {
      const q = query(collection(db, 'companies'), where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Company;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting company by slug:', error);
      throw error;
    }
  };
  
  // Get companies with pagination
  export const getCompanies = async (
    sectorFilter?: string,
    searchQuery?: string,
    lastDoc?: DocumentSnapshot,
    pageSize = 10
  ) => {
    try {
      let q: any;
      
      if (sectorFilter && sectorFilter !== 'all') {
        q = query(
          collection(db, 'companies'),
          where('sector', '==', sectorFilter),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(db, 'companies'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }
      
      // Add pagination if lastDoc is provided
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const companies: Company[] = [];
      let lastVisible: QueryDocumentSnapshot | null = null;
      
      if (!querySnapshot.empty) {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        querySnapshot.forEach((doc) => {
          companies.push({ id: doc.id, ...doc.data() } as Company);
        });
        
        // Filter by search query if provided
        if (searchQuery) {
          const search = searchQuery.toLowerCase();
          return {
            companies: companies.filter(
              company => 
                company.name.toLowerCase().includes(search) ||
                company.description.toLowerCase().includes(search) ||
                company.tags.some(tag => tag.toLowerCase().includes(search))
            ),
            lastDoc: lastVisible
          };
        }
      }
      
      return { companies, lastDoc: lastVisible };
    } catch (error) {
      console.error('Error getting companies:', error);
      throw error;
    }
  };
  
  // Update a company
  export const updateCompany = async (
    id: string, 
    companyData: Partial<Company>,
    logoFile?: File
  ): Promise<void> => {
    try {
      const companyRef = doc(db, 'companies', id);
      const updateData: any = { ...companyData, updatedAt: serverTimestamp() };
      
      // Upload new logo if provided
      if (logoFile) {
        const logoRef = ref(storage, `company-logos/${id}_${Date.now()}`);
        await uploadBytes(logoRef, logoFile);
        updateData.logo = await getDownloadURL(logoRef);
      }
      
      await updateDoc(companyRef, updateData);
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  };
  
  // Delete a company
  export const deleteCompany = async (id: string): Promise<void> => {
    try {
      const companyRef = doc(db, 'companies', id);
      
      // Get company data first to update related documents
      const companySnap = await getDoc(companyRef);
      if (companySnap.exists()) {
        const companyData = companySnap.data();
        
        // Update user's companies count
        const userRef = doc(db, 'users', companyData.createdBy);
        await updateDoc(userRef, {
          companies: increment(-1),
          updatedAt: serverTimestamp()
        });
        
        // Update sector count
        const sectorRef = doc(db, 'sectors', companyData.sector);
        await updateDoc(sectorRef, {
          companyCount: increment(-1)
        });
      }
      
      // Delete the company document
      await deleteDoc(companyRef);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  };