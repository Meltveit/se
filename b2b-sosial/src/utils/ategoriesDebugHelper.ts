// src/utils/categoriesDebugHelper.ts
/**
 * This utility helps debug issues with the categories and tags page.
 * It provides functions to verify data loading and component rendering.
 */

import { Category, Tag } from '@/types';
import { getCategories, getTags } from '@/lib/firebase/db';

/**
 * Check if categories and tags are loading properly
 */
export const verifyCategoriesAndTags = async (): Promise<{
  success: boolean;
  categories: Category[];
  tags: Tag[];
  message: string;
}> => {
  try {
    // Fetch categories
    const categories = await getCategories();
    
    // Fetch tags
    const tags = await getTags();
    
    // Check if both loaded successfully
    if (categories && categories.length > 0 && tags && tags.length > 0) {
      return {
        success: true,
        categories,
        tags,
        message: `Successfully loaded ${categories.length} categories and ${tags.length} tags.`
      };
    }
    
    // Handle case where one or both are empty
    let message = '';
    if (!categories || categories.length === 0) {
      message += 'No categories found. ';
    }
    if (!tags || tags.length === 0) {
      message += 'No tags found. ';
    }
    
    return {
      success: false,
      categories: categories || [],
      tags: tags || [],
      message: message || 'Data loaded but appears to be empty.'
    };
  } catch (error) {
    return {
      success: false,
      categories: [],
      tags: [],
      message: `Error loading data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Helper function to check the rendering of the SearchableSelect component
 * Call this from your page component to debug issues
 */
export const debugSearchableSelect = (
  options: { value: string; label: string }[],
  selectedValues: string[]
): string => {
  if (!options || options.length === 0) {
    return 'No options available for SearchableSelect';
  }
  
  const sample = options.slice(0, 3).map(o => `${o.value}: ${o.label}`).join(', ');
  return `SearchableSelect has ${options.length} options (e.g., ${sample}) and ${selectedValues.length} selected values`;
};

// Add a console debug utility for browser console debugging
export const consoleDebugCategories = async (): Promise<void> => {
  try {
    const result = await verifyCategoriesAndTags();
    console.group('Categories and Tags Debug Info');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    console.log('Categories:', result.categories);
    console.log('Tags:', result.tags);
    console.groupEnd();
  } catch (error) {
    console.error('Debug error:', error);
  }
};