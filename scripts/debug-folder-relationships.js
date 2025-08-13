import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugFolderRelationships() {
  try {
    console.log('🔍 Debugging folder relationships for path-based API...')
    
    // Check the exact structure we're trying to access
    console.log('\n1️⃣ Checking General folder structure:')
    const generalFolder = await prisma.folders.findFirst({
      where: { name: 'General' }
    })
    
    if (generalFolder) {
      console.log(`General folder: ID=${generalFolder.id}, Parent=${generalFolder.parentId || 'Root'}`)
      
      // Check subfolders of General
      const generalSubfolders = await prisma.folders.findMany({
        where: { parentId: generalFolder.id }
      })
      
      console.log(`General has ${generalSubfolders.length} subfolders:`)
      for (const sub of generalSubfolders) {
        console.log(`  - ${sub.name}: ID=${sub.id}, Parent=${sub.parentId}`)
        
        // Check keys in this subfolder
        const keysInSub = await prisma.keys.findMany({
          where: { folderId: sub.id }
        })
        console.log(`    Keys: ${keysInSub.length}`)
        keysInSub.forEach(key => {
          console.log(`      * ${key.name} (${key.type})`)
        })
      }
    }
    
    console.log('\n2️⃣ Checking Webmeter folder structure:')
    const webmeterFolder = await prisma.folders.findFirst({
      where: { name: 'Webmeter' }
    })
    
    if (webmeterFolder) {
      console.log(`Webmeter folder: ID=${webmeterFolder.id}, Parent=${webmeterFolder.parentId || 'Root'}`)
      
      // Check subfolders of Webmeter
      const webmeterSubfolders = await prisma.folders.findMany({
        where: { parentId: webmeterFolder.id }
      })
      
      console.log(`Webmeter has ${webmeterSubfolders.length} subfolders:`)
      for (const sub of webmeterSubfolders) {
        console.log(`  - ${sub.name}: ID=${sub.id}, Parent=${sub.parentId}`)
        
        // Check keys in this subfolder
        const keysInSub = await prisma.keys.findMany({
          where: { folderId: sub.id }
        })
        console.log(`    Keys: ${keysInSub.length}`)
        keysInSub.forEach(key => {
          console.log(`      * ${key.name} (${key.type})`)
        })
      }
    }
    
    console.log('\n3️⃣ Testing the exact query the API uses:')
    
    // Test the exact query for General/Database
    if (generalFolder) {
      const databaseSubfolder = await prisma.folders.findFirst({
        where: {
          name: 'Database',
          userId: generalFolder.userId,
          parentId: generalFolder.id
        }
      })
      
      if (databaseSubfolder) {
        console.log(`✅ Found Database subfolder: ID=${databaseSubfolder.id}`)
        
        // Test the exact key query
        const keys = await prisma.keys.findMany({
          where: {
            folderId: databaseSubfolder.id,
            userId: generalFolder.userId
          }
        })
        
        console.log(`Keys found with exact query: ${keys.length}`)
        keys.forEach(key => {
          console.log(`  - ${key.name} (${key.type})`)
        })
      } else {
        console.log('❌ Database subfolder not found with exact query')
      }
    }
    
    console.log('\n4️⃣ Checking for duplicate folders:')
    const allFolders = await prisma.folders.findMany({
      orderBy: { name: 'asc' }
    })
    
    const folderCounts = {}
    allFolders.forEach(folder => {
      const key = `${folder.name}-${folder.parentId || 'root'}`
      folderCounts[key] = (folderCounts[key] || 0) + 1
    })
    
    console.log('Folder counts by name and parent:')
    Object.entries(folderCounts).forEach(([key, count]) => {
      if (count > 1) {
        console.log(`  ⚠️  ${key}: ${count} duplicates`)
      }
    })
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the debug
debugFolderRelationships()
  .then(() => {
    console.log('✅ Folder relationship debug completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Folder relationship debug failed:', error)
    process.exit(1)
  }) 