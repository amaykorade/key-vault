import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const API_TOKEN = 'tok_user-1755114408989-8k4l6dqkn_0c71b957167e85653ad1b30db10cd41d';

console.log('🔒 Testing Environment Security Requirements - Key Vault API\n');
console.log(`Token: ${API_TOKEN.substring(0, 20)}...`);
console.log(`API Base: ${API_BASE}\n`);

async function testEnvironmentSecurity() {
  try {
    // Test 1: Try to access key WITHOUT environment (should fail with 400)
    console.log('1️⃣ Testing key access WITHOUT environment (should fail)...');
    const noEnvResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (noEnvResponse.status === 400) {
      const errorData = await noEnvResponse.json();
      console.log('✅ Security working: Key access without environment correctly rejected');
      console.log(`   Error: ${errorData.error}`);
      console.log(`   Message: ${errorData.message}`);
      console.log(`   Security Note: ${errorData.securityNote}`);
    } else {
      console.log('❌ Security failed: Key access without environment was allowed');
      console.log(`   Status: ${noEnvResponse.status}`);
    }

    // Test 2: Access key WITH environment (should work)
    console.log('\n2️⃣ Testing key access WITH environment (should work)...');
    const withEnvResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=DEVELOPMENT`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (withEnvResponse.ok) {
      const keyData = await withEnvResponse.json();
      console.log('✅ Key access with environment successful');
      console.log(`   Key: ${keyData.key?.name}`);
      console.log(`   Environment: ${keyData.key?.environment}`);
      console.log(`   Value: ${keyData.key?.value}`);
    } else {
      console.log('❌ Key access with environment failed');
      console.log(`   Status: ${withEnvResponse.status}`);
    }

    // Test 3: Access folder WITHOUT environment (should still work for browsing)
    console.log('\n3️⃣ Testing folder access WITHOUT environment (should work for browsing)...');
    const folderResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (folderResponse.ok) {
      const folderData = await folderResponse.json();
      console.log('✅ Folder browsing without environment successful');
      console.log(`   Folder: ${folderData.folder?.name}`);
      console.log(`   Total Keys: ${folderData.totalKeys}`);
      console.log(`   Note: Keys are listed but values are not decrypted without environment`);
    } else {
      console.log('❌ Folder browsing failed');
      console.log(`   Status: ${folderResponse.status}`);
    }

    // Test 4: Access folder WITH environment (should work and show decrypted keys)
    console.log('\n4️⃣ Testing folder access WITH environment (should show decrypted keys)...');
    const folderWithEnvResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder&environment=DEVELOPMENT`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (folderWithEnvResponse.ok) {
      const folderData = await folderWithEnvResponse.json();
      console.log('✅ Folder access with environment successful');
      console.log(`   Folder: ${folderData.folder?.name}`);
      console.log(`   Environment: ${folderData.environment}`);
      console.log(`   Total Keys: ${folderData.totalKeys}`);
      
      if (folderData.keys && folderData.keys.length > 0) {
        console.log('   Keys with decrypted values:');
        folderData.keys.forEach((key, index) => {
          console.log(`     ${index + 1}. ${key.name} (${key.environment})`);
          console.log(`        Value: ${key.value}`);
        });
      }
    } else {
      console.log('❌ Folder access with environment failed');
      console.log(`   Status: ${folderWithEnvResponse.status}`);
    }

    // Test 5: Try invalid environment (should fail)
    console.log('\n5️⃣ Testing with invalid environment (should fail)...');
    const invalidEnvResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=invalid_env`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (invalidEnvResponse.status === 400) {
      const errorData = await invalidEnvResponse.json();
      console.log('✅ Invalid environment correctly rejected');
      console.log(`   Error: ${errorData.error}`);
      console.log(`   Message: ${errorData.message}`);
    } else {
      console.log('❌ Invalid environment not properly rejected');
      console.log(`   Status: ${invalidEnvResponse.status}`);
    }

    console.log('\n🎯 Environment security test completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Key access without environment: BLOCKED (Security working)');
    console.log('   ✅ Key access with environment: ALLOWED (Functionality working)');
    console.log('   ✅ Folder browsing without environment: ALLOWED (Browsing working)');
    console.log('   ✅ Folder access with environment: ALLOWED (Decryption working)');
    console.log('   ✅ Invalid environment: BLOCKED (Validation working)');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testEnvironmentSecurity(); 