import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkNewTokenDB() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking your newly regenerated token in database...\n');

    const newToken = 'tok_user-1755114408989-8k4l6dqkn_8bp5gwz0bwh';
    
    console.log(`🔑 Looking for new token: ${newToken}`);
    
    // Check if new token exists
    const tokenQuery = `
      SELECT t.*, u.email, u.role 
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t.token = $1
    `;
    
    const tokenResult = await client.query(tokenQuery, [newToken]);
    
    if (tokenResult.rows.length === 0) {
      console.log('❌ New token not found in database yet');
      console.log(`   Token: ${newToken}`);
      console.log('   This suggests the token regeneration may not have been saved to the database');
      
      // Check what tokens exist for your user ID
      console.log('\n🔍 Checking existing tokens for your user ID...');
      const userTokensQuery = `
        SELECT t.token, t."createdAt", t."lastUsedAt", t."isActive"
        FROM api_tokens t 
        WHERE t."userId" = 'user-1755114408989-8k4l6dqkn'
        ORDER BY t."createdAt" DESC
      `;
      
      const userTokensResult = await client.query(userTokensQuery);
      
      if (userTokensResult.rows.length > 0) {
        console.log(`Found ${userTokensResult.rows.length} tokens for your user:`);
        userTokensResult.rows.forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.token}`);
          console.log(`      Created: ${token.createdAt}`);
          console.log(`      Last Used: ${token.lastUsedAt || 'Never'}`);
          console.log(`      Active: ${token.isActive}`);
        });
      } else {
        console.log('   No tokens found for your user');
      }
      
      // Check if there are any recent tokens that might be the new one
      console.log('\n🔍 Checking for recent tokens (last 10 minutes)...');
      const recentTokensQuery = `
        SELECT t.token, t."userId", u.email, t."createdAt"
        FROM api_tokens t 
        JOIN users u ON t."userId" = u.id 
        WHERE t."createdAt" > NOW() - INTERVAL '10 minutes'
        ORDER BY t."createdAt" DESC
      `;
      
      const recentTokensResult = await client.query(recentTokensQuery);
      
      if (recentTokensResult.rows.length > 0) {
        console.log(`Found ${recentTokensResult.rows.length} recent tokens:`);
        recentTokensResult.rows.forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.token}`);
          console.log(`      User: ${token.email}`);
          console.log(`      Created: ${token.createdAt}`);
        });
      } else {
        console.log('   No recent tokens found');
      }
      
    } else {
      const tokenData = tokenResult.rows[0];
      console.log('✅ New token found in database!');
      console.log(`   Token: ${tokenData.token}`);
      console.log(`   User: ${tokenData.email}`);
      console.log(`   Role: ${tokenData.role}`);
      console.log(`   Created: ${tokenData.createdAt}`);
      console.log(`   Last Used: ${tokenData.lastUsedAt || 'Never'}`);
      console.log(`   Is Active: ${tokenData.isActive}`);
    }

    // Check your user account status
    console.log('\n👤 Checking your user account...');
    const userQuery = `
      SELECT id, email, role, plan, "isActive", "createdAt", "lastLoginAt"
      FROM users 
      WHERE id = 'user-1755114408989-8k4l6dqkn'
    `;
    
    const userResult = await client.query(userQuery);
    
    if (userResult.rows.length > 0) {
      const userData = userResult.rows[0];
      console.log('✅ User account found!');
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Plan: ${userData.plan}`);
      console.log(`   Active: ${userData.isActive}`);
      console.log(`   Created: ${userData.createdAt}`);
      console.log(`   Last Login: ${userData.lastLoginAt || 'Never'}`);
    } else {
      console.log('❌ User account not found');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkNewTokenDB(); 