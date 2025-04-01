// src/utils/categoryPopulateUtil.ts
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

/**
 * Utility function to check and populate categories and tags 
 * if they don't exist in the Firebase database
 */
export const populateCategoriesAndTags = async () => {
  try {
    console.log('Checking if categories and tags need to be populated...');
    
    // Check if categories collection exists and has data
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    
    if (categoriesSnapshot.empty) {
      console.log('Categories collection is empty! Populating categories...');
      
      // Sample categories to add - these match your dropdown
      const categories = [
        { name: 'Technology & IT', slug: 'technology', description: 'Technology and IT services', order: 1 },
        { name: 'Finance & Banking', slug: 'finance', description: 'Financial services', order: 2 },
        { name: 'Healthcare & Medical', slug: 'healthcare', description: 'Healthcare services', order: 3 },
        { name: 'Education & Training', slug: 'education', description: 'Educational services', order: 4 },
        { name: 'Retail & E-commerce', slug: 'retail', description: 'Retail businesses', order: 5 },
        { name: 'Manufacturing & Industry', slug: 'manufacturing', description: 'Manufacturing companies', order: 6 },
        { name: 'Professional Services', slug: 'services', description: 'Professional services', order: 7 },
        { name: 'Construction & Real Estate', slug: 'construction', description: 'Construction and real estate', order: 8 },
        { name: 'Media & Entertainment', slug: 'media', description: 'Media and entertainment', order: 9 },
        { name: 'Hospitality & Tourism', slug: 'hospitality', description: 'Hospitality and tourism', order: 10 },
        { name: 'Transportation & Logistics', slug: 'transportation', description: 'Transportation and logistics', order: 11 },
        { name: 'Energy & Utilities', slug: 'energy', description: 'Energy and utilities', order: 12 },
        { name: 'Agriculture & Farming', slug: 'agriculture', description: 'Agriculture and farming', order: 13 },
        { name: 'Non-profit & NGO', slug: 'nonprofit', description: 'Non-profit organizations', order: 14 },
        { name: 'Other', slug: 'other', description: 'Other business types', order: 15 }
      ];
      
      // Add each category to Firestore
      for (const category of categories) {
        await setDoc(doc(db, 'categories', category.slug), {
          ...category,
          createdAt: new Date()
        });
        console.log(`Added category: ${category.name}`);
      }
      
      console.log('✅ Categories successfully populated!');
    } else {
      console.log(`Found ${categoriesSnapshot.size} categories in the database.`);
    }
    
    // Check if tags collection exists and has data
    const tagsSnapshot = await getDocs(collection(db, 'tags'));
    
    if (tagsSnapshot.empty) {
      console.log('Tags collection is empty! Populating tags...');
      
      // Sample tags to add
      const tags = [
        // Technology tags
        { name: 'Software Development', slug: 'software-development', categoryId: 'technology', count: 0 },
        { name: 'Web Design', slug: 'web-design', categoryId: 'technology', count: 0 },
        { name: 'Mobile Apps', slug: 'mobile-apps', categoryId: 'technology', count: 0 },
        { name: 'Cloud Services', slug: 'cloud-services', categoryId: 'technology', count: 0 },
        { name: 'Cybersecurity', slug: 'cybersecurity', categoryId: 'technology', count: 0 },
        { name: 'IT Consulting', slug: 'it-consulting', categoryId: 'technology', count: 0 },
        
        // Finance tags
        { name: 'Banking', slug: 'banking', categoryId: 'finance', count: 0 },
        { name: 'Insurance', slug: 'insurance', categoryId: 'finance', count: 0 },
        { name: 'Investments', slug: 'investments', categoryId: 'finance', count: 0 },
        { name: 'Accounting', slug: 'accounting', categoryId: 'finance', count: 0 },
        
        // Healthcare tags
        { name: 'Medical Services', slug: 'medical-services', categoryId: 'healthcare', count: 0 },
        { name: 'Pharmaceuticals', slug: 'pharmaceuticals', categoryId: 'healthcare', count: 0 },
        { name: 'Healthcare IT', slug: 'healthcare-it', categoryId: 'healthcare', count: 0 },
        
        // Education tags
        { name: 'Schools', slug: 'schools', categoryId: 'education', count: 0 },
        { name: 'Online Learning', slug: 'online-learning', categoryId: 'education', count: 0 },
        { name: 'Professional Training', slug: 'professional-training', categoryId: 'education', count: 0 },
        
        // Retail tags
        { name: 'E-commerce', slug: 'e-commerce', categoryId: 'retail', count: 0 },
        { name: 'Brick and Mortar', slug: 'brick-and-mortar', categoryId: 'retail', count: 0 },
        { name: 'Fashion', slug: 'fashion', categoryId: 'retail', count: 0 },
        
        // Manufacturing tags
        { name: 'Electronics', slug: 'electronics', categoryId: 'manufacturing', count: 0 },
        { name: 'Automotive', slug: 'automotive', categoryId: 'manufacturing', count: 0 },
        { name: 'Industrial Equipment', slug: 'industrial-equipment', categoryId: 'manufacturing', count: 0 },
        
        // Services tags
        { name: 'Consulting', slug: 'consulting', categoryId: 'services', count: 0 },
        { name: 'Legal Services', slug: 'legal-services', categoryId: 'services', count: 0 },
        { name: 'Marketing', slug: 'marketing', categoryId: 'services', count: 0 },
        
        // Construction tags
        { name: 'Residential', slug: 'residential', categoryId: 'construction', count: 0 },
        { name: 'Commercial', slug: 'commercial', categoryId: 'construction', count: 0 },
        { name: 'Architecture', slug: 'architecture', categoryId: 'construction', count: 0 },
        
        // Media tags
        { name: 'Advertising', slug: 'advertising', categoryId: 'media', count: 0 },
        { name: 'Digital Media', slug: 'digital-media', categoryId: 'media', count: 0 },
        { name: 'Entertainment', slug: 'entertainment', categoryId: 'media', count: 0 },
        
        // More diverse tags
        { name: 'Sustainable', slug: 'sustainable', categoryId: 'other', count: 0 },
        { name: 'Innovative', slug: 'innovative', categoryId: 'other', count: 0 },
        { name: 'Local Business', slug: 'local-business', categoryId: 'other', count: 0 },
        { name: 'International', slug: 'international', categoryId: 'other', count: 0 },
        { name: 'B2B', slug: 'b2b', categoryId: 'other', count: 0 },
        { name: 'B2C', slug: 'b2c', categoryId: 'other', count: 0 }
      ];
      
      // Add each tag to Firestore
      for (const tag of tags) {
        await setDoc(doc(db, 'tags', tag.slug), {
          ...tag,
          createdAt: new Date()
        });
        console.log(`Added tag: ${tag.name}`);
      }
      
      console.log('✅ Tags successfully populated!');
    } else {
      console.log(`Found ${tagsSnapshot.size} tags in the database.`);
    }
    
    return {
      success: true,
      message: 'Categories and tags are now set up!'
    };
  } catch (error) {
    console.error('Error setting up categories and tags:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Function to debug category and tag loading issues
export const debugCategoriesAndTags = async () => {
  try {
    console.group('🔍 Debugging Categories and Tags');
    
    // Check categories collection
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    console.log(`Categories in database: ${categoriesSnapshot.size}`);
    
    if (categoriesSnapshot.size > 0) {
      console.log('Sample categories:');
      categoriesSnapshot.docs.slice(0, 3).forEach(doc => {
        console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
      });
    } else {
      console.log('❌ No categories found in database!');
    }
    
    // Check tags collection
    const tagsSnapshot = await getDocs(collection(db, 'tags'));
    console.log(`Tags in database: ${tagsSnapshot.size}`);
    
    if (tagsSnapshot.size > 0) {
      console.log('Sample tags:');
      tagsSnapshot.docs.slice(0, 3).forEach(doc => {
        console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
      });
    } else {
      console.log('❌ No tags found in database!');
    }
    
    console.groupEnd();
    
    return {
      categoriesCount: categoriesSnapshot.size,
      tagsCount: tagsSnapshot.size
    };
  } catch (error) {
    console.error('Error debugging categories and tags:', error);
    return {
      categoriesCount: 0,
      tagsCount: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};