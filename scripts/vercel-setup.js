#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Vercel Deployment Setup Helper\n');

// Check if .env.production exists
const envProdPath = path.join(__dirname, '..', '.env.production');
if (fs.existsSync(envProdPath)) {
  console.log('✅ Found .env.production file');
  
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('\n📋 Environment Variables to add in Vercel Dashboard:');
  console.log('Go to: https://vercel.com/dashboard/[your-project]/settings/environment-variables\n');
  
  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      console.log(`${key}=${value}`);
    }
  });
  
  console.log('\n⚠️  Important Notes:');
  console.log('1. Copy these variables to Vercel dashboard');
  console.log('2. Update NEXTAUTH_URL to your actual Vercel URL');
  console.log('3. Make sure ENCRYPTION_KEY is exactly 32 characters');
  console.log('4. Generate a strong NEXTAUTH_SECRET if not set');
  
} else {
  console.log('❌ .env.production file not found');
  console.log('\n📝 Create .env.production with these variables:');
  console.log(`
# Database (Neon)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="https://your-app.vercel.app"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"

# Razorpay (Optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
  `);
}

console.log('\n🔗 Next Steps:');
console.log('1. Push code to GitHub: git push origin main');
console.log('2. Deploy on Vercel: https://vercel.com/new');
console.log('3. Add environment variables in Vercel dashboard');
console.log('4. Run migrations: POST /api/migrate');
console.log('5. Seed database: POST /api/seed'); 