import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_GXOiYyq5lK6F@ep-red-union-a1h7po4z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkEnvironmentColumn() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔍 Checking environment column in database...\n');

    // Check the keys table structure
    console.log('1️⃣ Checking keys table structure...');
    const tableInfoQuery = `
      SELECT 
        column_name,
        data_type,
        udt_name,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'keys' AND column_name = 'environment'
      ORDER BY ordinal_position
    `;
    
    const tableInfoResult = await client.query(tableInfoQuery);
    
    if (tableInfoResult.rows.length > 0) {
      const columnInfo = tableInfoResult.rows[0];
      console.log('✅ Environment column found in keys table:');
      console.log(`   Column: ${columnInfo.column_name}`);
      console.log(`   Data Type: ${columnInfo.data_type}`);
      console.log(`   UDT Name: ${columnInfo.udt_name}`);
      console.log(`   Nullable: ${columnInfo.is_nullable}`);
      console.log(`   Default: ${columnInfo.column_default}`);
    } else {
      console.log('❌ Environment column not found in keys table');
    }

    // Check if the environment enum type exists
    console.log('\n2️⃣ Checking environment enum type...');
    const enumTypeQuery = `
      SELECT 
        t.typname,
        e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'environment'
      ORDER BY e.enumsortorder
    `;
    
    const enumTypeResult = await client.query(enumTypeQuery);
    
    if (enumTypeResult.rows.length > 0) {
      console.log('✅ Environment enum type found:');
      enumTypeResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.enumlabel}`);
      });
    } else {
      console.log('❌ Environment enum type not found');
    }

    // Check actual environment values in the keys table
    console.log('\n3️⃣ Checking actual environment values in keys table...');
    const actualValuesQuery = `
      SELECT DISTINCT environment, COUNT(*) as count
      FROM keys 
      WHERE environment IS NOT NULL
      GROUP BY environment
      ORDER BY environment
    `;
    
    const actualValuesResult = await client.query(actualValuesQuery);
    
    if (actualValuesResult.rows.length > 0) {
      console.log('✅ Environment values found in keys table:');
      actualValuesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.environment} (${row.count} keys)`);
      });
    } else {
      console.log('❌ No environment values found in keys table');
    }

    // Check if we can query with environment filter
    console.log('\n4️⃣ Testing environment query...');
    try {
      const testQuery = `
        SELECT name, environment 
        FROM keys 
        WHERE environment = 'DEVELOPMENT' 
        LIMIT 1
      `;
      
      const testResult = await client.query(testQuery);
      console.log('✅ Environment query successful');
      console.log(`   Found ${testResult.rows.length} keys with DEVELOPMENT environment`);
    } catch (error) {
      console.log('❌ Environment query failed:');
      console.log(`   Error: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkEnvironmentColumn(); 