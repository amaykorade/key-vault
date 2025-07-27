import KeyVault from './sdk/dist/index.mjs';

// Configuration - replace with your actual values
const config = {
  apiUrl: 'https://key-vault-psi-eight.vercel.app/api',
  token: 'your-api-token-here', // Replace with actual token
  folderId: 'your-folder-id-here' // Replace with actual folder ID
};

const kv = new KeyVault({
  apiUrl: config.apiUrl,
  getToken: () => config.token,
  onAuthError: () => console.log('Token expired')
});

async function getKey(keyName, folderId) {
  try {
    console.log(`🔍 Looking for key "${keyName}" in folder "${folderId}"...`);
    
    const { keys } = await kv.listKeys({ folderId, limit: 100 });
    console.log(`📋 Found ${keys.length} keys in folder`);
    
    const key = keys.find(k => k.name === keyName);
    if (!key) {
      throw new Error(`Key "${keyName}" not found in folder`);
    }
    
    console.log(`✅ Found key "${keyName}" with ID: ${key.id}`);
    const keyWithValue = await kv.getKey(key.id, { includeValue: true });
    return keyWithValue.value;
  } catch (error) {
    throw new Error(`Failed to get key "${keyName}": ${error.message}`);
  }
}

// Test the function
async function test() {
  try {
    console.log('🚀 Testing ES Module SDK...');
    console.log('📡 API URL:', config.apiUrl);
    console.log('🔑 Token:', config.token.substring(0, 20) + '...');
    console.log('📁 Folder ID:', config.folderId);
    
    // Test with a key name that exists in your folder
    const apiKey = await getKey('test-key', config.folderId);
    console.log('✅ Success! Key value:', apiKey);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test(); 