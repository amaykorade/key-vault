// Test file to fetch DB_URL using the SDK
import KeyVault from './sdk/index.js';

// Configuration
const API_URL = 'https://key-vault-five.vercel.app/api';
const API_TOKEN = 'tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar'; // Replace with your actual API token

// Simple token getter function
const getToken = async () => {
  return API_TOKEN;
};

// Initialize the SDK
const kv = new KeyVault({
  apiUrl: API_URL,
  getToken: getToken
});

// Test function to get DB_URL
async function testGetDBUrl() {
  try {
    console.log('🔍 Testing SDK connection...');
    
    // First, let's list keys to see what's available
    console.log('📋 Listing keys...');
    const keys = await kv.listKeys({ folderId: 'cmdflk67d000gjr04b492q3ha' }); // Replace with actual folder ID
    console.log('Available keys:', keys);
    
    // Now try to get a specific key by name (DB_URL)
    console.log('🔑 Looking for DB_URL key...');
    
    // Find the DB_URL key from the list
    const dbUrlKey = keys.keys.find(key => key.name === 'DB_URL');
    
    if (dbUrlKey) {
      console.log(`🔍 Found DB_URL key with ID: ${dbUrlKey.id}`);
      
      // Get the actual value using getKey
      const keyWithValue = await kv.getKey(dbUrlKey.id, { includeValue: true });
      console.log('✅ DB_URL value:', keyWithValue.value);
    } else {
      console.log('❌ DB_URL key not found in this folder');
      console.log('Available keys:', keys.keys.map(k => k.name));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testGetDBUrl(); 