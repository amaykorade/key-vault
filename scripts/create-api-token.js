import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function createApiToken() {
  try {
    console.log('🔑 Creating API token for user...')
    
    // Find a user to create the token for
    console.log('🔍 Finding users...')
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      },
      take: 5
    })
    
    if (users.length === 0) {
      throw new Error('No users found in the database')
    }
    
    console.log('📊 Found users:')
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.name}) - ${user.role}`)
    })
    
    // Use the first user (or you can specify which one)
    const targetUser = users[0]
    console.log(`\n🎯 Creating token for: ${targetUser.email}`)
    
    // Check if user already has an API token
    const existingToken = await prisma.api_tokens.findFirst({
      where: {
        userId: targetUser.id,
        isActive: true
      }
    })
    
    if (existingToken) {
      console.log('ℹ️ User already has an active API token:')
      console.log(`  Token: ${existingToken.token}`)
      console.log(`  Created: ${existingToken.createdAt}`)
      console.log(`  Expires: ${existingToken.expiresAt || 'Never'}`)
      return existingToken
    }
    
    // Generate a new API token
    const tokenId = randomUUID()
    const tokenValue = `tok_${randomUUID().replace(/-/g, '')}`
    
    console.log('🔧 Generating new API token...')
    
    // Create the API token
    const apiToken = await prisma.api_tokens.create({
      data: {
        id: tokenId,
        token: tokenValue,
        userId: targetUser.id,
        name: 'Production API Token',
        permissions: ['keys:read', 'keys:write', 'folders:read', 'folders:write'],
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ API token created successfully!')
    console.log('📋 Token Details:')
    console.log(`  ID: ${apiToken.id}`)
    console.log(`  Token: ${apiToken.token}`)
    console.log(`  User: ${targetUser.email}`)
    console.log(`  Permissions: ${apiToken.permissions.join(', ')}`)
    console.log(`  Expires: ${apiToken.expiresAt}`)
    console.log(`  Created: ${apiToken.createdAt}`)
    
    console.log('\n🚀 Use this token in your API calls:')
    console.log(`Authorization: Bearer ${apiToken.token}`)
    
    return apiToken
    
  } catch (error) {
    console.error('❌ Failed to create API token:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the token creation
createApiToken()
  .then(() => {
    console.log('\n✅ API token creation completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ API token creation failed:', error)
    process.exit(1)
  }) 