#!/usr/bin/env node

/**
 * Bundle analyzer script
 * Analyzes Next.js bundle size and provides optimization recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build with bundle analyzer
  console.log('Building with bundle analyzer...');
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' });

  // Check if analysis file was created
  const analyzePath = path.join(__dirname, '..', 'analyze', 'client.html');
  if (fs.existsSync(analyzePath)) {
    console.log('\n✅ Bundle analysis complete!');
    console.log(`📊 Open ${analyzePath} in your browser to view the analysis`);
  } else {
    console.log('\n⚠️  Bundle analysis file not found. Make sure webpack-bundle-analyzer is installed.');
  }
} catch (error) {
  console.error('\n❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
