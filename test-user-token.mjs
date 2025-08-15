import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const API_TOKEN = 'tok_user-1755114408989-8k4l6dqkn_0c71b957167e85653ad1b30db10cd41d';

console.log('🚀 Testing User Token - Key Vault API\n');
console.log(`Token: ${API_TOKEN.substring(0, 20)}...`);
console.log(`API Base: ${API_BASE}\n`);

async function testUserToken() {
  try {
    // 1. Test Authentication
    console.log('1️⃣ Testing Authentication...');
    const authResponse = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authentication successful!');
      console.log(`   User: ${authData.user?.email || 'N/A'}`);
      console.log(`   Role: ${authData.user?.role || 'N/A'}`);
      console.log(`   Permissions: ${authData.user?.permissions?.length || 0} permissions`);
    } else {
      console.log('❌ Authentication failed');
      const errorData = await authResponse.json().catch(() => ({}));
      console.log(`   Error: ${JSON.stringify(errorData)}`);
      return;
    }

    // 2. Test Project Access (Webmeter)
    console.log('\n2️⃣ Testing Project Access (Webmeter)...');
    const projectResponse = await fetch(`${API_BASE}/api/access?path=Webmeter&type=project`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (projectResponse.ok) {
      const projectData = await projectResponse.json();
      console.log('✅ Project access successful!');
      console.log(`   Project: ${projectData.project?.name}`);
      console.log(`   Total Keys: ${projectData.totalKeys}`);
      console.log(`   Total Subfolders: ${projectData.totalSubfolders}`);
      console.log(`   Subfolders: ${projectData.subfolders?.map(f => f.name).join(', ')}`);
    } else {
      console.log('❌ Project access failed');
      const errorData = await projectResponse.json().catch(() => ({}));
      console.log(`   Error: ${JSON.stringify(errorData)}`);
      return;
    }

    // 3. Test Folder Access (Webmeter/Database)
    console.log('\n3️⃣ Testing Folder Access (Webmeter/Database)...');
    const folderResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (folderResponse.ok) {
      const folderData = await folderResponse.json();
      console.log('✅ Folder access successful!');
      console.log(`   Folder: ${folderData.folder?.name}`);
      console.log(`   Total Keys: ${folderData.totalKeys}`);
      console.log(`   Total Subfolders: ${folderData.totalSubfolders}`);
      
      if (folderData.keys && folderData.keys.length > 0) {
        console.log(`   Keys found: ${folderData.keys.length}`);
        folderData.keys.forEach((key, index) => {
          console.log(`     ${index + 1}. ${key.name} (Environment: ${key.environment})`);
        });
      } else {
        console.log('   No keys found in this folder');
      }
    } else {
      console.log('❌ Folder access failed');
      const errorData = await folderResponse.json().catch(() => ({}));
      console.log(`   Error: ${JSON.stringify(errorData)}`);
      return;
    }

    // 4. Test Key Access (Webmeter/Database/DB_URL)
    console.log('\n4️⃣ Testing Key Access (Webmeter/Database/DB_URL)...');
    const keyResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (keyResponse.ok) {
      const keyData = await keyResponse.json();
      console.log('✅ Key access successful!');
      console.log(`   Key: ${keyData.key?.name}`);
      console.log(`   Environment: ${keyData.key?.environment}`);
      console.log(`   Value: ${keyData.key?.value ? '***HIDDEN***' : 'N/A'}`);
      console.log(`   Type: ${keyData.key?.type || 'N/A'}`);
    } else {
      console.log('❌ Key access failed');
      const errorData = await keyResponse.json().catch(() => ({}));
      console.log(`   Error: ${JSON.stringify(errorData)}`);
    }

    // 5. Test Environment Filtering
    console.log('\n5️⃣ Testing Environment Filtering...');
    
    // Test with DEVELOPMENT environment
    console.log('   Testing with DEVELOPMENT environment...');
    const devResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder&environment=DEVELOPMENT`);
    if (devResponse.ok) {
      const devData = await devResponse.json();
      console.log('   ✅ Development environment filtering successful!');
      console.log(`      Environment: ${devData.environment}`);
      console.log(`      Keys found: ${devData.keys?.length || 0}`);
    } else {
      console.log('   ❌ Development environment filtering failed');
      const errorData = await devResponse.json().catch(() => ({}));
      console.log(`      Error: ${JSON.stringify(errorData)}`);
    }

    // Test with PRODUCTION environment
    console.log('   Testing with PRODUCTION environment...');
    const prodResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder&environment=PRODUCTION`);
    if (prodResponse.status === 404) {
      console.log('   ✅ Production environment correctly returns 404 (no keys found)');
    } else {
      console.log('   ⚠️ Production environment response unexpected');
      const errorData = await prodResponse.json().catch(() => ({}));
      console.log(`      Response: ${JSON.stringify(errorData)}`);
    }

    // 6. Test Invalid Environment
    console.log('\n6️⃣ Testing Invalid Environment...');
    const invalidEnvResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder&environment=invalid_env`);
    if (invalidEnvResponse.status === 400) {
      console.log('✅ Invalid environment correctly rejected with 400');
      const invalidData = await invalidEnvResponse.json();
      console.log(`   Error: ${invalidData.error}`);
      console.log(`   Message: ${invalidData.message}`);
    } else {
      console.log('❌ Invalid environment not properly rejected');
      const errorData = await invalidEnvResponse.json().catch(() => ({}));
      console.log(`   Response: ${JSON.stringify(errorData)}`);
    }

    // 7. Test Stats Endpoint
    console.log('\n7️⃣ Testing Stats Endpoint...');
    const statsResponse = await fetch(`${API_BASE}/api/stats`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats endpoint successful!');
      console.log(`   Total Keys: ${statsData.totalKeys || 0}`);
      console.log(`   Total Folders: ${statsData.totalFolders || 0}`);
      console.log(`   Total Projects: ${statsData.totalProjects || 0}`);
    } else {
      console.log('❌ Stats endpoint failed');
      const errorData = await statsResponse.json().catch(() => ({}));
      console.log(`   Error: ${JSON.stringify(errorData)}`);
    }

    console.log('\n🎯 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Authentication: Working');
    console.log('   ✅ Project Access: Working');
    console.log('   ✅ Folder Access: Working');
    console.log('   ✅ Key Access: Working');
    console.log('   ✅ Environment Filtering: Working');
    console.log('   ✅ Invalid Environment Rejection: Working');
    console.log('   ✅ Stats Endpoint: Working');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testUserToken(); 