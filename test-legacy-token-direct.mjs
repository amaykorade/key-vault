import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testLegacyTokenDirect() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Testing legacy token directly in database...\n');

    const regeneratedToken = 'tok_user-1755114408989-8k4l6dqkn_8bp5gwz0bwh';
    
    console.log(`🔑 Testing token: ${regeneratedToken}`);
    
    // Test the exact query that getCurrentUser should be using
    console.log('\n1️⃣ Testing legacy token query (users.apiToken)...');
    const legacyUserQuery = `
      SELECT id, email, role, "apiToken", "isActive", "createdAt"
      FROM users 
      WHERE "apiToken" = $1 AND "isActive" = true
    `;
    
    const legacyUserResult = await client.query(legacyUserQuery, [regeneratedToken]);
    
    if (legacyUserResult.rows.length > 0) {
      const userData = legacyUserResult.rows[0];
      console.log('✅ Legacy token query successful!');
      console.log(`   User ID: ${userData.id}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   API Token: ${userData.apiToken}`);
      console.log(`   Active: ${userData.isActive}`);
      console.log(`   Created: ${userData.createdAt}`);
    } else {
      console.log('❌ Legacy token query failed');
    }

    // Test the new api_tokens query
    console.log('\n2️⃣ Testing new token query (api_tokens table)...');
    const newTokenQuery = `
      SELECT t.*, u.email, u.role 
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t.token = $1 AND t."isActive" = true
    `;
    
    const newTokenResult = await client.query(newTokenQuery, [regeneratedToken]);
    
    if (newTokenResult.rows.length > 0) {
      const tokenData = newTokenResult.rows[0];
      console.log('✅ New token query successful!');
      console.log(`   Token ID: ${tokenData.id}`);
      console.log(`   User: ${tokenData.email}`);
      console.log(`   Role: ${tokenData.role}`);
    } else {
      console.log('❌ New token query failed (expected for legacy token)');
    }

    // Test the working token
    console.log('\n3️⃣ Testing working token: tok_rctyg4wv1nq_577g0l6oup...');
    const workingTokenQuery = `
      SELECT t.*, u.email, u.role 
      FROM api_tokens t 
      JOIN users u ON t."userId" = u.id 
      WHERE t.token = $1 AND t."isActive" = true
    `;
    
    const workingTokenResult = await client.query(workingTokenQuery, ['tok_rctyg4wv1nq_577g0l6oup']);
    
    if (workingTokenResult.rows.length > 0) {
      const tokenData = workingTokenResult.rows[0];
      console.log('✅ Working token query successful!');
      console.log(`   Token ID: ${tokenData.id}`);
      console.log(`   User: ${tokenData.email}`);
      console.log(`   Role: ${tokenData.role}`);
    } else {
      console.log('❌ Working token query failed');
    }

    // Test if there are any database constraints or issues
    console.log('\n4️⃣ Testing database constraints...');
    const constraintsQuery = `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'apiToken'
    `;
    
    const constraintsResult = await client.query(constraintsQuery);
    
    if (constraintsResult.rows.length > 0) {
      const columnInfo = constraintsResult.rows[0];
      console.log('✅ Users.apiToken column info:');
      console.log(`   Table: ${columnInfo.table_name}`);
      console.log(`   Column: ${columnInfo.column_name}`);
      console.log(`   Type: ${columnInfo.data_type}`);
      console.log(`   Nullable: ${columnInfo.is_nullable}`);
      console.log(`   Default: ${columnInfo.column_default}`);
    } else {
      console.log('❌ Could not find apiToken column info');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

testLegacyTokenDirect(); 