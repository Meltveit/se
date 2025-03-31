// scripts/static-export-migration.js
/**
 * This script helps migrate a Next.js app to static export
 * by updating navigation links in component files
 * 
 * Run with: node scripts/static-export-migration.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// File paths to process (relative to project root)
const filesToProcess = [
  // Main layout components
  'src/components/common/Header.tsx',
  'src/components/common/Footer.tsx',
  'src/components/layout/MainLayout.tsx',
  'src/components/layout/DashboardLayout.tsx',
  'src/components/layout/AuthLayout.tsx',
  
  // Business components
  'src/components/businesses/BusinessCard.tsx',
  'src/components/businesses/BusinessHeader.tsx',
  'src/components/businesses/BusinessPostsList.tsx',
  
  // Dashboard components
  'src/components/dashboard/QuickActions.tsx',
  'src/components/dashboard/WelcomeBanner.tsx',
  'src/components/dashboard/ProfileCompletionCard.tsx',
  
  // Page components
  'src/app/page.tsx',
  'src/app/businesses/page.tsx',
  'src/app/businesses/[id]/BusinessDetailClient.tsx',
  'src/app/news-feed/page.tsx',
  'src/app/map/MapContent.tsx',
  'src/app/dashboard/page.tsx',
  
  // Auth components
  'src/components/auth/LoginForm.tsx',
  'src/components/auth/QuickBusinessRegistrationForm.tsx',
];

// Patterns to find and replace
const patterns = [
  // Simple Link components
  {
    // Find: <Link href="/some/path">
    find: /<Link\s+href=["']([^"']+)["']/g,
    // Replace with static path
    replace: (match, path) => {
      if (
        path.startsWith('http://') || 
        path.startsWith('https://') || 
        path.startsWith('#') || 
        path.includes('.html') ||
        path.includes('.[')  // Skip dynamic route parameters
      ) {
        return match; // Don't modify external URLs or already-static paths
      }
      
      // Handle root path
      if (path === '/') {
        return '<Link href="/index.html"';
      }
      
      // Handle query parameters
      if (path.includes('?')) {
        const [basePath, query] = path.split('?');
        return `<Link href="${basePath}/index.html?${query}"`;
      }
      
      // Standard path
      return `<Link href="${path}/index.html"`;
    }
  },
  
  // Dynamic routes in Link components
  {
    // Find: <Link href={`/businesses/${business.id}`}>
    find: /<Link\s+href=\{`([^`]+${[^}]+})(`\}|\})/g,
    // Replace with static path
    replace: (match, path, end) => {
      if (
        path.startsWith('http://') || 
        path.startsWith('https://') || 
        path.includes('.html')
      ) {
        return match; // Don't modify external URLs or already-static paths
      }
      
      // Check if path contains query parameters
      if (path.includes('?')) {
        const [basePath, query] = path.split('?');
        return `<Link href={\`${basePath}/index.html?${query}${end}`;
      }
      
      // Standard path
      return `<Link href={\`${path}/index.html${end}`;
    }
  },
  
  // Router.push calls
  {
    // Find: router.push('/some/path')
    find: /router\.push\(['"]([^'"]+)['"]\)/g,
    // Replace with static path
    replace: (match, path) => {
      if (
        path.startsWith('http://') || 
        path.startsWith('https://') || 
        path.includes('.html')
      ) {
        return match; // Don't modify external URLs or already-static paths
      }
      
      // Handle root path
      if (path === '/') {
        return 'router.push("/index.html")';
      }
      
      // Handle query parameters
      if (path.includes('?')) {
        const [basePath, query] = path.split('?');
        return `router.push("${basePath}/index.html?${query}")`;
      }
      
      // Standard path
      return `router.push("${path}/index.html")`;
    }
  },
  
  // Router.push with template literals
  {
    // Find: router.push(`/some/${param}`)
    find: /router\.push\(`([^`]+)`\)/g,
    // Replace with static path
    replace: (match, path) => {
      if (
        path.startsWith('http://') || 
        path.startsWith('https://') || 
        path.includes('.html')
      ) {
        return match; // Don't modify external URLs or already-static paths
      }
      
      // Handle query parameters
      if (path.includes('?')) {
        const [basePath, query] = path.split('?');
        return `router.push(\`${basePath}/index.html?${query}\`)`;
      }
      
      // Standard path
      return `router.push(\`${path}/index.html\`)`;
    }
  }
];

async function processFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    console.log(`Processing ${filePath}...`);
    
    // Read file content
    const content = await readFileAsync(fullPath, 'utf8');
    
    // Apply all pattern replacements
    let updatedContent = content;
    for (const pattern of patterns) {
      updatedContent = updatedContent.replace(pattern.find, pattern.replace);
    }
    
    // Write updated content back
    if (content !== updatedContent) {
      await writeFileAsync(fullPath, updatedContent, 'utf8');
      console.log(`✅ Updated ${filePath}`);
      return true;
    } else {
      console.log(`⏭️ No changes needed in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('Starting static export migration...');
  
  let changedFiles = 0;
  
  for (const filePath of filesToProcess) {
    if (await processFile(filePath)) {
      changedFiles++;
    }
  }
  
  console.log(`Migration complete! Updated ${changedFiles} files.`);
  console.log(`
Next steps:
1. Review the changes to make sure they're correct
2. Test the application locally with 'npm run build' and 'npm run start'
3. Consider using the StaticNavigation components for a more robust solution
  `);
}

main().catch(console.error);