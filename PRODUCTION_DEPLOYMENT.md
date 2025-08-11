# 🚀 Production Deployment Checklist

Complete guide for deploying Key Vault to production on Vercel.

## 📋 **Pre-Deployment Checklist**

### ✅ **Code Ready**
- [ ] All documentation updated for v1.0.4 SDKs
- [ ] Website documentation reflects new features
- [ ] Path-based access methods implemented
- [ ] All tests passing locally
- [ ] No console errors or warnings

### ✅ **Environment Variables**
Ensure these are set in Vercel dashboard:
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Security
JWT_SECRET="your-super-secret-jwt-key-here"
ENCRYPTION_KEY="your-32-character-encryption-key"
SESSION_SECRET="your-session-secret-key-here"

# Payments (if using Razorpay)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

## 🚀 **Deployment Steps**

### 1. **Push Code to GitHub**
```bash
git add .
git commit -m "Production ready: v1.0.4 SDKs, path-based access, updated documentation"
git push origin main
```

### 2. **Vercel Automatic Deployment**
- Vercel will automatically detect the push
- Build process will start automatically
- Monitor build logs for any errors

### 3. **Database Setup (After Deployment)**

#### **Option A: Using Production Setup Script**
```bash
# SSH into your production server or use Vercel CLI
npm install
npx prisma migrate deploy
node scripts/production-setup.js
```

#### **Option B: Manual Database Setup**
```bash
# 1. Run migrations
npx prisma migrate deploy

# 2. Create test users manually
# Use the production setup script or create users via the web interface
```

## 🗄️ **Database Migration**

### **Important Notes:**
- **Existing data will be preserved** - Prisma migrations are additive
- **Schema changes are backward compatible** - no data loss
- **Test the migration locally first** if possible

### **Migration Commands:**
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Verify database connection
npx prisma db pull

# Check migration status
npx prisma migrate status
```

## 👥 **Test Users Setup**

After running the production setup script, you'll have:

### **Free Plan User**
- **Email**: `free@test.com`
- **Password**: `Password123`
- **Limits**: 1 project, 5 keys
- **Features**: Basic key management

### **Pro Plan User**
- **Email**: `pro@test.com`
- **Password**: `Password123`
- **Limits**: 3 projects, 100 keys
- **Features**: Audit logs, environment filtering

### **Team Plan User**
- **Email**: `team@test.com`
- **Password**: `Password123`
- **Limits**: Unlimited projects, 1000+ keys
- **Features**: Team collaboration, advanced analytics

### **Admin User**
- **Email**: `admin@test.com`
- **Password**: `Password123`
- **Role**: ADMIN
- **Access**: Full system access

## 🔍 **Post-Deployment Testing**

### **1. Basic Functionality**
- [ ] User registration and login
- [ ] Project creation and management
- [ ] Key creation, editing, deletion
- [ ] Folder organization

### **2. Plan Features**
- [ ] **Free Plan**: Verify 1 project limit
- [ ] **Pro Plan**: Verify 3 project limit, audit logs
- [ ] **Team Plan**: Verify unlimited projects
- [ ] **Admin**: Verify admin panel access

### **3. SDK Integration**
- [ ] **JavaScript SDK**: `npm install amay-key-vault-sdk`
- [ ] **Python SDK**: `pip install amay-key-vault-sdk`
- [ ] **Path-based access**: `getKeysByPath('Project/Subfolder')`
- [ ] **API endpoints**: Test all REST endpoints

### **4. Security & Performance**
- [ ] HTTPS working correctly
- [ ] Rate limiting functional
- [ ] Encryption working
- [ ] No sensitive data in logs

## 🚨 **Critical Security Steps**

### **After Testing:**
1. **Change default passwords** for all test users
2. **Remove or secure** the production setup script
3. **Verify environment variables** are not exposed
4. **Check access logs** for any unauthorized attempts

### **Password Change Commands:**
```bash
# Update test user passwords (run in production)
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function updatePasswords() {
  const newPassword = 'YourNewSecurePassword123';
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  await prisma.user.updateMany({
    where: { email: { contains: '@test.com' } },
    data: { password: hashedPassword }
  });
  
  console.log('✅ Test user passwords updated!');
  await prisma.\$disconnect();
}

updatePasswords();
"
```

## 📊 **Monitoring & Maintenance**

### **Vercel Dashboard**
- Monitor build status
- Check function execution logs
- Monitor performance metrics

### **Database Monitoring**
- Check connection pool usage
- Monitor query performance
- Watch for any errors

### **Application Logs**
- Monitor authentication attempts
- Check for API errors
- Verify rate limiting

## 🆘 **Troubleshooting**

### **Common Issues:**

#### **Build Failures**
```bash
# Check build logs in Vercel dashboard
# Verify all dependencies are in package.json
# Check for TypeScript/ESLint errors
```

#### **Database Connection Issues**
```bash
# Verify DATABASE_URL in Vercel
# Check database accessibility
# Verify Prisma schema
```

#### **Environment Variable Issues**
```bash
# Check Vercel environment variables
# Verify variable names match code
# Check for typos
```

## 🎯 **Success Criteria**

Deployment is successful when:
- [ ] Website loads without errors
- [ ] All test users can log in
- [ ] SDKs install and work correctly
- [ ] Path-based access methods functional
- [ ] All plan features working as expected
- [ ] No security vulnerabilities exposed

## 📞 **Support**

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test database connectivity
4. Review application logs
5. Check for any console errors

---

**Good luck with your production deployment! 🚀** 