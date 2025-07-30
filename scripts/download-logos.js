#!/usr/bin/env node

/**
 * Logo Download Helper
 * Provides instructions for downloading logo files
 */

const fs = require('fs');
const path = require('path');

console.log('📥 Key Vault Logo Download Helper');
console.log('==================================\n');

const publicDir = path.join(__dirname, '..', 'public');
const pngDir = path.join(publicDir, 'png');

console.log('📁 Available Logo Files:');
console.log('========================');

// SVG files
console.log('\n🎨 SVG Files (Vector Format):');
const svgFiles = ['logo.svg', 'logo-large.svg', 'logo-simple.svg', 'favicon.svg'];
svgFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`• ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
});

// PNG files
if (fs.existsSync(pngDir)) {
  console.log('\n🖼️ PNG Files (Raster Format):');
  const pngFiles = fs.readdirSync(pngDir).sort();
  pngFiles.forEach(file => {
    const filePath = path.join(pngDir, file);
    const stats = fs.statSync(filePath);
    console.log(`• ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
}

console.log('\n📋 Download Instructions:');
console.log('=========================');
console.log('1. **Manual Download**:');
console.log('   - Navigate to the public/ directory');
console.log('   - Copy the files you need');
console.log('   - PNG files are in public/png/ subdirectory');

console.log('\n2. **Using Git**:');
console.log('   - Clone the repository');
console.log('   - All logo files are in the public/ directory');

console.log('\n3. **Using Command Line**:');
console.log('   # Copy all SVG files');
console.log('   cp public/*.svg /your/destination/');
console.log('   # Copy all PNG files');
console.log('   cp public/png/*.png /your/destination/');

console.log('\n4. **Create ZIP Archive**:');
console.log('   # Create zip with all logos');
console.log('   zip -r key-vault-logos.zip public/logo*.svg public/favicon.svg public/png/');

console.log('\n🎯 Recommended Downloads:');
console.log('========================');
console.log('• For Web Development: logo.svg, logo-simple.svg, favicon.svg');
console.log('• For Marketing: logo-large.svg, 960x960-logo-large.png');
console.log('• For App Icons: 192x192-logo.png, 512x512-logo.png');
console.log('• For Favicons: 16x16-favicon.png, 32x32-favicon.png');

console.log('\n📄 File Locations:');
console.log('==================');
console.log(`• SVG Files: ${publicDir}/`);
console.log(`• PNG Files: ${pngDir}/`);

console.log('\n✅ Ready for download!\n'); 