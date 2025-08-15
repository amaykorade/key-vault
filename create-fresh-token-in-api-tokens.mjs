import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function createFreshTokenInApiTokens() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔑 Adding fresh regenerated token to api_tokens table...\n');

    const userId = 'user-1755114408989-8k4l6dqkn';
    const freshToken = 'tok_user-1755114408989-8k4l6dqkn_0c71b957167e85653ad1b30db10cd41d';
    
    console.log(`👤 User ID: ${userId}`);
    console.log(`🔑 Fresh Token: ${freshToken}`);
    
    // Check if token already exists in api_tokens table
    const existingTokenQuery = `
      SELECT * FROM api_tokens WHERE token = $1
    `;
    
    const existingTokenResult = await client.query(existingTokenQuery, [freshToken]);
    
    if (existingTokenResult.rows.length > 0) {
      console.log('✅ Token already exists in api_tokens table!');
      const tokenData = existingTokenResult.rows[0];
      console.log(`   Token ID: ${tokenData.id}`);
      console.log(`   User ID: ${tokenData.userId}`);
      console.log(`   Active: ${tokenData.isActive}`);
      console.log(`   Created: ${tokenData.createdAt}`);
      return;
    }
    
    // Create new token in api_tokens table
    console.log('\n📝 Adding fresh token to api_tokens table...');
    const insertTokenQuery = `
      INSERT INTO api_tokens (
        id,
        token, 
        "userId", 
        permissions, 
        "isActive", 
        "createdAt", 
        "updatedAt"
      ) VALUES (
        gen_random_uuid()::text,
        $1, $2, $3, $4, $5, $6
      ) RETURNING *
    `;
    
    const permissions = [
      'keys:read', 'keys:write', 'keys:delete', 'keys:rotate',
      'folders:read', 'folders:write', 'folders:delete',
      'projects:read', 'projects:write', 'projects:delete',
      'api:read', 'api:write', 'api:admin'
    ];
    
    const now = new Date();
    
    const insertResult = await client.query(insertTokenQuery, [
      freshToken,
      userId,
      permissions,
      true,
      now,
      now
    ]);
    
    if (insertResult.rows.length > 0) {
      const newToken = insertResult.rows[0];
      console.log('✅ Fresh token added to api_tokens table!');
      console.log(`   Token ID: ${newToken.id}`);
      console.log(`   Token: ${newToken.token}`);
      console.log(`   User ID: ${newToken.userId}`);
      console.log(`   Permissions: ${newToken.permissions.length} permissions`);
      console.log(`   Active: ${newToken.isActive}`);
      console.log(`   Created: ${newToken.createdAt}`);
      
      console.log('\n🎯 Now your fresh regenerated token should work!');
      console.log(`   Token: ${freshToken}`);
      console.log(`   This token is now stored in both systems for full compatibility.`);
      
    } else {
      console.log('❌ Failed to add token to api_tokens table');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

createFreshTokenInApiTokens(); 