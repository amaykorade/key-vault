import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkFreshTokenDB() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking freshly regenerated token in database...\n');

    const freshToken = 'tok_user-1755114408989-8k4l6dqkn_0c71b957167e85653ad1b30db10cd41d';
    
    console.log(`🔑 Looking for fresh token: ${freshToken}`);
    
    // Check if fresh token exists in api_tokens table
    const apiTokensQuery = `
      SELECT t.*, u.email, u.role 
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t.token = $1
    `;
    
    const apiTokensResult = await client.query(apiTokensQuery, [freshToken]);
    
    if (apiTokensResult.rows.length > 0) {
      const tokenData = apiTokensResult.rows[0];
      console.log('✅ Token found in api_tokens table!');
      console.log(`   User: ${tokenData.email}`);
      console.log(`   Role: ${tokenData.role}`);
      console.log(`   Created: ${tokenData.createdAt}`);
    } else {
      console.log('❌ Token not found in api_tokens table');
    }

    // Check if fresh token exists in users.apiToken field
    const legacyTokenQuery = `
      SELECT id, email, role, "apiToken", "isActive"
      FROM users 
      WHERE "apiToken" = $1
    `;
    
    const legacyTokenResult = await client.query(legacyTokenQuery, [freshToken]);
    
    if (legacyTokenResult.rows.length > 0) {
      const userData = legacyTokenResult.rows[0];
      console.log('✅ Token found in users.apiToken field!');
      console.log(`   User: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Active: ${userData.isActive}`);
    } else {
      console.log('❌ Token not found in users.apiToken field');
    }

    // Check what the current apiToken is for your user
    console.log('\n🔍 Checking current apiToken for your user...');
    const currentUserQuery = `
      SELECT id, email, role, "apiToken", "isActive", "updatedAt"
      FROM users 
      WHERE id = 'user-1755114408989-8k4l6dqkn'
    `;
    
    const currentUserResult = await client.query(currentUserQuery);
    
    if (currentUserResult.rows.length > 0) {
      const userData = currentUserResult.rows[0];
      console.log('✅ User found!');
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Current API Token: ${userData.apiToken || 'None'}`);
      console.log(`   Active: ${userData.isActive}`);
      console.log(`   Last Updated: ${userData.updatedAt}`);
    } else {
      console.log('❌ User not found');
    }

    // Check recent token activity
    console.log('\n🔍 Checking recent token activity (last 10 minutes)...');
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

    // Check recent user updates
    console.log('\n🔍 Checking recent user updates (last 10 minutes)...');
    const recentUserUpdatesQuery = `
      SELECT id, email, "apiToken", "updatedAt"
      FROM users 
      WHERE "updatedAt" > NOW() - INTERVAL '10 minutes'
      ORDER BY "updatedAt" DESC
    `;
    
    const recentUserUpdatesResult = await client.query(recentUserUpdatesQuery);
    
    if (recentUserUpdatesResult.rows.length > 0) {
      console.log(`Found ${recentUserUpdatesResult.rows.length} recently updated users:`);
      recentUserUpdatesResult.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      API Token: ${user.apiToken || 'None'}`);
        console.log(`      Updated: ${user.updatedAt}`);
      });
    } else {
      console.log('   No recent user updates found');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkFreshTokenDB(); 