/**
 * Script to help replace console statements with logger
 * Run with: node src/scripts/replace-console.js
 * 
 * This script scans files and suggests replacements
 * Manual review required before applying changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = path.join(__dirname, '..');
const CONSOLE_PATTERNS = [
  /console\.log\(/g,
  /console\.error\(/g,
  /console\.warn\(/g,
  /console\.info\(/g,
  /console\.debug\(/g,
];

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, dist, etc.
      if (!['node_modules', '.next', 'dist', 'coverage', 'playwright-report'].includes(file)) {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  CONSOLE_PATTERNS.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        pattern: pattern.source,
        count: matches.length,
      });
    }
  });

  return issues.length > 0 ? { file: filePath, issues } : null;
}

function main() {
  console.log('🔍 Scanning for console statements...\n');

  const files = findFiles(SRC_DIR);
  const results = files
    .map(analyzeFile)
    .filter((result) => result !== null);

  if (results.length === 0) {
    console.log('✅ No console statements found!');
    return;
  }

  console.log(`Found ${results.length} files with console statements:\n`);

  results.forEach((result) => {
    console.log(`📄 ${path.relative(SRC_DIR, result.file)}`);
    result.issues.forEach((issue) => {
      console.log(`   - ${issue.pattern}: ${issue.count} occurrence(s)`);
    });
    console.log('');
  });

  console.log('\n💡 To replace console statements:');
  console.log('   1. Import logger: import { logger } from "@/lib/logger";');
  console.log('   2. Replace console.log() with logger.debug() or logger.info()');
  console.log('   3. Replace console.error() with logger.error()');
  console.log('   4. Replace console.warn() with logger.warn()');
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, analyzeFile };













