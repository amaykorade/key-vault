import prisma from './database.js'

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test query
    const userCount = await prisma.user.count()
    console.log(`📊 Users in database: ${userCount}`)
    
    const keyCount = await prisma.key.count()
    console.log(`🔑 Keys in database: ${keyCount}`)
    
    const folderCount = await prisma.folder.count()
    console.log(`📁 Folders in database: ${folderCount}`)
    
    console.log('✅ Database test completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Test failed:', error)
      process.exit(1)
    })
} 