// src/lib/firebase/populateSampleData.ts
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './config';

// Sample categories data
const sampleCategories = [
  { name: 'Technology', slug: 'technology', description: 'Tech companies and services', order: 1 },
  { name: 'Finance', slug: 'finance', description: 'Financial services and institutions', order: 2 },
  { name: 'Healthcare', slug: 'healthcare', description: 'Healthcare providers and services', order: 3 },
  { name: 'Manufacturing', slug: 'manufacturing', description: 'Production and manufacturing businesses', order: 4 },
  { name: 'Retail', slug: 'retail', description: 'Retail and e-commerce businesses', order: 5 },
  { name: 'Services', slug: 'services', description: 'Professional service providers', order: 6 },
  { name: 'Education', slug: 'education', description: 'Educational institutions and services', order: 7 },
  { name: 'Hospitality', slug: 'hospitality', description: 'Hotels, restaurants, and tourism', order: 8 },
];

// Sample tags data
const sampleTags = [
  // Technology tags
  { name: 'Software Development', slug: 'software-development', categoryId: 'technology', count: 0 },
  { name: 'Web Design', slug: 'web-design', categoryId: 'technology', count: 0 },
  { name: 'Mobile Apps', slug: 'mobile-apps', categoryId: 'technology', count: 0 },
  { name: 'IT Consulting', slug: 'it-consulting', categoryId: 'technology', count: 0 },
  { name: 'Cloud Services', slug: 'cloud-services', categoryId: 'technology', count: 0 },
  { name: 'Cybersecurity', slug: 'cybersecurity', categoryId: 'technology', count: 0 },
  { name: 'Data Analytics', slug: 'data-analytics', categoryId: 'technology', count: 0 },
  
  // Finance tags
  { name: 'Banking', slug: 'banking', categoryId: 'finance', count: 0 },
  { name: 'Insurance', slug: 'insurance', categoryId: 'finance', count: 0 },
  { name: 'Investments', slug: 'investments', categoryId: 'finance', count: 0 },
  { name: 'Accounting', slug: 'accounting', categoryId: 'finance', count: 0 },
  { name: 'Financial Planning', slug: 'financial-planning', categoryId: 'finance', count: 0 },
  
  // Healthcare tags
  { name: 'Medical Services', slug: 'medical-services', categoryId: 'healthcare', count: 0 },
  { name: 'Pharmaceuticals', slug: 'pharmaceuticals', categoryId: 'healthcare', count: 0 },
  { name: 'Medical Devices', slug: 'medical-devices', categoryId: 'healthcare', count: 0 },
  { name: 'Healthcare IT', slug: 'healthcare-it', categoryId: 'healthcare', count: 0 },
  
  // Manufacturing tags
  { name: 'Electronics', slug: 'electronics', categoryId: 'manufacturing', count: 0 },
  { name: 'Automotive', slug: 'automotive', categoryId: 'manufacturing', count: 0 },
  { name: 'Textiles', slug: 'textiles', categoryId: 'manufacturing', count: 0 },
  { name: 'Industrial Equipment', slug: 'industrial-equipment', categoryId: 'manufacturing', count: 0 },
  
  // Retail tags
  { name: 'E-commerce', slug: 'e-commerce', categoryId: 'retail', count: 0 },
  { name: 'Fashion', slug: 'fashion', categoryId: 'retail', count: 0 },
  { name: 'Electronics Retail', slug: 'electronics-retail', categoryId: 'retail', count: 0 },
  { name: 'Grocery', slug: 'grocery', categoryId: 'retail', count: 0 },
  
  // Services tags
  { name: 'Legal Services', slug: 'legal-services', categoryId: 'services', count: 0 },
  { name: 'Marketing', slug: 'marketing', categoryId: 'services', count: 0 },
  { name: 'Consulting', slug: 'consulting', categoryId: 'services', count: 0 },
  { name: 'Design Services', slug: 'design-services', categoryId: 'services', count: 0 },
  
  // Education tags
  { name: 'K-12 Education', slug: 'k-12-education', categoryId: 'education', count: 0 },
  { name: 'Higher Education', slug: 'higher-education', categoryId: 'education', count: 0 },
  { name: 'Online Learning', slug: 'online-learning', categoryId: 'education', count: 0 },
  { name: 'Educational Materials', slug: 'educational-materials', categoryId: 'education', count: 0 },
  
  // Hospitality tags
  { name: 'Hotels', slug: 'hotels', categoryId: 'hospitality', count: 0 },
  { name: 'Restaurants', slug: 'restaurants', categoryId: 'hospitality', count: 0 },
  { name: 'Travel Agency', slug: 'travel-agency', categoryId: 'hospitality', count: 0 },
  { name: 'Event Planning', slug: 'event-planning', categoryId: 'hospitality', count: 0 },
];

// Check and populate categories if needed
export const checkAndPopulateCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      console.log('No categories found, populating sample data...');
      
      const batches = sampleCategories.map(async (category, index) => {
        const docRef = doc(categoriesRef, category.slug);
        await setDoc(docRef, {
          ...category,
          createdAt: new Date()
        });
      });
      
      await Promise.all(batches);
      console.log('Sample categories populated successfully');
    }
  } catch (error) {
    console.error('Error checking/populating categories:', error);
  }
};

// Check and populate tags if needed
export const checkAndPopulateTags = async () => {
  try {
    const tagsRef = collection(db, 'tags');
    const snapshot = await getDocs(tagsRef);
    
    if (snapshot.empty) {
      console.log('No tags found, populating sample data...');
      
      const batches = sampleTags.map(async (tag) => {
        const docRef = doc(tagsRef, tag.slug);
        await setDoc(docRef, {
          ...tag,
          createdAt: new Date()
        });
      });
      
      await Promise.all(batches);
      console.log('Sample tags populated successfully');
    }
  } catch (error) {
    console.error('Error checking/populating tags:', error);
  }
};

// Check and populate both categories and tags
export const checkAndPopulateSampleData = async () => {
  await checkAndPopulateCategories();
  await checkAndPopulateTags();
};