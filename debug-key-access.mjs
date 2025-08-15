import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function debugKeyAccess() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Debugging key access issue...\n');

    // Check the DB_URL key directly
    console.log('1️⃣ Checking DB_URL key directly...');
    const keyQuery = `
      SELECT k.*, f.name as folder_name, f.id as folder_id, u.email as user_email
      FROM keys k
      JOIN folders f ON k."folderId" = f.id
      JOIN users u ON k."userId" = u.id
      WHERE k.name = 'DB_URL'
    `;
    
    const keyResult = await client.query(keyQuery);
    
    if (keyResult.rows.length > 0) {
      const keyData = keyResult.rows[0];
      console.log('✅ DB_URL key found!');
      console.log(`   Key ID: ${keyData.id}`);
      console.log(`   Name: ${keyData.name}`);
      console.log(`   Environment: ${keyData.environment}`);
      console.log(`   Folder: ${keyData.folder_name} (${keyData.folder_id})`);
      console.log(`   User: ${keyData.user_email}`);
      console.log(`   Created: ${keyData.createdAt}`);
      console.log(`   Has Value: ${keyData.value ? 'Yes' : 'No'}`);
      console.log(`   Has Encrypted Value: ${keyData.encryptedValue ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ DB_URL key not found');
    }

    // Check the folder structure
    console.log('\n2️⃣ Checking folder structure...');
    const folderQuery = `
      SELECT f.*, 
             CASE WHEN f."parentId" IS NOT NULL THEN p.name ELSE 'Root' END as parent_name
      FROM folders f
      LEFT JOIN folders p ON f."parentId" = p.id
      WHERE f.id = 'cmecnb3qo0001k004rc1pkts4'
    `;
    
    const folderResult = await client.query(folderQuery);
    
    if (folderResult.rows.length > 0) {
      const folderData = folderResult.rows[0];
      console.log('✅ Database folder found!');
      console.log(`   Name: ${folderData.name}`);
      console.log(`   Parent: ${folderData.parent_name}`);
      console.log(`   User ID: ${folderData.userId}`);
      console.log(`   Type: ${folderData.type || 'undefined'}`);
      
      // Check parent folder
      if (folderData.parentId) {
        const parentQuery = 'SELECT * FROM folders WHERE id = $1';
        const parentResult = await client.query(parentQuery, [folderData.parentId]);
        
        if (parentResult.rows.length > 0) {
          const parentData = parentResult.rows[0];
          console.log(`   Parent Folder: ${parentData.name} (${parentData.id})`);
          console.log(`   Parent Type: ${parentData.type || 'undefined'}`);
        }
      }
    }

    // Check what keys are actually in the Database folder
    console.log('\n3️⃣ Checking keys in Database folder...');
    const folderKeysQuery = `
      SELECT k.name, k.environment, k."createdAt", k.id
      FROM keys k
      WHERE k."folderId" = 'cmecnb3qo0001k004rc1pkts4'
    `;
    
    const folderKeysResult = await client.query(folderKeysQuery);
    
    if (folderKeysResult.rows.length > 0) {
      console.log(`✅ Found ${folderKeysResult.rows.length} keys in Database folder:`);
      folderKeysResult.rows.forEach((key, index) => {
        console.log(`   ${index + 1}. ${key.name} (${key.environment}) - ID: ${key.id}`);
      });
    } else {
      console.log('❌ No keys found in Database folder');
    }

    // Check if there are any keys at all for this user
    console.log('\n4️⃣ Checking all keys for user...');
    const userKeysQuery = `
      SELECT k.name, k.environment, f.name as folder_name, k."createdAt"
      FROM keys k
      JOIN folders f ON k."folderId" = f.id
      WHERE k."userId" = 'user-1755114408989-8k4l6dqkn'
      ORDER BY k."createdAt" DESC
    `;
    
    const userKeysResult = await client.query(userKeysQuery);
    
    if (userKeysResult.rows.length > 0) {
      console.log(`✅ Found ${userKeysResult.rows.length} keys for user:`);
      userKeysResult.rows.forEach((key, index) => {
        console.log(`   ${index + 1}. ${key.name} (${key.environment}) in ${key.folder_name}`);
      });
    } else {
      console.log('❌ No keys found for user');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

debugKeyAccess(); 