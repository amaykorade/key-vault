import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkUserDetails() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking user details...\n');

    // Check the user with similar ID
    const userId = 'user-1755114408989-8k4l6dqkn';
    
    console.log(`👤 Checking user: ${userId}`);
    
    // Get user details
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await client.query(userQuery, [userId]);
    
    if (userResult.rows.length > 0) {
      const userData = userResult.rows[0];
      console.log('✅ User found!');
      console.log(`   User ID: ${userData.id}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Plan: ${userData.plan}`);
      console.log(`   Is Active: ${userData.isActive}`);
      console.log(`   Created: ${userData.createdAt}`);
      
      // Get user's tokens
      console.log('\n🔑 User\'s API tokens:');
      const tokenQuery = 'SELECT token, "createdAt", "lastUsedAt", "isActive" FROM api_tokens WHERE "userId" = $1 ORDER BY "createdAt" DESC';
      const tokenResult = await client.query(tokenQuery, [userId]);
      
      if (tokenResult.rows.length > 0) {
        tokenResult.rows.forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.token}`);
          console.log(`      Created: ${token.createdAt}`);
          console.log(`      Last Used: ${token.lastUsedAt || 'Never'}`);
          console.log(`      Active: ${token.isActive}`);
        });
      } else {
        console.log('   No tokens found for this user');
      }
      
      // Check if user has any keys
      console.log('\n🗝️ User\'s keys:');
      const keysQuery = 'SELECT name, "folderId", environment, "createdAt" FROM keys WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 10';
      const keysResult = await client.query(keysQuery, [userId]);
      
      if (keysResult.rows.length > 0) {
        console.log(`   Found ${keysResult.rows.length} keys:`);
        keysResult.rows.forEach((key, index) => {
          console.log(`   ${index + 1}. ${key.name} (${key.environment}) - Folder: ${key.folderId}`);
        });
      } else {
        console.log('   No keys found for this user');
      }
      
    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkUserDetails(); 