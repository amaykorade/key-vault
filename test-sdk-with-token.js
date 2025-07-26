import KeyVault from './sdk/index.js';

// Production API configuration
const folderId = 'cmdflk67d000gjr04b492q3ha'
const config = {
  apiUrl: 'https://key-vault-five.vercel.app/api',
  token: 'tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar'
};

// Function to test SDK with your provided token and folderId
async function testSDKWithToken(token, folderId) {
  console.log('🚀 Testing KeyVault SDK with provided token...\n');
  
  // Set the token
  config.token = token;
  
  // Initialize SDK
  const kv = new KeyVault({
    apiUrl: config.apiUrl,
    getToken: () => config.token,
    onAuthError: async () => {
      console.log('❌ Token expired or invalid');
    }
  });

  try {
    // Test 1: List keys in the specified folder
    console.log('1. Testing listKeys method...');
    console.log(`📁 Folder ID: ${folderId}`);
    
    const { keys, total } = await kv.listKeys({
      folderId: folderId,
      limit: 10
    });
    
    console.log(`✅ Success! Found ${total} keys in the folder`);
    
    if (keys.length > 0) {
      console.log('\n📋 Keys in your folder:');
      keys.forEach((key, index) => {
        console.log(`  ${index + 1}. ${key.name} (${key.type}) - ID: ${key.id}`);
      });

      // Test 2: Get details of the first key (without value)
      console.log('\n2. Testing getKey method (without value)...');
      const firstKey = keys[0];
      const keyDetails = await kv.getKey(firstKey.id);
      
      console.log('✅ Key details retrieved:');
      console.log(`   Name: ${keyDetails.name}`);
      console.log(`   Type: ${keyDetails.type}`);
      console.log(`   Description: ${keyDetails.description || 'No description'}`);
      console.log(`   Created: ${keyDetails.createdAt}`);
      console.log(`   Has value: ${Boolean(keyDetails.value)}`);

      // Test 3: Get the same key with decrypted value
      console.log('\n3. Testing getKey method (with decrypted value)...');
      const keyWithValue = await kv.getKey(firstKey.id, { includeValue: true });
      
      console.log('✅ Key with value retrieved:');
      console.log(`   Name: ${keyWithValue.name}`);
      console.log(`   Type: ${keyWithValue.type}`);
      console.log(`   Value: ${keyWithValue.value || 'No value'}`);
      console.log(`   Value length: ${keyWithValue.value ? keyWithValue.value.length : 0} characters`);

      // Test 4: Test pagination
      console.log('\n4. Testing pagination...');
      const { keys: paginatedKeys, total: totalKeys } = await kv.listKeys({
        folderId: folderId,
        limit: 5,
        offset: 0
      });
      
      console.log(`✅ Pagination test: Showing ${paginatedKeys.length} of ${totalKeys} keys`);

    } else {
      console.log('ℹ️ No keys found in the specified folder');
    }

    console.log('\n🎉 SDK test completed successfully!');
    console.log('\nSummary:');
    console.log('✅ Authentication working');
    console.log('✅ API connectivity working');
    console.log('✅ SDK methods working');
    console.log(`✅ Found ${total} keys in folder ${folderId}`);

  } catch (error) {
    console.error('❌ SDK test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n💡 Troubleshooting:');
      console.log('- Check if the token is valid and not expired');
      console.log('- Verify the token has access to the specified folder');
      console.log('- Make sure the folderId is correct');
    } else if (error.message.includes('404')) {
      console.log('\n💡 Troubleshooting:');
      console.log('- Check if the folderId exists');
      console.log('- Verify the token has access to this folder');
    }
  }
}

// Function to test with multiple folders
async function testMultipleFolders(token, folderIds) {
  console.log('🔍 Testing multiple folders...\n');
  
  config.token = token;
  
  const kv = new KeyVault({
    apiUrl: config.apiUrl,
    getToken: () => config.token,
    onAuthError: async () => {
      console.log('❌ Token expired or invalid');
    }
  });

  for (const folderId of folderIds) {
    try {
      console.log(`📁 Testing folder: ${folderId}`);
      const { keys, total } = await kv.listKeys({
        folderId: folderId,
        limit: 5
      });
      
      console.log(`   ✅ Found ${total} keys`);
      if (keys.length > 0) {
        console.log(`   📋 Sample: ${keys[0].name} (${keys[0].type})`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }
}

// Simple function to get a key by name (easier usage)
async function getKeyByName(token, folderId, keyName) {
  const kv = new KeyVault({
    apiUrl: config.apiUrl,
    getToken: () => token,
    onAuthError: async () => {
      console.log('❌ Token expired or invalid');
    }
  });

  try {
    // First get all keys in the folder
    const { keys } = await kv.listKeys({ folderId, limit: 100 });
    
    // Find the key by name
    const key = keys.find(k => k.name === keyName);
    if (!key) {
      throw new Error(`Key "${keyName}" not found in folder`);
    }

    // Get the key with decrypted value
    const keyWithValue = await kv.getKey(key.id, { includeValue: true });
    return keyWithValue.value;
  } catch (error) {
    throw new Error(`Failed to get key "${keyName}": ${error.message}`);
  }
}

// Export functions for use
export { testSDKWithToken, testMultipleFolders, getKeyByName };

// Run the test with the provided credentials
console.log('🚀 Running SDK test with provided credentials...\n');
testSDKWithToken(config.token, folderId).catch(console.error);

// Also test the simple getKeyByName function
console.log('\n🔧 Testing simple getKeyByName function...\n');
getKeyByName(config.token, folderId, 'test')
  .then(value => {
    console.log('✅ Simple function test:');
    console.log(`   Key "test" value: ${value}`);
  })
  .catch(error => {
    console.log('❌ Simple function error:', error.message);
  }); 