#!/usr/bin/env node

/**
 * Test script for bundle size comment generator
 */

const { generateBundleSizeComment, formatBytes } = require('./bundle-size-check.js');

// Test data - simulate sizes from GitHub Actions
const baseSizes = {
    js: 707 * 1024, // 707 KB
    jsDebug: 857 * 1024, // 857 KB
};

const currentSizes = {
    js: 720 * 1024, // 720 KB (+13 KB)
    jsDebug: 870 * 1024, // 870 KB (+13 KB)
};

console.log('🧪 Testing Bundle Size Comment Generator\n');

console.log('📊 Test Data:');
console.log(`Base sizes: JS=${formatBytes(baseSizes.js)}, Debug=${formatBytes(baseSizes.jsDebug)}`);
console.log(`Current sizes: JS=${formatBytes(currentSizes.js)}, Debug=${formatBytes(currentSizes.jsDebug)}`);
console.log('');

console.log('💬 Generated Comment:');
console.log('---');
const comment = generateBundleSizeComment(baseSizes, currentSizes);
console.log(comment);
console.log('---');

console.log('\n✅ Test completed successfully!');
console.log('💡 This shows what the GitHub Action will generate for PRs');
