import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkExactFolder() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking exact folder structure for user\'s DB_URL key...\n');

    // Check the exact folder where the user's DB_URL key is located
    const folderId = 'cmecnb3qo0001k004rc1pkts4';
    
    console.log(`📁 Checking folder: ${folderId}`);
    
    // Get folder details
    const folderQuery = 'SELECT * FROM folders WHERE id = $1';
    const folderResult = await client.query(folderQuery, [folderId]);
    
    if (folderResult.rows.length > 0) {
      const folderData = folderResult.rows[0];
      console.log('✅ Database folder found!');
      console.log(`   Name: ${folderData.name}`);
      console.log(`   Parent ID: ${folderData.parentId || 'Root'}`);
      console.log(`   User ID: ${folderData.userId}`);
      
      // Check parent folder
      if (folderData.parentId) {
        const parentQuery = 'SELECT * FROM folders WHERE id = $1';
        const parentResult = await client.query(parentQuery, [folderData.parentId]);
        
        if (parentResult.rows.length > 0) {
          const parentData = parentResult.rows[0];
          console.log('✅ Parent folder found!');
          console.log(`   Name: ${parentData.name}`);
          console.log(`   Parent ID: ${parentData.parentId || 'Root'}`);
          
          // Check if parent has a parent (to build the full path)
          if (parentData.parentId) {
            const grandParentQuery = 'SELECT * FROM folders WHERE id = $1';
            const grandParentResult = await client.query(grandParentQuery, [parentData.parentId]);
            
            if (grandParentResult.rows.length > 0) {
              const grandParentData = grandParentResult.rows[0];
              console.log('✅ Grandparent folder found!');
              console.log(`   Name: ${grandParentData.name}`);
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
      }
      
      // Check what keys are in this folder
      console.log('\n🗝️ Keys in this folder:');
      const keysQuery = 'SELECT name, environment, "createdAt", id FROM keys WHERE "folderId" = $1';
      const keysResult = await client.query(keysQuery, [folderId]);
      
      if (keysResult.rows.length > 0) {
        keysResult.rows.forEach((key, index) => {
          console.log(`   ${index + 1}. ${key.name} (${key.environment}) - ID: ${key.id}`);
        });
      } else {
        console.log('   No keys found in this folder');
      }
    } else {
      console.log('❌ Folder not found');
    }

    // Also check if there are any other folders with similar names
    console.log('\n🔍 Checking for other Database folders...');
    const similarFoldersQuery = `
      SELECT f.*, 
             CASE WHEN f."parentId" IS NOT NULL THEN p.name ELSE 'Root' END as parent_name
      FROM folders f
      LEFT JOIN folders p ON f."parentId" = p.id
      WHERE f.name = 'Database'
      ORDER BY f."createdAt" DESC
    `;
    
    const similarFoldersResult = await client.query(similarFoldersQuery);
    
    if (similarFoldersResult.rows.length > 0) {
      console.log(`Found ${similarFoldersResult.rows.length} Database folders:`);
      similarFoldersResult.rows.forEach((folder, index) => {
        console.log(`   ${index + 1}. ${folder.name} in ${folder.parent_name} (${folder.id}) - User: ${folder.userId}`);
      });
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkExactFolder(); 