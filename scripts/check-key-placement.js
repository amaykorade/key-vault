import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkKeyPlacement() {
  try {
    console.log('🔍 Checking where keys are actually placed...')
    
    // Check all keys
    console.log('\n1️⃣ All keys in the system:')
    const allKeys = await prisma.keys.findMany({
      include: {
        folders: {
          select: {
            id: true,
            name: true,
            parentId: true
          }
        }
      }
    })
    
    allKeys.forEach((key, index) => {
      console.log(`  ${index + 1}. ${key.name}`)
      console.log(`     Value: ${key.value.substring(0, 50)}...`)
      console.log(`     Type: ${key.type}`)
      console.log(`     Environment: ${key.environment}`)
      console.log(`     Folder: ${key.folders?.name || 'No folder'}`)
      console.log(`     Folder ID: ${key.folderId}`)
      console.log(`     Folder Parent: ${key.folders?.parentId || 'Root'}`)
      console.log('')
    })
    
    // Check all folders
    console.log('\n2️⃣ All folders in the system:')
    const allFolders = await prisma.folders.findMany({
      include: {
        keys: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' }
      ]
    })
    
    allFolders.forEach((folder, index) => {
      console.log(`  ${index + 1}. ${folder.name}`)
      console.log(`     ID: ${folder.id}`)
      console.log(`     Parent: ${folder.parentId || 'Root'}`)
      console.log(`     Keys: ${folder.keys.length}`)
      if (folder.keys.length > 0) {
        folder.keys.forEach(key => {
          console.log(`       - ${key.name} (${key.type})`)
        })
      }
      console.log('')
    })
    
    // Check specific folder relationships
    console.log('\n3️⃣ Checking specific relationships:')
    
    // Check General folder
    const generalFolder = await prisma.folders.findFirst({
      where: { name: 'General' }
    })
    
    if (generalFolder) {
      console.log(`General folder ID: ${generalFolder.id}`)
      
      // Check subfolders of General
      const generalSubfolders = await prisma.folders.findMany({
        where: { parentId: generalFolder.id }
      })
      
      console.log(`General has ${generalSubfolders.length} subfolders:`)
      generalSubfolders.forEach(sub => {
        console.log(`  - ${sub.name} (ID: ${sub.id})`)
      })
      
      // Check keys in General subfolders
      for (const sub of generalSubfolders) {
        const keysInSub = await prisma.keys.findMany({
          where: { folderId: sub.id }
        })
        console.log(`Keys in ${sub.name}: ${keysInSub.length}`)
        keysInSub.forEach(key => {
          console.log(`  - ${key.name}: ${key.value.substring(0, 30)}...`)
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkKeyPlacement()
  .then(() => {
    console.log('✅ Key placement check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Key placement check failed:', error)
    process.exit(1)
  }) 