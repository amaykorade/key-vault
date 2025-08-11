import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setSubscriptionDates() {
  try {
    console.log('🔧 Setting subscription dates for test users...')
    
    // Set PRO user subscription (1 year from now)
    console.log('👤 Setting PRO user subscription...')
    const proUser = await prisma.users.update({
      where: { email: 'pro@example.com' },
      data: {
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    })
    console.log('✅ PRO user subscription set to:', proUser.subscriptionExpiresAt)
    
    // Set TEAM user subscription (1 year from now)
    console.log('👤 Setting TEAM user subscription...')
    const teamUser = await prisma.users.update({
      where: { email: 'team@example.com' },
      data: {
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    })
    console.log('✅ TEAM user subscription set to:', teamUser.subscriptionExpiresAt)
    
    // Verify all users
    console.log('🔍 Verifying all users...')
    const allUsers = await prisma.users.findMany({
      select: {
        email: true,
        name: true,
        plan: true,
        subscriptionExpiresAt: true
      }
    })
    
    allUsers.forEach(user => {
      const status = user.subscriptionExpiresAt ? 
        `Active until ${user.subscriptionExpiresAt.toDateString()}` : 
        'No subscription date'
      console.log(`  - ${user.email} (${user.plan}): ${status}`)
    })
    
    console.log('🎉 Subscription dates set successfully!')
    
  } catch (error) {
    console.error('❌ Failed to set subscription dates:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
setSubscriptionDates()
  .then(() => {
    console.log('✅ Subscription date setup completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Subscription date setup failed:', error)
    process.exit(1)
  }) 