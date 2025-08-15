import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const apiToken = 'tok_user-1755114408989-8k4l6dqkn_8bp5gwz0bwh'; // User's regenerated token

async function testFixedAuth() {
  console.log('🔑 Testing fixed authentication system...\n');

  try {
    // Test 1: Verify authentication with your regenerated token
    console.log('1️⃣ Testing authentication with your regenerated token...');
    const authResponse = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${authResponse.status}`);
    
    if (authResponse.ok) {
      const userData = await authResponse.json();
      console.log('✅ Authentication successful!');
      console.log(`   User: ${userData.user.email}`);
      console.log(`   Role: ${userData.user.role}`);
      console.log(`   Permissions: ${userData.user.permissions?.length || 0} permissions`);
    } else {
      const error = await authResponse.text();
      console.log('❌ Authentication failed');
      console.log('   Error:', error);
      return;
    }

    // Test 2: Fetch your DB_URL key from Webmeter/Database/DB_URL (Development)
    console.log('\n2️⃣ Fetching your DB_URL key from Webmeter/Database/DB_URL (Development)...');
    const keyResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=development`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${keyResponse.status}`);
    
    if (keyResponse.ok) {
      const keyData = await keyResponse.json();
      console.log('✅ Key fetched successfully!');
      console.log(`   Key Name: ${keyData.key.name}`);
      console.log(`   Environment: ${keyData.key.environment}`);
      console.log(`   Value: ${keyData.key.value ? '***HIDDEN***' : 'No value'}`);
      console.log(`   Created: ${keyData.key.createdAt}`);
    } else {
      const error = await keyResponse.text();
      console.log('❌ Key fetch failed');
      console.log('   Error:', error);
    }

    // Test 3: Test without environment parameter
    console.log('\n3️⃣ Testing without environment parameter...');
    const noEnvResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${noEnvResponse.status}`);
    
    if (noEnvResponse.ok) {
      const keyData = await noEnvResponse.json();
      console.log('✅ Key fetched successfully!');
      console.log(`   Key Name: ${keyData.key.name}`);
      console.log(`   Environment: ${keyData.key.environment}`);
    } else {
      const error = await noEnvResponse.text();
      console.log('❌ Key fetch failed');
      console.log('   Error:', error);
    }

    console.log('\n🎯 Testing complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testFixedAuth(); 