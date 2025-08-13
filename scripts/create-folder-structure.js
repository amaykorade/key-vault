import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createFolderStructure() {
  try {
    console.log('🔧 Creating folder structure for testing...')
    
    // Find the General folder
    const generalFolder = await prisma.folders.findFirst({
      where: { name: 'General' }
    })
    
    if (!generalFolder) {
      throw new Error('General folder not found')
    }
    
    console.log('✅ Found General folder:', generalFolder.id)
    
    // Create Database subfolder
    console.log('📁 Creating Database subfolder...')
    const databaseFolder = await prisma.folders.create({
      data: {
        name: 'Database',
        description: 'Database connection keys',
        color: '#10B981',
        userId: generalFolder.userId,
        parentId: generalFolder.id
      }
    })
    console.log('✅ Created Database subfolder:', databaseFolder.id)
    
    // Create API subfolder
    console.log('📁 Creating API subfolder...')
    const apiFolder = await prisma.folders.create({
      data: {
        name: 'API',
        description: 'API keys and configuration',
        color: '#3B82F6',
        userId: generalFolder.userId,
        parentId: generalFolder.id
      }
    })
    console.log('✅ Created API subfolder:', apiFolder.id)
    
    // Create Webmeter project
    console.log('📁 Creating Webmeter project...')
    const webmeterProject = await prisma.folders.create({
      data: {
        name: 'Webmeter',
        description: 'Webmeter application keys',
        color: '#8B5CF6',
        userId: generalFolder.userId,
        parentId: null
      }
    })
    console.log('✅ Created Webmeter project:', webmeterProject.id)
    
    // Create Webmeter/Database subfolder
    console.log('📁 Creating Webmeter/Database subfolder...')
    const webmeterDbFolder = await prisma.folders.create({
      data: {
        name: 'Database',
        description: 'Webmeter database keys',
        color: '#F59E0B',
        userId: generalFolder.userId,
        parentId: webmeterProject.id
      }
    })
    console.log('✅ Created Webmeter/Database subfolder:', webmeterDbFolder.id)
    
    // Create some sample keys in the new folders
    console.log('🔑 Creating sample keys...')
    
    // Key in General/Database
    const dbKey = await prisma.keys.create({
      data: {
        name: 'DB_URL',
        description: 'Database connection string',
        value: 'postgresql://user:pass@localhost:5432/general_db',
        type: 'SECRET',
        environment: 'DEVELOPMENT',
        userId: generalFolder.userId,
        folderId: databaseFolder.id
      }
    })
    console.log('✅ Created DB_URL key in General/Database')
    
    // Key in Webmeter/Database
    const webmeterDbKey = await prisma.keys.create({
      data: {
        name: 'DB_URL',
        description: 'Webmeter database connection',
        value: 'postgresql://user:pass@localhost:5432/webmeter_db',
        type: 'SECRET',
        environment: 'DEVELOPMENT',
        userId: generalFolder.userId,
        folderId: webmeterDbFolder.id
      }
    })
    console.log('✅ Created DB_URL key in Webmeter/Database')
    
    // Key in General/API
    const apiKey = await prisma.keys.create({
      data: {
        name: 'API_KEY',
        description: 'General API key',
        value: 'general_api_key_12345',
        type: 'API_KEY',
        environment: 'DEVELOPMENT',
        userId: generalFolder.userId,
        folderId: apiFolder.id
      }
    })
    console.log('✅ Created API_KEY in General/API')
    
    console.log('\n🎉 Folder structure created successfully!')
    console.log('\n📁 Available structure:')
    console.log('  - General/')
    console.log('    ├── Database/ (contains DB_URL)')
    console.log('    └── API/ (contains API_KEY)')
    console.log('  - Webmeter/')
    console.log('    └── Database/ (contains DB_URL)')
    
  } catch (error) {
    console.error('❌ Failed to create folder structure:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the setup
createFolderStructure()
  .then(() => {
    console.log('✅ Folder structure setup completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Folder structure setup failed:', error)
    process.exit(1)
  }) 