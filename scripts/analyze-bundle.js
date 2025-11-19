#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if .next directory exists
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    console.error('❌ Build failed or .next directory not found');
    process.exit(1);
  }

  // Analyze bundle size
  console.log('\n📊 Bundle Analysis:');
  
  // Get static files
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    const files = fs.readdirSync(staticDir, { recursive: true });
    let totalSize = 0;
    
    files.forEach(file => {
      const filePath = path.join(staticDir, file);
      if (fs.statSync(filePath).isFile()) {
        const size = fs.statSync(filePath).size;
        totalSize += size;
        
        if (size > 100000) { // Files larger than 100KB
          console.log(`  📄 ${file}: ${(size / 1024).toFixed(2)} KB`);
        }
      }
    });
    
    console.log(`\n📈 Total static assets: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }

  console.log('\n✅ Bundle analysis complete!');
  console.log('\n💡 Optimization tips:');
  console.log('  • Use dynamic imports for large components');
  console.log('  • Implement code splitting');
  console.log('  • Optimize images with next/image');
  console.log('  • Remove unused dependencies');
  console.log('  • Use React Query for efficient data fetching');

} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}