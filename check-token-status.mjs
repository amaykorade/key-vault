import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkTokenStatus() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking token status in database...\n');

    const tokenToCheck = 'tok_user-1755114408989-8k4l6dqkn_tddscy1am4';

    // Check if token exists
    const tokenQuery = `
      SELECT t.*, u.email, u.role 
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t.token = $1
    `;
    
    const tokenResult = await client.query(tokenQuery, [tokenToCheck]);
    
    if (tokenResult.rows.length === 0) {
      console.log('❌ Token not found in database');
      console.log(`   Token: ${tokenToCheck}`);
      
      // Show all available tokens
      console.log('\n📋 Available tokens in database:');
      const allTokens = await client.query('SELECT token, "userId", "createdAt" FROM api_tokens ORDER BY "createdAt" DESC LIMIT 10');
      
      if (allTokens.rows.length === 0) {
        console.log('   No tokens found in database');
      } else {
        allTokens.rows.forEach((row, index) => {
          console.log(`   ${index + 1}. ${row.token} (User ID: ${row.userId}) - Created: ${row.createdAt}`);
        });
      }
    } else {
      const tokenData = tokenResult.rows[0];
      console.log('✅ Token found in database!');
      console.log(`   Token: ${tokenData.token}`);
      console.log(`   User: ${tokenData.email}`);
      console.log(`   Role: ${tokenData.role}`);
      console.log(`   Created: ${tokenData.createdAt}`);
      console.log(`   Last Used: ${tokenData.lastUsedAt || 'Never'}`);
      console.log(`   Is Active: ${tokenData.isActive}`);
    }

    // Check if user exists and has proper permissions
    if (tokenResult.rows.length > 0) {
      const userId = tokenResult.rows[0].userId;
      
      console.log('\n👤 Checking user details...');
      const userQuery = 'SELECT * FROM users WHERE id = $1';
      const userResult = await client.query(userQuery, [userId]);
      
      if (userResult.rows.length > 0) {
        const userData = userResult.rows[0];
        console.log(`   User ID: ${userData.id}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Permissions: ${userData.permissions ? userData.permissions.length : 0} permissions`);
        console.log(`   Is Active: ${userData.isActive}`);
      } else {
        console.log('❌ User not found (orphaned token)');
      }
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkTokenStatus(); 