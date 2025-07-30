# Subscription Management Guide

This document explains how Key Vault handles subscriptions, expiry, and access control for different user plans.

## 📋 Overview

Key Vault implements a subscription-based model with automatic expiry handling and access restrictions to ensure users maintain active subscriptions for premium features.

## 🎯 User Plans

### FREE Plan
- **Secrets Limit**: 5 secrets maximum
- **Projects**: 1 project maximum
- **Features**: Basic secret management
- **Expiry**: No expiry (always active)
- **Access**: Full access to own secrets

### PRO Plan ($9/month)
- **Secrets Limit**: 100 secrets maximum
- **Projects**: 3 projects maximum
- **Features**: Advanced features + audit logs
- **Expiry**: 30 days from payment
- **Access**: Full access when subscription active

### TEAM Plan ($29/month)
- **Secrets Limit**: Unlimited secrets
- **Projects**: Unlimited projects
- **Features**: All features + team collaboration
- **Expiry**: 30 days from payment
- **Access**: Full access when subscription active

## ⏰ Subscription Expiry Handling

### Automatic Expiry Detection
- **Cron Job**: Runs daily to check expired subscriptions
- **Downgrade**: Expired users automatically downgraded to FREE plan
- **Audit Logging**: All expiry actions logged for compliance
- **Dashboard Warnings**: Users notified 3 days before expiry with dismissible warnings

### Expired User Restrictions
When a user's subscription expires:

1. **Key Access Blocked**: Cannot view or retrieve key values
2. **Project Access Blocked**: Cannot access project folders
3. **Creation Limited**: Cannot create new secrets (FREE plan limits)
4. **API Access**: SDK access blocked for expired subscriptions

### Access Control Implementation

#### Key Access Restrictions
```javascript
// In /api/keys/[id]/route.js
if (currentUser.plan !== 'FREE' && !hasActiveSubscription) {
  return NextResponse.json({ 
    success: false, 
    error: 'Your subscription has expired. Renew your subscription to access your keys.',
    requiresRenewal: true
  }, { status: 403 });
}
```

#### Folder Access Restrictions
```javascript
// In /api/folders/route.js
if (currentUser.plan !== 'FREE' && !hasActiveSubscription) {
  return NextResponse.json({ 
    message: 'Your subscription has expired. Renew your subscription to access your projects.',
    requiresRenewal: true
  }, { status: 403 });
}
```

## 🔧 Cron Job Setup

### Automatic Setup
```bash
npm run setup:cron
```

### Manual Setup
1. **Open crontab**:
   ```bash
   crontab -e
   ```

2. **Add cron job** (choose frequency):
   ```bash
   # Daily at 2 AM (Recommended)
   0 2 * * * cd /path/to/key-vault && node scripts/check-subscriptions.js >> logs/subscription-check.log 2>&1
   
   # Weekly on Sunday at 2 AM
   0 2 * * 0 cd /path/to/key-vault && node scripts/check-subscriptions.js >> logs/subscription-check.log 2>&1
   
   # Twice daily at 2 AM and 2 PM
   0 2,14 * * * cd /path/to/key-vault && node scripts/check-subscriptions.js >> logs/subscription-check.log 2>&1
   ```

3. **Create logs directory**:
   ```bash
   mkdir -p logs
   ```

### What the Cron Job Does
- ✅ Checks for expired subscriptions
- ✅ Downgrades expired users to FREE plan
- ✅ Creates audit logs for all actions
- ✅ Logs users with subscriptions expiring within 3 days
- ✅ Dashboard warnings shown automatically

## 📊 Monitoring & Logs

### Check Cron Job Status
```bash
# View current cron jobs
crontab -l

# Check subscription check logs
tail -f logs/subscription-check.log

# View system cron logs
grep CRON /var/log/syslog
```

### Manual Testing
```bash
# Test subscription check manually
npm run check:subscriptions

# Or run directly
node scripts/check-subscriptions.js
```

## 🚨 Dashboard Warning System

### Warning Types
- **Expiring Soon**: Shows 3 days before expiry
- **Expiring Today**: Shows on the day of expiry
- **Expired**: Shows when subscription has expired

### Warning Features
- **Dismissible**: Users can dismiss warnings for 24 hours
- **Persistent**: Warnings reappear after 24 hours if not renewed
- **Actionable**: Direct link to pricing page for renewal
- **Visual**: Color-coded warnings (yellow for expiring, red for expired)

### Warning Implementation
```javascript
// Component: SubscriptionWarning.js
// API: /api/subscription/warning
// Features: Auto-dismiss, localStorage persistence, audit logging
```

## 🔄 Subscription Renewal

### User Renewal Flow
1. User sees warning on dashboard (3 days before expiry)
2. User clicks "Renew Subscription" button
3. Payment processed via Razorpay
4. Subscription extended by 30 days
5. Warning disappears automatically
6. User regains full access

### API Endpoints
- `GET /api/subscription` - Get current subscription status
- `POST /api/subscription` - Renew subscription

### Renewal Response
```json
{
  "success": true,
  "message": "Subscription renewed successfully",
  "subscription": {
    "plan": "PRO",
    "expiresAt": "2025-08-30T00:00:00.000Z",
    "isActive": true
  }
}
```

## 🛡️ Security Considerations

### Data Protection
- Expired users cannot access their encrypted secrets
- Keys remain encrypted and secure
- No data loss during expiry period
- Users can regain access by renewing

### Audit Trail
- All subscription changes logged
- Expiry actions tracked
- Renewal attempts recorded
- Compliance-ready logging

### API Security
- Subscription checks on all key access endpoints
- Rate limiting on renewal endpoints
- Secure payment processing
- Session validation for all operations

## 🚨 Troubleshooting

### Common Issues

#### Cron Job Not Running
```bash
# Check if cron service is running
sudo service cron status

# Check cron logs
grep CRON /var/log/syslog

# Test script manually
node scripts/check-subscriptions.js
```

#### Subscription Not Updating
```bash
# Check database directly
npx prisma studio

# Verify user subscription data
SELECT id, email, plan, "subscriptionExpiresAt" FROM users WHERE plan != 'FREE';
```

#### Access Still Blocked After Renewal
```bash
# Clear user session
# Check subscription status via API
curl -H "Cookie: session_token=..." /api/subscription
```

### Debug Commands
```bash
# Check subscription status for all users
npx prisma studio

# View recent audit logs
SELECT * FROM audit_logs WHERE resource = 'subscription' ORDER BY "createdAt" DESC LIMIT 10;

# Check expired users
SELECT email, plan, "subscriptionExpiresAt" FROM users WHERE "subscriptionExpiresAt" < NOW();
```

## 📈 Best Practices

### For Administrators
1. **Monitor Logs**: Check subscription logs regularly
2. **Test Expiry**: Manually test expiry scenarios
3. **Backup Data**: Ensure user data is backed up
4. **Update Scripts**: Keep cron scripts updated

### For Users
1. **Set Reminders**: Enable expiry notifications
2. **Auto-Renewal**: Consider setting up auto-renewal
3. **Export Data**: Export important secrets before expiry
4. **Contact Support**: Reach out if access issues persist

## 🔗 Related Files

- `scripts/check-subscriptions.js` - Main expiry checking script
- `scripts/setup-cron.js` - Cron job setup helper
- `src/app/api/subscription/route.js` - Subscription API endpoints
- `src/components/SubscriptionStatus.js` - UI subscription status
- `src/components/PlanRequirement.js` - Plan restriction UI
- `prisma/schema.prisma` - Database schema with subscription fields 