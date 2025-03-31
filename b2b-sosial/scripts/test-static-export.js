// scripts/test-static-export.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}B2B Social Static Export Test${colors.reset}`);
console.log(`${colors.yellow}This script will build and serve the static export locally${colors.reset}\n`);

// Create the scripts directory if it doesn't exist
const scriptsDir = path.join(process.cwd(), 'scripts');
if (!fs.existsSync(scriptsDir)) {
  console.log(`${colors.yellow}Creating scripts directory...${colors.reset}`);
  fs.mkdirSync(scriptsDir);
}

// Step 1: Build the static export
console.log(`${colors.bright}1. Building static export...${colors.reset}`);
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Build completed successfully${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ Build failed: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Check if the out directory exists
const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
  console.error(`${colors.red}✗ Output directory 'out' not found${colors.reset}`);
  process.exit(1);
}

// Step 2: Serve the static export
console.log(`${colors.bright}2. Starting server for static export...${colors.reset}`);
const server = http.createServer((req, res) => {
  // Serve files from the 'out' directory
  return handler(req, res, {
    public: outDir,
    cleanUrls: false, // Don't remove trailing slashes and extensions
    renderSingle: true, // If a file doesn't exist, try to serve index.html
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`${colors.green}✓ Server running at http://localhost:${PORT}${colors.reset}`);
  console.log(`${colors.yellow}Press Ctrl+C to stop the server${colors.reset}`);
  
  // Print some testing tips
  console.log(`\n${colors.bright}Testing tips:${colors.reset}`);
  console.log(`${colors.cyan}1. Navigate to http://localhost:${PORT} in your browser${colors.reset}`);
  console.log(`${colors.cyan}2. Test all major navigation paths:${colors.reset}`);
  console.log(`   - Home page`);
  console.log(`   - Business directory`);
  console.log(`   - Individual business pages`);
  console.log(`   - Dashboard (if logged in)`);
  console.log(`   - Login/Register forms`);
  console.log(`${colors.cyan}3. Check browser console for JavaScript errors${colors.reset}`);
  console.log(`${colors.cyan}4. Verify that all forms and buttons work correctly${colors.reset}`);
  
  // Open the browser (optional)
  try {
    const openCommand = process.platform === 'win32' 
      ? `start http://localhost:${PORT}` 
      : process.platform === 'darwin' 
        ? `open http://localhost:${PORT}` 
        : `xdg-open http://localhost:${PORT}`;
    
    execSync(openCommand);
  } catch (error) {
    console.log(`${colors.yellow}Could not open browser automatically. Please navigate to http://localhost:${PORT} manually.${colors.reset}`);
  }
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Shutting down server...${colors.reset}`);
  server.close(() => {
    console.log(`${colors.green}Server stopped.${colors.reset}`);
    process.exit(0);
  });
});