import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicateFolders() {
  try {
    console.log('🧹 Cleaning up duplicate folders...')
    
    // Find all folders with their key counts
    const allFolders = await prisma.folders.findMany({
      include: {
        _count: {
          select: {
            keys: true
          }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    
    console.log(`📊 Total folders: ${allFolders.length}`)
    
    // Group folders by name and parent
    const folderGroups = {}
    allFolders.forEach(folder => {
      const key = `${folder.name}-${folder.parentId || 'root'}`
      if (!folderGroups[key]) {
        folderGroups[key] = []
      }
      folderGroups[key].push(folder)
    })
    
    // Find duplicates and clean them up
    let deletedCount = 0
    
    for (const [groupKey, folders] of Object.entries(folderGroups)) {
      if (folders.length > 1) {
        console.log(`\n🔍 Processing group: ${groupKey} (${folders.length} folders)`)
        
        // Sort by key count (keep the one with most keys) and creation date
        folders.sort((a, b) => {
          if (a._count.keys !== b._count.keys) {
            return b._count.keys - a._count.keys // Keep the one with more keys
          }
          return new Date(a.createdAt) - new Date(b.createdAt) // Keep the oldest
        })
        
        const keepFolder = folders[0]
        const deleteFolders = folders.slice(1)
        
        console.log(`✅ Keeping: ${keepFolder.name} (ID: ${keepFolder.id}, Keys: ${keepFolder._count.keys})`)
        
        for (const deleteFolder of deleteFolders) {
          console.log(`🗑️  Deleting: ${deleteFolder.name} (ID: ${deleteFolder.id}, Keys: ${deleteFolder._count.keys})`)
          
          // Delete the folder (this will cascade delete any keys)
          await prisma.folders.delete({
            where: { id: deleteFolder.id }
          })
          
          deletedCount++
        }
      }
    }
    
    console.log(`\n🎉 Cleanup completed! Deleted ${deletedCount} duplicate folders.`)
    
    // Verify the cleanup
    console.log('\n📋 Final folder structure:')
    const finalFolders = await prisma.folders.findMany({
      include: {
        _count: {
          select: {
            keys: true
          }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' }
      ]
    })
    
    let currentParent = null
    finalFolders.forEach(folder => {
      if (folder.parentId !== currentParent) {
        if (folder.parentId) {
          const parent = finalFolders.find(f => f.id === folder.parentId)
          console.log(`\n📁 ${parent?.name || 'Unknown'}/`)
        } else {
          console.log(`\n📁 ${folder.name}/`)
        }
        currentParent = folder.parentId
      }
      
      if (folder.parentId) {
        console.log(`  ├── ${folder.name} (${folder._count.keys} keys)`)
      }
    })
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupDuplicateFolders()
  .then(() => {
    console.log('✅ Duplicate folder cleanup completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Duplicate folder cleanup failed:', error)
    process.exit(1)
  }) 