import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateAllUsersToAdmin() {
  try {
    console.log('🔧 Updating all users to ADMIN role...')
    
    // Check current user roles
    console.log('🔍 Checking current user roles...')
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    console.log('📊 Current users and their roles:')
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name}): ${user.role}`)
    })
    
    // Count users by role
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})
    
    console.log('📊 Role distribution:', roleCounts)
    
    // Update all users to ADMIN role
    console.log('🔧 Updating all users to ADMIN role...')
    const updateResult = await prisma.users.updateMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      },
      data: {
        role: 'ADMIN'
      }
    })
    
    console.log(`✅ Updated ${updateResult.count} users to ADMIN role`)
    
    // Verify the update
    console.log('🔍 Verifying the update...')
    const updatedUsers = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    console.log('📊 Updated users and their roles:')
    updatedUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.name}): ${user.role}`)
    })
    
    // Count updated roles
    const updatedRoleCounts = updatedUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})
    
    console.log('📊 Updated role distribution:', updatedRoleCounts)
    
    console.log('🎉 All users updated to ADMIN role successfully!')
    
  } catch (error) {
    console.error('❌ Failed to update users to ADMIN role:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the update
updateAllUsersToAdmin()
  .then(() => {
    console.log('✅ User role update completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ User role update failed:', error)
    process.exit(1)
  }) 