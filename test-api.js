// Test file to fetch DB_URL using direct API calls
import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'https://key-vault-five.vercel.app';
const API_TOKEN = 'tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar'; // Replace with your actual API token

// Test function to get DB_URL
async function testGetDBUrl() {
  try {
    console.log('🔍 Testing API connection...');
    
    // First, let's get user info to see if API token works
    console.log('👤 Getting user info...');
    const userResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`User API failed: ${userResponse.status} ${userResponse.statusText}`);
    }
    
    const userData = await userResponse.json();
    console.log('✅ User info:', userData);
    
    // Now let's list folders to get folder ID
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
    console.log('✅ Folders:', foldersData);
    
    // If we have folders, let's list keys in the first folder
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
      console.log('✅ Keys:', keysData);
      
      // If we have keys, try to get the DB_URL key
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
          console.log('✅ DB_URL value:', keyValueData.key.value);
        } else {
          console.log('❌ DB_URL key not found in this folder');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testGetDBUrl(); 