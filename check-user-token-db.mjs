import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkUserTokenDB() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking your token in database...\n');

    const userToken = 'tok_user-1755114408989-8k4l6dqkn_tddscy1am4';
    
    console.log(`🔑 Looking for token: ${userToken}`);
    
    // Check if token exists
    const tokenQuery = `
      SELECT t.*, u.email, u.role 
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t.token = $1
    `;
    
    const tokenResult = await client.query(tokenQuery, [userToken]);
    
    if (tokenResult.rows.length === 0) {
      console.log('❌ Token not found in database');
      console.log(`   Token: ${userToken}`);
      
      // Check if there are any tokens for users with similar IDs
      console.log('\n🔍 Checking for tokens with similar user IDs...');
      const similarTokensQuery = `
        SELECT t.token, t."userId", u.email, u.role, t."createdAt"
        FROM api_tokens t 
        JOIN users u ON t."userId" = u.id 
        WHERE t."userId" LIKE '%1755114408989%'
        ORDER BY t."createdAt" DESC
      `;
      
      const similarTokensResult = await client.query(similarTokensQuery);
      
      if (similarTokensResult.rows.length > 0) {
        console.log(`Found ${similarTokensResult.rows.length} tokens with similar user IDs:`);
        similarTokensResult.rows.forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.token}`);
          console.log(`      User: ${token.email} (${token.role})`);
          console.log(`      User ID: ${token.userId}`);
          console.log(`      Created: ${token.createdAt}`);
        });
      } else {
        console.log('   No tokens found with similar user IDs');
      }
      
      // Check all available tokens
      console.log('\n📋 All available tokens in database:');
      const allTokens = await client.query('SELECT token, "userId", "createdAt" FROM api_tokens ORDER BY "createdAt" DESC LIMIT 15');
      
      if (allTokens.rows.length > 0) {
        allTokens.rows.forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.token} (User ID: ${token.userId}) - Created: ${token.createdAt}`);
        });
      } else {
        console.log('   No tokens found in database');
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

    // Check if there are any users with similar IDs
    console.log('\n👤 Checking for users with similar IDs...');
    const similarUsersQuery = `
      SELECT id, email, role, plan, "isActive", "createdAt"
      FROM users 
      WHERE id LIKE '%1755114408989%'
      ORDER BY "createdAt" DESC
    `;
    
    const similarUsersResult = await client.query(similarUsersQuery);
    
    if (similarUsersResult.rows.length > 0) {
      console.log(`Found ${similarUsersResult.rows.length} users with similar IDs:`);
      similarUsersResult.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.role})`);
        console.log(`      User ID: ${user.id}`);
        console.log(`      Plan: ${user.plan}`);
        console.log(`      Active: ${user.isActive}`);
        console.log(`      Created: ${user.createdAt}`);
      });
    } else {
      console.log('   No users found with similar IDs');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkUserTokenDB(); 