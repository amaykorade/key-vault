# Key Vault Logo Assets

This directory contains high-quality logo assets for the Key Vault application.

## 📁 Logo Files

### SVG Files (Vector Format)

#### `logo.svg` (48x48) - Standard Logo
- **Use**: Navigation bars, headers, general UI
- **Size**: 48x48 pixels
- **Features**: Full gradient background, detailed key design, security elements
- **File Size**: ~1.7 KB

#### `logo-large.svg` (120x120) - Large Logo
- **Use**: Marketing materials, presentations, high-resolution displays
- **Size**: 120x120 pixels
- **Features**: Enhanced gradient, additional security elements, better detail
- **File Size**: ~2.3 KB

#### `logo-simple.svg` (40x40) - Simple Logo
- **Use**: Small spaces, icons, favicon alternative
- **Size**: 40x40 pixels
- **Features**: Clean, minimal design, optimized for small sizes
- **File Size**: ~1.1 KB

#### `favicon.svg` (48x48) - Favicon
- **Use**: Browser tab icon, bookmarks
- **Size**: 48x48 pixels
- **Features**: Larger design for better visibility, optimized for favicon use
- **File Size**: ~1.2 KB

### PNG Files (Raster Format)

#### Standard Logo PNGs
- `48x48-logo.png` (2.4 KB) - Navigation, headers
- `96x96-logo.png` (6.0 KB) - App icons
- `192x192-logo.png` (15 KB) - PWA icons
- `512x512-logo.png` (64 KB) - High-resolution displays

#### Large Logo PNGs
- `120x120-logo-large.png` (12 KB) - Marketing materials
- `240x240-logo-large.png` (31 KB) - Presentations
- `480x480-logo-large.png` (84 KB) - Print materials
- `960x960-logo-large.png` (227 KB) - Ultra high-resolution

#### Simple Logo PNGs
- `32x32-logo-simple.png` (1.1 KB) - Small spaces
- `64x64-logo-simple.png` (2.5 KB) - Icons
- `128x128-logo-simple.png` (6.8 KB) - Medium displays
- `256x256-logo-simple.png` (19 KB) - High-resolution icons

#### Favicon PNGs
- `16x16-favicon.png` (0.6 KB) - Browser tabs
- `32x32-favicon.png` (1.1 KB) - Standard favicon
- `48x48-favicon.png` (1.9 KB) - Enhanced favicon
- `64x64-favicon.png` (2.5 KB) - High-DPI displays

## 🎨 Design Features

### Color Scheme
- **Primary Gradient**: Blue (#3B82F6) to Indigo (#6366F1)
- **Background**: White key with gradient overlay
- **Security Elements**: Shield and lock icons

### Design Elements
- **Key Symbol**: Represents secure access and key management
- **Security Shield**: Emphasizes security and protection
- **Lock Icon**: Reinforces security theme
- **Gradient Background**: Modern, professional appearance

### Scalability
- **Vector Format**: SVG files scale perfectly at any size
- **High Quality**: Crisp rendering on all devices and resolutions
- **Optimized**: Small file sizes for fast loading

## 🚀 Usage Instructions

### In HTML/CSS
```html
<!-- SVG logos (recommended for web) -->
<img src="/logo.svg" alt="Key Vault" class="h-8 w-8" />
<img src="/logo-large.svg" alt="Key Vault" class="h-24 w-24" />
<img src="/logo-simple.svg" alt="Key Vault" class="h-6 w-6" />

<!-- PNG logos (for specific use cases) -->
<img src="/png/48x48-logo.png" alt="Key Vault" class="h-8 w-8" />
<img src="/png/192x192-logo.png" alt="Key Vault" class="h-24 w-24" />
<img src="/png/32x32-logo-simple.png" alt="Key Vault" class="h-6 w-6" />
```

### In React Components
```jsx
// Navigation component
<Link href="/" className="flex items-center space-x-2">
  <img src="/logo-large.svg" alt="Key Vault" className="h-10 w-10" />
  <span className="text-xl font-bold">Key Vault</span>
</Link>

// Marketing component
<div className="text-center">
  <img src="/logo-large.svg" alt="Key Vault" className="mx-auto h-32 w-32" />
  <h1 className="text-4xl font-bold">Key Vault</h1>
</div>
```

### In CSS Background
```css
.logo-bg {
  background-image: url('/logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
```

## 🔧 Generation Scripts

### Check Logo Files
Run the logo generation script to check all logo files:

```bash
npm run generate:logos
```

This script will:
- Verify all logo files exist
- Display file sizes
- Show usage instructions
- List design features

### Convert to PNG
Convert SVG logos to high-quality PNG format:

```bash
npm run convert:logos
```

This script will:
- Generate PNG files in multiple sizes
- Create transparent backgrounds
- Optimize for different use cases
- Save files in `public/png/` directory

**Requirements**: `puppeteer` package (installed automatically)

## 📱 Responsive Usage

### Mobile Devices
- Use `logo-simple.svg` for small screens
- Scale appropriately with CSS classes

### Desktop Applications
- Use `logo.svg` for standard navigation
- Use `logo-large.svg` for marketing materials

### Print Materials
- Use `logo-large.svg` for best quality
- SVG format ensures crisp printing at any size

## 🎯 Brand Guidelines

### Minimum Size
- **logo.svg**: Minimum 24x24px
- **logo-large.svg**: Minimum 60x60px
- **logo-simple.svg**: Minimum 16x16px

### Clear Space
- Maintain clear space around the logo equal to the height of the key symbol
- Don't place text or other elements too close to the logo

### Color Variations
- The logos are designed for dark backgrounds
- For light backgrounds, consider using a version with darker colors
- Maintain the gradient effect for brand consistency

## 📄 File Formats

### SVG (Current)
- **Advantages**: Scalable, small file size, crisp at any size
- **Best for**: Web applications, modern browsers

### PNG Conversion (Optional)
If you need PNG versions:
1. Install puppeteer: `npm install puppeteer`
2. Create a conversion script
3. Generate PNG files at various sizes

## 🔒 Copyright

These logo assets are part of the Key Vault application and should be used in accordance with the project's license terms. 