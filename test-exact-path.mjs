import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const apiToken = 'tok_rctyg4wv1nq_577g0l6oup';

async function testExactPath() {
  console.log('🔑 Testing exact path for DB_URL key...\n');

  try {
    // Test 1: Test the exact path Webmeter/Database/DB_URL with DEVELOPMENT environment
    console.log('1️⃣ Testing exact path: Webmeter/Database/DB_URL (DEVELOPMENT)...');
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

    // Test 2: Test without environment (should default to production)
    console.log('\n2️⃣ Testing without environment parameter...');
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

    // Test 3: Test with production environment (should not find the key)
    console.log('\n3️⃣ Testing with production environment...');
    const prodResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=production`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${prodResponse.status}`);
    
    if (prodResponse.ok) {
      const keyData = await prodResponse.json();
      console.log('⚠️ Found key in production (unexpected):', keyData.key?.name);
    } else {
      const error = await prodResponse.text();
      console.log('✅ Correctly no key found in production');
      console.log('   Response:', error);
    }

    // Test 4: Test folder access
    console.log('\n4️⃣ Testing folder access: Webmeter/Database...');
    const folderResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${folderResponse.status}`);
    
    if (folderResponse.ok) {
      const folderData = await folderResponse.json();
      console.log('✅ Folder access successful!');
      console.log(`   Folder: ${folderData.folder.name}`);
      console.log(`   Keys: ${folderData.folder.keys?.length || 0} keys`);
      console.log(`   Subfolders: ${folderData.folder.subfolders?.length || 0} subfolders`);
    } else {
      const error = await folderResponse.text();
      console.log('❌ Folder access failed');
      console.log('   Error:', error);
    }

    console.log('\n🎯 Testing complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testExactPath(); 