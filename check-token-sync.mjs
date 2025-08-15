import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkTokenSync() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking token synchronization...\n');

    const regeneratedToken = 'tok_user-1755114408989-8k4l6dqkn_8bp5gwz0bwh';
    
    console.log(`🔑 Looking for regenerated token: ${regeneratedToken}`);
    
    // Check if regenerated token exists in api_tokens table
    const apiTokensQuery = `
      SELECT t.*, u.email, u.role 
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t.token = $1
    `;
    
    const apiTokensResult = await client.query(apiTokensQuery, [regeneratedToken]);
    
    if (apiTokensResult.rows.length > 0) {
      console.log('✅ Token found in api_tokens table!');
      const tokenData = apiTokensResult.rows[0];
      console.log(`   User: ${tokenData.email}`);
      console.log(`   Role: ${tokenData.role}`);
      console.log(`   Created: ${tokenData.createdAt}`);
    } else {
      console.log('❌ Token not found in api_tokens table');
    }

    // Check if regenerated token exists in users.apiToken field
    const legacyTokenQuery = `
      SELECT id, email, role, "apiToken", "isActive"
      FROM users 
      WHERE "apiToken" = $1
    `;
    
    const legacyTokenResult = await client.query(legacyTokenQuery, [regeneratedToken]);
    
    if (legacyTokenResult.rows.length > 0) {
      console.log('✅ Token found in users.apiToken field!');
      const userData = legacyTokenResult.rows[0];
      console.log(`   User: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Active: ${userData.isActive}`);
    } else {
      console.log('❌ Token not found in users.apiToken field');
    }

    // Check what tokens exist for your user ID
    console.log('\n🔍 Checking all tokens for your user ID...');
    const userTokensQuery = `
      SELECT t.token, t."createdAt", t."lastUsedAt", t."isActive"
      FROM api_tokens t 
      WHERE t."userId" = 'user-1755114408989-8k4l6dqkn'
      ORDER BY t."createdAt" DESC
    `;
    
    const userTokensResult = await client.query(userTokensQuery);
    
    if (userTokensResult.rows.length > 0) {
      console.log(`Found ${userTokensResult.rows.length} tokens in api_tokens table:`);
      userTokensResult.rows.forEach((token, index) => {
        console.log(`   ${index + 1}. ${token.token}`);
        console.log(`      Created: ${token.createdAt}`);
        console.log(`      Active: ${token.isActive}`);
      });
    } else {
      console.log('   No tokens found in api_tokens table');
    }

    // Check legacy apiToken field
    const legacyUserQuery = `
      SELECT id, email, role, "apiToken", "isActive"
      FROM users 
      WHERE id = 'user-1755114408989-8k4l6dqkn'
    `;
    
    const legacyUserResult = await client.query(legacyUserQuery);
    
    if (legacyUserResult.rows.length > 0) {
      const userData = legacyUserResult.rows[0];
      console.log(`\n👤 User legacy apiToken: ${userData.apiToken || 'None'}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Active: ${userData.isActive}`);
    }

    // Check recent token activity
    console.log('\n🔍 Checking recent token activity (last 30 minutes)...');
    const recentTokensQuery = `
      SELECT t.token, t."userId", u.email, t."createdAt"
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t."createdAt" > NOW() - INTERVAL '30 minutes'
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

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkTokenSync(); 