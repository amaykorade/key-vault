import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const apiToken = 'tok_user-1755114408989-8k4l6dqkn_8bp5gwz0bwh'; // User's new regenerated token

async function testNewToken() {
  console.log('🔑 Testing your newly regenerated token...\n');

  try {
    // Test 1: Verify authentication with your new token
    console.log('1️⃣ Testing authentication with your new token...');
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

    // Test 2: Fetch your DB_URL key from Webmeter -> Database -> DB_URL (Development)
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
      console.log(`   Folder: ${keyData.key.folderId}`);
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

    // Test 5: Test project access
    console.log('\n5️⃣ Testing project access: Webmeter...');
    const projectResponse = await fetch(`${API_BASE}/api/access?path=Webmeter&type=project`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${projectResponse.status}`);
    
    if (projectResponse.ok) {
      const projectData = await projectResponse.json();
      console.log('✅ Project access successful!');
      console.log(`   Project: ${projectData.project.name}`);
      console.log(`   Folders: ${projectData.project.folders?.length || 0} folders`);
      console.log(`   Keys: ${projectData.project.keys?.length || 0} keys`);
    } else {
      const error = await projectResponse.text();
      console.log('❌ Project access failed');
      console.log('   Error:', error);
    }

    console.log('\n🎯 Testing complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testNewToken(); 