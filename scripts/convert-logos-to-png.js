#!/usr/bin/env node

/**
 * Logo to PNG Converter
 * Converts SVG logos to high-quality PNG format
 * Requires: npm install puppeteer
 */

const fs = require('fs');
const path = require('path');

// Check if puppeteer is available
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.error('❌ Puppeteer not found. Please install it first:');
  console.error('   npm install puppeteer');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');

// Logo configurations
const logos = [
  {
    name: 'logo.svg',
    output: 'logo.png',
    sizes: [48, 96, 192, 512]
  },
  {
    name: 'logo-large.svg',
    output: 'logo-large.png',
    sizes: [120, 240, 480, 960]
  },
  {
    name: 'logo-simple.svg',
    output: 'logo-simple.png',
    sizes: [32, 64, 128, 256]
  },
  {
    name: 'favicon.svg',
    output: 'favicon.png',
    sizes: [16, 32, 48, 64]
  }
];

async function convertSvgToPng(svgPath, outputPath, size) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to the desired size
    await page.setViewport({ width: size, height: size });
    
    // Read SVG content
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Create HTML with the SVG
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              width: ${size}px;
              height: ${size}px;
              background: transparent;
            }
            svg {
              width: ${size}px;
              height: ${size}px;
            }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;
    
    await page.setContent(html);
    
    // Wait for SVG to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Take screenshot
    await page.screenshot({
      path: outputPath,
      type: 'png',
      omitBackground: true,
      clip: {
        x: 0,
        y: 0,
        width: size,
        height: size
      }
    });
    
    console.log(`✅ Generated ${outputPath} (${size}x${size})`);
    
  } catch (error) {
    console.error(`❌ Error converting ${svgPath} to ${outputPath}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function convertAllLogos() {
  console.log('🎨 Converting SVG logos to PNG...');
  console.log('=====================================\n');
  
  // Check if logos exist
  for (const logo of logos) {
    const svgPath = path.join(publicDir, logo.name);
    if (!fs.existsSync(svgPath)) {
      console.error(`❌ ${logo.name} not found`);
      continue;
    }
    
    console.log(`📁 Processing ${logo.name}...`);
    
    // Create output directory if it doesn't exist
    const pngDir = path.join(publicDir, 'png');
    if (!fs.existsSync(pngDir)) {
      fs.mkdirSync(pngDir, { recursive: true });
    }
    
    // Convert to different sizes
    for (const size of logo.sizes) {
      const outputPath = path.join(pngDir, `${size}x${size}-${logo.output}`);
      await convertSvgToPng(svgPath, outputPath, size);
    }
    
    console.log('');
  }
  
  console.log('📋 PNG Files Generated:');
  console.log('=======================');
  
  // List generated files
  const pngDir = path.join(publicDir, 'png');
  if (fs.existsSync(pngDir)) {
    const files = fs.readdirSync(pngDir);
    files.forEach(file => {
      const filePath = path.join(pngDir, file);
      const stats = fs.statSync(filePath);
      console.log(`• ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    });
  }
  
  console.log('\n🎯 Usage Instructions:');
  console.log('=====================');
  console.log('• Use 16x16, 32x32 for favicons');
  console.log('• Use 48x48, 96x96 for app icons');
  console.log('• Use 192x192, 512x512 for PWA icons');
  console.log('• Use larger sizes for marketing materials');
  
  console.log('\n📁 Files are saved in: public/png/');
  console.log('✅ PNG conversion complete!\n');
}

// Run the conversion
convertAllLogos().catch(console.error); 