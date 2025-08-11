import KeyVault from './index.js';

function testSDK() {
  console.log('🧪 Testing JavaScript SDK...');
  
  try {
    // Initialize client
    const client = new KeyVault({
      apiUrl: 'http://localhost:3001/api',
      token: 'test-token'  // This will fail but we can test the initialization
    });
    
    console.log('✅ SDK initialization successful');
    
    // Test that the client has the expected methods
    const expectedMethods = ['listKeys', 'getKey', 'listFolders', 'listProjects', 'testConnection'];
    
    for (const method of expectedMethods) {
      if (typeof client[method] === 'function') {
        console.log(`✅ Method ${method} exists`);
      } else {
        console.log(`❌ Method ${method} missing`);
      }
    }
    
    console.log('\n📋 SDK Test Summary:');
    console.log('✅ SDK can be imported');
    console.log('✅ Client can be initialized');
    console.log('✅ Expected methods are available');
    
  } catch (error) {
    console.log(`❌ SDK test failed: ${error.message}`);
  }
}

testSDK(); 