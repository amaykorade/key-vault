# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Set up a hosted database

## Database Setup

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database for connection string

## Environment Variables

Set these in your Vercel project dashboard:

### Required Variables
```bash
# Database (Neon)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="https://your-app.vercel.app"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"
```

### How to Get Neon Database URL:
1. Go to [neon.tech](https://neon.tech)
2. Sign in to your account
3. Select your project
4. Go to "Connection Details"
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual password

### Optional Variables (for payments)
```bash
# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

### 3. Database Migration
After deployment, run database migrations:
```bash
# In Vercel dashboard > Functions > Create new function
# Name: migrate
# Code:
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  try {
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    await prisma.$migrateDeploy()
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

### 4. Seed Database (Optional)
Create a seed function in Vercel:
```javascript
// api/seed/route.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Create default folder
    await prisma.folder.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        name: 'Default',
        description: 'Default folder for keys'
      }
    })

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User'
      }
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

## Post-Deployment

### 1. Test the Application
- Visit your Vercel URL
- Test signup/login
- Test API endpoints
- Test payment flow (if configured)

### 2. Configure Custom Domain (Optional)
1. Go to Vercel dashboard
2. Settings > Domains
3. Add your custom domain

### 3. Set up Webhooks (for payments)
1. Go to Razorpay dashboard
2. Add webhook URL: `https://your-app.vercel.app/api/payment/webhook`
3. Copy webhook secret to environment variables

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible from Vercel

2. **Build Errors**
   - Check Prisma client generation
   - Verify all dependencies are installed

3. **Authentication Issues**
   - Verify NEXTAUTH_SECRET and NEXTAUTH_URL
   - Check callback URLs in NextAuth config

4. **Payment Issues**
   - Verify Razorpay credentials
   - Check webhook configuration

### Debug Commands
```bash
# Check build logs
vercel logs

# Check function logs
vercel logs --function=api/auth/login

# Redeploy
vercel --prod
```

## Security Checklist

- [ ] Environment variables are set
- [ ] Database is properly secured
- [ ] NEXTAUTH_SECRET is strong
- [ ] ENCRYPTION_KEY is 32 characters
- [ ] Webhook secrets are configured
- [ ] HTTPS is enabled
- [ ] Rate limiting is working

## Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression
- [ ] Monitor function execution times 