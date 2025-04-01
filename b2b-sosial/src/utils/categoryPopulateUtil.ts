// src/utils/categoryPopulateUtil.ts
import { CATEGORIES, TAGS, TagCategory, TagItem } from '@/lib/geographic-data';

/**
 * Simulate populating categories and tags
 * In this version, we're just returning success since categories and tags are hardcoded
 */
export const populateCategoriesAndTags = async () => {
  try {
    console.log('Categories and tags are hardcoded. No database population needed.');
    
    return {
      success: true,
      message: 'Categories and tags are ready to use.',
      categoriesCount: CATEGORIES.length,
      tagsCount: Object.values(TAGS).reduce((total, categoryTags: TagItem[]) => total + categoryTags.length, 0)
    };
  } catch (error) {
    console.error('Unexpected error in category population:', error);
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      categoriesCount: 0,
      tagsCount: 0
    };
  }
};

/**
 * Debug function to show categories and tags information
 */
export const debugCategoriesAndTags = async () => {
  try {
    console.group('🔍 Debugging Categories and Tags');
    
    console.log('Categories:');
    CATEGORIES.forEach(category => {
      console.log(`- ${category.value}: ${category.label}`);
    });
    
    console.log('\nTags:');
    (Object.entries(TAGS) as Array<[TagCategory, TagItem[]]>).forEach(([category, tags]) => {
      console.log(`\n${category.toUpperCase()} Tags:`);
      tags.forEach(tag => {
        console.log(`- ${tag.value}: ${tag.label}`);
      });
    });
    
    console.groupEnd();
    
    return {
      categoriesCount: CATEGORIES.length,
      tagsCount: Object.values(TAGS).reduce((total, categoryTags: TagItem[]) => total + categoryTags.length, 0)
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