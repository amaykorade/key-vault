import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function recreateWebmeterStructure() {
  try {
    console.log('🔧 Recreating Webmeter project structure...')
    
    // Find the General folder to get the user ID
    const generalFolder = await prisma.folders.findFirst({
      where: { name: 'General' }
    })
    
    if (!generalFolder) {
      throw new Error('General folder not found')
    }
    
    console.log(`✅ Found General folder, user ID: ${generalFolder.userId}`)
    
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
    
    // Create a key in Webmeter/Database
    console.log('🔑 Creating DB_URL key in Webmeter/Database...')
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
    
    // Clean up the stray Database folder (if it exists)
    const strayDatabaseFolders = await prisma.folders.findMany({
      where: {
        name: 'Database',
        parentId: null
      }
    })
    
    if (strayDatabaseFolders.length > 0) {
      console.log('🧹 Cleaning up stray Database folders...')
      for (const folder of strayDatabaseFolders) {
        console.log(`🗑️  Deleting stray Database folder: ${folder.id}`)
        await prisma.folders.delete({
          where: { id: folder.id }
        })
      }
    }
    
    console.log('\n🎉 Webmeter structure recreated successfully!')
    console.log('\n📁 Final structure:')
    console.log('  - General/')
    console.log('    ├── Database/ (contains DB_URL)')
    console.log('    └── API/ (contains API_KEY)')
    console.log('  - Webmeter/')
    console.log('    └── Database/ (contains DB_URL)')
    
  } catch (error) {
    console.error('❌ Failed to recreate Webmeter structure:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the recreation
recreateWebmeterStructure()
  .then(() => {
    console.log('✅ Webmeter structure recreation completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Webmeter structure recreation failed:', error)
    process.exit(1)
  }) 