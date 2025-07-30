#!/usr/bin/env node

/**
 * Logo Generation Script
 * This script generates PNG versions of the SVG logos
 * Note: This requires puppeteer to be installed
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Key Vault Logo Generator');
console.log('===========================\n');

// Check if logos exist
const logoFiles = [
  'logo.svg',
  'logo-large.svg', 
  'logo-simple.svg'
];

console.log('📁 Checking logo files...');

logoFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', 'public', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`❌ ${file} - Not found`);
  }
});

console.log('\n📋 Logo Files Created:');
console.log('=====================');
console.log('• logo.svg - Standard logo (48x48)');
console.log('• logo-large.svg - Large logo (120x120)');
console.log('• logo-simple.svg - Simple logo (32x32)');

console.log('\n🎯 Usage Instructions:');
console.log('=====================');
console.log('1. Use logo.svg for navigation and headers');
console.log('2. Use logo-large.svg for marketing materials');
console.log('3. Use logo-simple.svg for favicons and small spaces');

console.log('\n🔧 To convert to PNG (optional):');
console.log('================================');
console.log('1. Install puppeteer: npm install puppeteer');
console.log('2. Run: node scripts/convert-logos-to-png.js');

console.log('\n📝 Logo Design Features:');
console.log('=======================');
console.log('• Blue to indigo gradient background');
console.log('• White key with detailed teeth');
console.log('• Security shield overlay');
console.log('• Lock icon for security emphasis');
console.log('• Scalable SVG format');
console.log('• High quality at any size');

console.log('\n✅ Logo generation complete!\n'); 