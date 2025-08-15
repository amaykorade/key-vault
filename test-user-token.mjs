import fetch from 'node-fetch';

const API_BASE = 'https://apivault.it.com';
const apiToken = 'tok_user-1755114408989-8k4l6dqkn_tddscy1am4';

async function testAPI() {
  console.log('🔑 Testing API Token and Key Access...\n');

  try {
    // Test 1: Verify authentication
    console.log('1️⃣ Testing authentication...');
    const authResponse = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (authResponse.ok) {
      const userData = await authResponse.json();
      console.log('✅ Authentication successful!');
      console.log(`   User: ${userData.user.email}`);
      console.log(`   Role: ${userData.user.role}`);
      console.log(`   Permissions: ${userData.user.permissions?.length || 0} permissions`);
    } else {
      console.log('❌ Authentication failed:', authResponse.status);
      const error = await authResponse.text();
      console.log('   Error:', error);
      return;
    }

    // Test 2: Fetch the specific key DB_URL from Webmeter -> Database -> DB_URL
    console.log('\n2️⃣ Fetching DB_URL key from Webmeter -> Database -> DB_URL...');
    const keyResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database/DB_URL&environment=production`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (keyResponse.ok) {
      const keyData = await keyResponse.json();
      console.log('✅ Key fetched successfully!');
      console.log(`   Key Name: ${keyData.key.name}`);
      console.log(`   Environment: ${keyData.key.environment}`);
      console.log(`   Value: ${keyData.key.value ? '***HIDDEN***' : 'No value'}`);
      console.log(`   Created: ${keyData.key.createdAt}`);
    } else {
      console.log('❌ Key fetch failed:', keyResponse.status);
      const error = await keyResponse.text();
      console.log('   Error:', error);
    }

    // Test 3: Test folder access
    console.log('\n3️⃣ Testing folder access...');
    const folderResponse = await fetch(`${API_BASE}/api/access?path=Webmeter/Database&type=folder`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (folderResponse.ok) {
      const folderData = await folderResponse.json();
      console.log('✅ Folder access successful!');
      console.log(`   Folder: ${folderData.folder.name}`);
      console.log(`   Type: ${folderData.folder.type}`);
      console.log(`   Keys: ${folderData.folder.keys?.length || 0} keys`);
      console.log(`   Subfolders: ${folderData.folder.subfolders?.length || 0} subfolders`);
    } else {
      console.log('❌ Folder access failed:', folderResponse.status);
      const error = await folderResponse.text();
      console.log('   Error:', error);
    }

    // Test 4: Test project access
    console.log('\n4️⃣ Testing project access...');
    const projectResponse = await fetch(`${API_BASE}/api/access?path=Webmeter&type=project`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (projectResponse.ok) {
      const projectData = await projectResponse.json();
      console.log('✅ Project access successful!');
      console.log(`   Project: ${projectData.project.name}`);
      console.log(`   Type: ${projectData.project.type}`);
      console.log(`   Folders: ${projectData.project.folders?.length || 0} folders`);
      console.log(`   Keys: ${projectData.project.keys?.length || 0} keys`);
    } else {
      console.log('❌ Project access failed:', projectResponse.status);
      const error = await projectResponse.text();
      console.log('   Error:', error);
    }

    console.log('\n🎯 Testing complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testAPI(); 