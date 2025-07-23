// Fixed API test that works with API tokens
import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'https://key-vault-five.vercel.app';
const API_TOKEN = 'tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar';

// Test function to get DB_URL using API token
async function testGetDBUrlWithApiToken() {
  try {
    console.log('🔍 Testing API connection with API token...');
    
    // Test 1: List folders (this should work with API tokens)
    console.log('📁 Listing folders...');
    const foldersResponse = await fetch(`${BASE_URL}/api/folders`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!foldersResponse.ok) {
      throw new Error(`Folders API failed: ${foldersResponse.status} ${foldersResponse.statusText}`);
    }
    
    const foldersData = await foldersResponse.json();
    console.log('✅ Folders API works:', foldersData);
    
    // Test 2: If we have folders, list keys in the first folder
    if (foldersData.folders && foldersData.folders.length > 0) {
      const firstFolder = foldersData.folders[0];
      console.log(`🔑 Listing keys in folder: ${firstFolder.name} (${firstFolder.id})`);
      
      const keysResponse = await fetch(`${BASE_URL}/api/keys?folderId=${firstFolder.id}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!keysResponse.ok) {
        throw new Error(`Keys API failed: ${keysResponse.status} ${keysResponse.statusText}`);
      }
      
      const keysData = await keysResponse.json();
      console.log('✅ Keys API works:', keysData);
      
      // Test 3: If we have keys, try to get the DB_URL key value
      if (keysData.keys && keysData.keys.length > 0) {
        const dbUrlKey = keysData.keys.find(key => key.name === 'DB_URL');
        if (dbUrlKey) {
          console.log(`🔍 Found DB_URL key: ${dbUrlKey.id}`);
          
          // Get the actual value
          const keyValueResponse = await fetch(`${BASE_URL}/api/keys/${dbUrlKey.id}?includeValue=true`, {
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!keyValueResponse.ok) {
            throw new Error(`Key value API failed: ${keyValueResponse.status} ${keyValueResponse.statusText}`);
          }
          
          const keyValueData = await keyValueResponse.json();
          console.log('✅ DB_URL value retrieved:', keyValueData.key.value);
        } else {
          console.log('❌ DB_URL key not found in this folder');
          console.log('Available keys:', keysData.keys.map(k => k.name));
        }
      }
    }
    
    // Test 4: Try to create a test key (this should work with API tokens)
    console.log('🧪 Testing key creation...');
    const testKeyData = {
      folderId: foldersData.folders[0].id,
      name: 'TEST_KEY_' + Date.now(),
      description: 'Test key created via API',
      value: 'test-value-' + Date.now(),
      type: 'API_KEY',
      tags: ['test', 'api'],
      isFavorite: false
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testKeyData)
    });
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Key creation works:', createData);
      
      // Clean up: delete the test key
      const deleteResponse = await fetch(`${BASE_URL}/api/keys/${createData.key.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Key deletion works');
      } else {
        console.log('⚠️ Key deletion failed:', deleteResponse.status);
      }
    } else {
      console.log('⚠️ Key creation failed:', createResponse.status, createResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testGetDBUrlWithApiToken(); 