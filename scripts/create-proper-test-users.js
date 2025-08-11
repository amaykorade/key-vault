import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createProperTestUsers() {
  try {
    console.log('🔧 Creating proper test users with correct passwords...')
    
    // Delete old test users if they exist
    console.log('🧹 Cleaning up old test users...')
    const oldUsers = ['test@example.com', 'test3@example.com', 'test2@example.com']
    
    for (const email of oldUsers) {
      try {
        await prisma.users.deleteMany({
          where: { email }
        })
        console.log(`✅ Deleted old user: ${email}`)
      } catch (e) {
        console.log(`ℹ️ No old user to delete: ${email}`)
      }
    }
    
    // Create Free Plan User
    console.log('👤 Creating Free Plan User...')
    const freeUser = await prisma.users.create({
      data: {
        email: 'free@example.com',
        password: await bcrypt.hash('Password123', 12),
        name: 'Free Test User',
        role: 'ADMIN',
        plan: 'FREE'
      }
    })
    console.log('✅ Free user created:', freeUser.id)
    
    // Create Pro Plan User
    console.log('👤 Creating Pro Plan User...')
    const proUser = await prisma.users.create({
      data: {
        email: 'pro@example.com',
        password: await bcrypt.hash('Password123', 12),
        name: 'Pro Test User',
        role: 'ADMIN',
        plan: 'PRO'
      }
    })
    console.log('✅ Pro user created:', proUser.id)
    
    // Create Team Plan User
    console.log('👤 Creating Team Plan User...')
    const teamUser = await prisma.users.create({
      data: {
        email: 'team@example.com',
        password: await bcrypt.hash('Password123', 12),
        name: 'Team Test User',
        role: 'ADMIN',
        plan: 'TEAM'
      }
    })
    console.log('✅ Team user created:', teamUser.id)
    
    // Create default folders for each user
    console.log('📁 Creating default folders...')
    
    for (const user of [freeUser, proUser, teamUser]) {
      await prisma.folders.create({
        data: {
          name: 'General',
          description: 'Default folder for your keys',
          color: '#3B82F6',
          userId: user.id,
          parentId: null
        }
      })
      console.log(`✅ Created folder for ${user.email}`)
    }
    
    // Display final user list
    console.log('📊 Final test users created:')
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true
      }
    })
    
    allUsers.forEach(user => {
      console.log(`  - ${user.email}: ${user.name} (${user.plan} plan, ${user.role} role)`)
    })
    
    console.log('🎉 Proper test users created successfully!')
    
  } catch (error) {
    console.error('❌ Failed to create test users:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createProperTestUsers()
  .then(() => {
    console.log('✅ Test user creation completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test user creation failed:', error)
    process.exit(1)
  }) 