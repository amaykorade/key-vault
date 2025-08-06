# Production Deployment Guide - Key Vault with Subscription

## 🚀 **Ready for Production Deployment**

Your Key Vault application is now ready for production deployment with full subscription functionality. This guide covers everything you need to deploy securely and efficiently.

## 📋 **Pre-Deployment Checklist**

### ✅ **Core Application**
- ✅ **SDKs Published**: JavaScript (v1.0.3) and Python (v1.0.2) SDKs live
- ✅ **All Features Tested**: Authentication, key management, folder structure
- ✅ **Subscription System**: Payment integration with Razorpay
- ✅ **Security**: Encryption, JWT, rate limiting implemented
- ✅ **Documentation**: Comprehensive guides and API docs

### ✅ **Code Quality**
- ✅ **Linting**: All ESLint issues resolved
- ✅ **Build Process**: Production build working
- ✅ **Testing**: All functionality verified
- ✅ **Clean Codebase**: Unnecessary files removed

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended)**

#### **Step 1: Prepare Environment Variables**
Create a `.env.production` file with your production values:

```env
# Database Configuration (Production PostgreSQL)
DATABASE_URL="postgresql://username:password@your-production-db-host:5432/key_vault_db"

# Application Configuration
NODE_ENV=production
PORT=3000

# Security Configuration (Generate strong secrets)
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-chars"
ENCRYPTION_KEY="your-32-character-encryption-key-here"
SESSION_SECRET="your-session-secret-key-here-minimum-32-chars"
SESSION_MAX_AGE=604800000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
ENABLE_AUDIT_LOGGING=true

# Payment Integration (Razorpay - REQUIRED for subscriptions)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"

# Redis (Optional, for session storage)
REDIS_URL="redis://your-redis-host:6379"
```

#### **Step 2: Database Setup**
1. **Set up production PostgreSQL database**
2. **Run migrations**:
   ```bash
   npm run db:migrate
   ```
3. **Seed initial data** (optional):
   ```bash
   npm run db:seed
   ```

#### **Step 3: Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **Step 4: Configure Environment Variables in Vercel**
1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Add all environment variables from `.env.production`

### **Option 2: Other Platforms**

#### **Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

#### **Netlify**
```bash
# Build locally
npm run build

# Deploy to Netlify
netlify deploy --prod
```

#### **AWS/GCP/Azure**
- Use Docker containers
- Set up load balancers
- Configure auto-scaling

## 💳 **Payment Integration Setup**

### **Razorpay Configuration**

#### **Step 1: Create Razorpay Account**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create a new account
3. Complete KYC verification

#### **Step 2: Get API Keys**
1. Go to Settings → API Keys
2. Generate new API key pair
3. Copy `Key ID` and `Key Secret`

#### **Step 3: Configure Webhooks**
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events:
   - `payment.captured`
   - `order.paid`
4. Copy webhook secret

#### **Step 4: Test Payment Flow**
1. Use Razorpay test mode first
2. Test subscription creation
3. Test webhook handling
4. Switch to live mode when ready

## 🔧 **Production Configuration**

### **Security Hardening**

#### **Generate Strong Secrets**
```bash
# Generate JWT Secret (32+ characters)
openssl rand -base64 32

# Generate Encryption Key (32 characters)
openssl rand -hex 16

# Generate Session Secret (32+ characters)
openssl rand -base64 32
```

#### **Environment Variables Priority**
1. **Required**: Database, JWT, Encryption, Razorpay
2. **Recommended**: Redis, Google OAuth
3. **Optional**: SMTP, custom domains

### **Database Configuration**

#### **PostgreSQL Production Setup**
```sql
-- Create production database
CREATE DATABASE key_vault_prod;

-- Create dedicated user
CREATE USER key_vault_user WITH PASSWORD 'strong-password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE key_vault_prod TO key_vault_user;
```

#### **Connection Pooling**
For high traffic, consider:
- **PgBouncer** for connection pooling
- **Read replicas** for scaling
- **Backup strategy** implementation

### **Monitoring & Logging**

#### **Application Monitoring**
```javascript
// Add to your application
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

#### **Health Checks**
```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
});
```

## 📊 **Subscription Management**

### **Cron Job Setup**

#### **Vercel Cron Jobs**
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/check-subscriptions",
      "schedule": "0 2 * * *"
    }
  ]
}
```

#### **Manual Cron Setup**
```bash
# Add to crontab
crontab -e

# Daily subscription check at 2 AM
0 2 * * * curl -X POST https://yourdomain.com/api/cron/check-subscriptions
```

### **Subscription Monitoring**
- **Dashboard**: Monitor active subscriptions
- **Alerts**: Set up expiry notifications
- **Analytics**: Track conversion rates

## 🔍 **Post-Deployment Verification**

### **Functionality Tests**
```bash
# Test API endpoints
curl https://yourdomain.com/api/stats

# Test subscription flow
curl -X POST https://yourdomain.com/api/payment/order \
  -H "Content-Type: application/json" \
  -d '{"plan":"PRO","amount":900}'

# Test SDK integration
npm install amay-key-vault-sdk
```

### **Security Tests**
- ✅ **HTTPS**: Verify SSL certificate
- ✅ **Headers**: Check security headers
- ✅ **Rate Limiting**: Test rate limit enforcement
- ✅ **Authentication**: Verify JWT validation

### **Performance Tests**
- ✅ **Load Testing**: Test with multiple concurrent users
- ✅ **Database**: Monitor query performance
- ✅ **Response Times**: Ensure < 200ms for API calls

## 📈 **Scaling Considerations**

### **Horizontal Scaling**
- **Load Balancers**: Distribute traffic
- **CDN**: Cache static assets
- **Database**: Read replicas, connection pooling

### **Vertical Scaling**
- **Memory**: Monitor memory usage
- **CPU**: Optimize heavy operations
- **Storage**: Plan for data growth

## 🛡️ **Security Checklist**

### **Pre-Deployment**
- [ ] **Strong Secrets**: All secrets are cryptographically secure
- [ ] **HTTPS**: SSL certificate configured
- [ ] **Headers**: Security headers implemented
- [ ] **Rate Limiting**: API rate limits configured
- [ ] **Input Validation**: All inputs validated and sanitized

### **Post-Deployment**
- [ ] **Monitoring**: Application monitoring active
- [ ] **Backups**: Database backups configured
- [ ] **Logs**: Audit logging enabled
- [ ] **Updates**: Regular security updates planned

## 🚀 **Go-Live Checklist**

### **Final Steps**
1. ✅ **Domain**: Configure custom domain
2. ✅ **SSL**: Install SSL certificate
3. ✅ **DNS**: Update DNS records
4. ✅ **Monitoring**: Set up monitoring alerts
5. ✅ **Backup**: Configure automated backups
6. ✅ **Documentation**: Update user documentation

### **Launch Sequence**
1. **Soft Launch**: Deploy to production
2. **Testing**: Run full test suite
3. **Monitoring**: Monitor for 24-48 hours
4. **Public Launch**: Announce to users
5. **Support**: Monitor support channels

## 📞 **Support & Maintenance**

### **Monitoring Tools**
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: User session replay and debugging

### **Maintenance Schedule**
- **Daily**: Check subscription expiry
- **Weekly**: Review logs and performance
- **Monthly**: Security updates and backups
- **Quarterly**: Feature updates and improvements

## 🎯 **Success Metrics**

### **Technical Metrics**
- **Uptime**: > 99.9%
- **Response Time**: < 200ms average
- **Error Rate**: < 0.1%
- **Security**: Zero security incidents

### **Business Metrics**
- **User Growth**: Track user acquisition
- **Subscription Conversion**: Monitor plan upgrades
- **Revenue**: Track monthly recurring revenue
- **Retention**: Monitor user retention rates

---

## 🎉 **You're Ready for Production!**

Your Key Vault application is now:
- ✅ **Fully tested** and functional
- ✅ **Security hardened** and production-ready
- ✅ **Subscription system** integrated and working
- ✅ **SDKs published** and available
- ✅ **Documentation complete** and user-friendly

**Deploy with confidence!** 🚀

---

**Last Updated**: August 7, 2025  
**Status**: ✅ Production Ready  
**Next Review**: Post-deployment monitoring 