import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function fixBadFolder() {
  try {
    console.log('🔧 Fixing bad folder data...')
    
    // Check for the bad folder
    console.log('🔍 Looking for folder with ID "default"...')
    const badFolder = await prisma.folders.findUnique({
      where: { id: 'default' }
    })
    
    if (badFolder) {
      console.log('❌ Found bad folder:', badFolder)
      
      // Check if this folder has any keys
      const keysInBadFolder = await prisma.keys.findMany({
        where: { folderId: 'default' }
      })
      
      console.log(`📊 Keys in bad folder: ${keysInBadFolder.length}`)
      
      if (keysInBadFolder.length > 0) {
        console.log('⚠️ Folder has keys, moving them to user\'s General folder...')
        
        // Find the user's General folder
        const generalFolder = await prisma.folders.findFirst({
          where: {
            userId: badFolder.userId,
            parentId: null,
            name: 'General'
          }
        })
        
        if (generalFolder) {
          console.log('✅ Found General folder, moving keys...')
          
          // Move all keys to the General folder
          await prisma.keys.updateMany({
            where: { folderId: 'default' },
            data: { folderId: generalFolder.id }
          })
          
          console.log('✅ Keys moved successfully')
        } else {
          console.log('❌ No General folder found, creating one...')
          
          // Create a General folder for the user
          const newGeneralFolder = await prisma.folders.create({
            data: {
              name: 'General',
              description: 'Default folder for your keys',
              color: '#3B82F6',
              userId: badFolder.userId,
              parentId: null
            }
          })
          
          console.log('✅ Created new General folder:', newGeneralFolder.id)
          
          // Move keys to the new folder
          await prisma.keys.updateMany({
            where: { folderId: 'default' },
            data: { folderId: newGeneralFolder.id }
          })
          
          console.log('✅ Keys moved to new General folder')
        }
      }
      
      // Now delete the bad folder
      console.log('🗑️ Deleting bad folder...')
      await prisma.folders.delete({
        where: { id: 'default' }
      })
      
      console.log('✅ Bad folder deleted successfully')
      
    } else {
      console.log('✅ No bad folder found')
    }
    
    // Check for any other potential issues
    console.log('🔍 Checking for other potential folder issues...')
    
    // Check for folders with very short IDs (potential issues)
    const shortIdFolders = await prisma.folders.findMany({
      where: {
        id: {
          not: {
            startsWith: 'cm' // CUIDs typically start with 'cm'
          }
        }
      }
    })
    
    if (shortIdFolders.length > 0) {
      console.log('⚠️ Found folders with potentially bad IDs:', shortIdFolders.length)
      shortIdFolders.forEach(folder => {
        console.log(`  - ID: ${folder.id}, Name: ${folder.name}, User: ${folder.userId}`)
      })
    } else {
      console.log('✅ All folders have proper CUIDs')
    }
    
    // Verify the fix worked
    console.log('🔍 Verifying fix...')
    const finalFolderCount = await prisma.folders.count()
    console.log(`✅ Final folder count: ${finalFolderCount}`)
    
    console.log('🎉 Bad folder fix completed successfully!')
    
  } catch (error) {
    console.error('❌ Failed to fix bad folder:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixBadFolder()
  .then(() => {
    console.log('✅ Bad folder fix completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Bad folder fix failed:', error)
    process.exit(1)
  }) 