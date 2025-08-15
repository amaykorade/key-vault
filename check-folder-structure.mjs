import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkFolderStructure() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking folder structure...\n');

    // Check the folder where DB_URL key is located
    const folderId = 'cmecnb3qo0001k004rc1pkts4';
    
    console.log(`📁 Checking folder: ${folderId}`);
    
    // Get folder details
    const folderQuery = 'SELECT * FROM folders WHERE id = $1';
    const folderResult = await client.query(folderQuery, [folderId]);
    
    if (folderResult.rows.length > 0) {
      const folderData = folderResult.rows[0];
      console.log('✅ Folder found!');
      console.log(`   Name: ${folderData.name}`);
      console.log(`   Type: ${folderData.type}`);
      console.log(`   Parent ID: ${folderData.parentId || 'Root'}`);
      console.log(`   User ID: ${folderData.userId}`);
      console.log(`   Created: ${folderData.createdAt}`);
      
      // Check if this folder has a parent (to build the path)
      if (folderData.parentId) {
        console.log('\n🔍 Checking parent folder...');
        const parentQuery = 'SELECT * FROM folders WHERE id = $1';
        const parentResult = await client.query(parentQuery, [folderData.parentId]);
        
        if (parentResult.rows.length > 0) {
          const parentData = parentResult.rows[0];
          console.log('✅ Parent folder found!');
          console.log(`   Name: ${parentData.name}`);
          console.log(`   Type: ${parentData.type}`);
          console.log(`   Parent ID: ${parentData.parentId || 'Root'}`);
          
          // Check if parent has a parent (to build the full path)
          if (parentData.parentId) {
            const grandParentQuery = 'SELECT * FROM folders WHERE id = $1';
            const grandParentResult = await client.query(grandParentQuery, [parentData.parentId]);
            
            if (grandParentResult.rows.length > 0) {
              const grandParentData = grandParentResult.rows[0];
              console.log('✅ Grandparent folder found!');
              console.log(`   Name: ${grandParentData.name}`);
              console.log(`   Type: ${grandParentData.type}`);
              console.log(`   Parent ID: ${grandParentData.parentId || 'Root'}`);
              
              // Build the path
              const path = `${grandParentData.name}/${parentData.name}/${folderData.name}`;
              console.log(`\n🛣️ Full path: ${path}`);
            }
          } else {
            const path = `${parentData.name}/${folderData.name}`;
            console.log(`\n🛣️ Path: ${path}`);
          }
        }
      } else {
        console.log('\n🛣️ This is a root folder');
      }
      
      // Check what keys are in this folder
      console.log('\n🗝️ Keys in this folder:');
      const keysQuery = 'SELECT name, environment, "createdAt" FROM keys WHERE "folderId" = $1';
      const keysResult = await client.query(keysQuery, [folderId]);
      
      if (keysResult.rows.length > 0) {
        keysResult.rows.forEach((key, index) => {
          console.log(`   ${index + 1}. ${key.name} (${key.environment}) - Created: ${key.createdAt}`);
        });
      } else {
        console.log('   No keys found in this folder');
      }
      
    } else {
      console.log('❌ Folder not found');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkFolderStructure(); 