const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkExpiredSubscriptions() {
  try {
    console.log('Checking for expired subscriptions...');
    
    const now = new Date();
    
    // Find users with expired subscriptions
    const expiredUsers = await prisma.users.findMany({
      where: {
        subscriptionExpiresAt: {
          lt: now
        },
        plan: {
          not: 'FREE'
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        subscriptionExpiresAt: true
      }
    });

    console.log(`Found ${expiredUsers.length} users with expired subscriptions`);

    for (const user of expiredUsers) {
      console.log(`Processing user: ${user.email} (${user.name})`);
      
      // Downgrade to FREE plan
      await prisma.users.update({
        where: { id: user.id },
        data: {
          plan: 'FREE',
          subscriptionExpiresAt: null
        }
      });

      // Create audit log
      await prisma.audit_logs.create({
        data: {
          action: 'UPDATE',
          resource: 'subscription',
          resourceId: user.id,
          userId: user.id,
          details: {
            previousPlan: user.plan,
            newPlan: 'FREE',
            reason: 'subscription_expired',
            expiredAt: user.subscriptionExpiresAt
          }
        }
      });

      console.log(`Downgraded ${user.email} from ${user.plan} to FREE plan`);
    }

    // Check for users with subscriptions expiring soon (within 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringSoonUsers = await prisma.users.findMany({
      where: {
        subscriptionExpiresAt: {
          gte: now,
          lte: threeDaysFromNow
        },
        plan: {
          not: 'FREE'
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        subscriptionExpiresAt: true
      }
    });

    console.log(`Found ${expiringSoonUsers.length} users with subscriptions expiring within 3 days`);

    for (const user of expiringSoonUsers) {
      const daysUntilExpiry = Math.ceil((user.subscriptionExpiresAt - now) / (1000 * 60 * 60 * 24));
      console.log(`${user.email} subscription expires in ${daysUntilExpiry} days`);
      
      // Create audit log for expiring soon notification
      await prisma.audit_logs.create({
        data: {
          action: 'READ',
          resource: 'subscription',
          resourceId: user.id,
          userId: user.id,
          details: {
            plan: user.plan,
            daysUntilExpiry,
            expiresAt: user.subscriptionExpiresAt,
            notification: 'expiring_soon'
          }
        }
      });
    }

    console.log('Subscription check completed successfully');
  } catch (error) {
    console.error('Error checking subscriptions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkExpiredSubscriptions(); 