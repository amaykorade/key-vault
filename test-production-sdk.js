import KeyVault from './sdk/index.js';

// Production test configuration
const config = {
  apiUrl: 'https://key-vault-five.vercel.app/api',
  token: null,
  sessionCookie: null
};

// Test user credentials (you can modify these)
const testUser = {
  email: 'test@example.com',
  password: 'Password123'
};

async function login() {
  try {
    console.log('🔐 Attempting to login...');
    const res = await fetch(`${config.apiUrl.replace(/\/api$/, '')}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Login failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log('✅ Login response received');
    
    if (!data.session?.token) {
      throw new Error('No token received in response');
    }

    // Get the session cookie from response headers
    const cookies = res.headers.get('set-cookie');
    if (cookies) {
      const sessionCookie = cookies.split(';')[0];
      config.sessionCookie = sessionCookie;
      console.log('🍪 Session cookie captured');
    }

    return data.session.token;
  } catch (error) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
}

async function testSDK() {
  try {
    console.log('🚀 Starting KeyVault SDK Production Test...\n');
    
    // Step 1: Test API connectivity
    console.log('1. Testing API connectivity...');
    try {
      const healthCheck = await fetch(`${config.apiUrl.replace(/\/api$/, '')}/api`);
      if (healthCheck.ok) {
        console.log('✅ API is accessible');
      } else {
        console.log('⚠️ API responded but with status:', healthCheck.status);
      }
    } catch (error) {
      console.error('❌ API connectivity test failed:', error.message);
      return;
    }

    // Step 2: Login and get token
    console.log('\n2. Authenticating...');
    try {
      config.token = await login();
      console.log('✅ Authentication successful');
      console.log('🔑 Token received:', config.token.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure the database is properly migrated');
      console.log('2. Check if test user exists (run /api/seed if needed)');
      console.log('3. Verify environment variables are set correctly');
      return;
    }

    // Step 3: Initialize SDK
    console.log('\n3. Initializing SDK...');
    const kv = new KeyVault({
      apiUrl: config.apiUrl,
      getToken: () => config.token,
      onAuthError: async () => {
        console.log('🔄 Token expired, refreshing...');
        config.token = await login();
      }
    });

    // Step 4: Test folder listing (if you have a folderId)
    console.log('\n4. Testing folder access...');
    try {
      // First, let's try to get folders to see what's available
      const foldersRes = await fetch(`${config.apiUrl}/folders`, {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Cookie': config.sessionCookie || ''
        }
      });
      
      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        console.log('✅ Folders API accessible');
        
        if (foldersData.folders && foldersData.folders.length > 0) {
          const testFolderId = foldersData.folders[0].id;
          console.log(`📁 Using folder: ${testFolderId} (${foldersData.folders[0].name})`);
          
          // Test SDK listKeys method
          console.log('\n5. Testing SDK listKeys method...');
          const { keys, total } = await kv.listKeys({
            folderId: testFolderId,
            limit: 10
          });
          
          console.log(`✅ SDK listKeys successful - Found ${total} keys`);
          
          if (keys.length > 0) {
            console.log('\n📋 Sample keys:');
            keys.slice(0, 3).forEach(key => {
              console.log(`  - ${key.name} (${key.type}) - ID: ${key.id}`);
            });

            // Test SDK getKey method
            console.log('\n6. Testing SDK getKey method...');
            const testKeyId = keys[0].id;
            
            // Test without value
            const keyWithoutValue = await kv.getKey(testKeyId);
            console.log('✅ getKey (without value) successful:', {
              id: keyWithoutValue.id,
              name: keyWithoutValue.name,
              type: keyWithoutValue.type,
              hasValue: Boolean(keyWithoutValue.value)
            });

            // Test with value
            const keyWithValue = await kv.getKey(testKeyId, { includeValue: true });
            console.log('✅ getKey (with value) successful:', {
              id: keyWithValue.id,
              name: keyWithValue.name,
              type: keyWithValue.type,
              hasValue: Boolean(keyWithValue.value),
              valuePreview: keyWithValue.value ? '********' : 'No value'
            });
          } else {
            console.log('ℹ️ No keys found in the folder');
          }
        } else {
          console.log('ℹ️ No folders found. Creating a test folder...');
          
          // Create a test folder
          const createFolderRes = await fetch(`${config.apiUrl}/folders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.token}`,
              'Cookie': config.sessionCookie || ''
            },
            body: JSON.stringify({
              name: 'Test Folder',
              description: 'Test folder for SDK testing'
            })
          });
          
          if (createFolderRes.ok) {
            const folderData = await createFolderRes.json();
            console.log('✅ Test folder created:', folderData.folder.id);
          } else {
            console.log('⚠️ Could not create test folder');
          }
        }
      } else {
        console.log('⚠️ Folders API not accessible:', foldersRes.status);
      }
    } catch (error) {
      console.error('❌ SDK test failed:', error.message);
    }

    // Step 5: Test with provided token and folderId (if you want to test specific data)
    console.log('\n7. Ready for custom testing...');
    console.log('To test with your specific token and folderId, modify the config below:');
    console.log('config.token = "your-token-here"');
    console.log('const customFolderId = "your-folder-id-here"');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Function to test with custom credentials
async function testWithCustomCredentials(token, folderId) {
  console.log('\n🔧 Testing with custom credentials...');
  
  const kv = new KeyVault({
    apiUrl: config.apiUrl,
    getToken: () => token,
    onAuthError: async () => {
      console.log('🔄 Custom token expired');
    }
  });

  try {
    console.log('📋 Testing listKeys with custom folderId...');
    const { keys, total } = await kv.listKeys({
      folderId: folderId,
      limit: 5
    });
    
    console.log(`✅ Custom test successful - Found ${total} keys`);
    
    if (keys.length > 0) {
      console.log('\n📋 Keys in your folder:');
      keys.forEach(key => {
        console.log(`  - ${key.name} (${key.type}) - ID: ${key.id}`);
      });
      
      // Test getting a specific key
      const testKey = await kv.getKey(keys[0].id, { includeValue: true });
      console.log('\n✅ Key details retrieved successfully');
    }
    
  } catch (error) {
    console.error('❌ Custom test failed:', error.message);
  }
}

// Run the main test
testSDK().catch(console.error);

// Export for manual testing
export { testWithCustomCredentials }; 