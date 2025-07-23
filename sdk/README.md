# Key Vault SDK

A secure JavaScript SDK for accessing secrets from the Key Vault API. This SDK provides a simple interface for retrieving encrypted secrets programmatically.

## Installation

```bash
npm install key-vault-sdk
```

## Quick Start

### Step 1: Get Your API Token
1. Login to your Key Vault application
2. Go to the "API" page
3. Copy your API token (starts with `tok_`)

### Step 2: Install and Initialize
```javascript
import KeyVault from 'key-vault-sdk';

// Initialize the SDK
const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'tok_your-api-token-here'
});
```

### Step 3: Retrieve Secrets
```javascript
// Get a specific secret value by name
const secretValue = await kv.getKeyValue('your-folder-id', 'database-password');
console.log('Secret retrieved successfully');

// Or get all keys in a folder
const { keys } = await kv.listKeys({ folderId: 'your-folder-id' });
console.log('Available keys:', keys.map(k => k.name));
```

## Configuration

### API Token
Get your API token from the Key Vault web application:
1. Log in to your Key Vault account
2. Navigate to the `/api` page
3. Copy your API token

### Base URL
Set the `apiUrl` to your Key Vault instance:
- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## API Reference

### Constructor
```javascript
new KeyVault({
  apiUrl: string,           // Base URL of your Key Vault API
  getToken: () => string    // Function that returns your API token
})
```

### Methods

#### `listKeys({ folderId })`
List all keys in a folder (returns metadata only, not values).

```javascript
const { keys } = await kv.listKeys({ folderId: 'folder-id' });
console.log(keys);
// [
//   { id: 'key-1', name: 'Database Password', type: 'PASSWORD', ... },
//   { id: 'key-2', name: 'API Key', type: 'API_KEY', ... }
// ]
```

#### `getKey(keyId, { includeValue })`
Get a specific key by ID.

```javascript
// Get key metadata only
const key = await kv.getKey('key-id');

// Get key with decrypted value
const keyWithValue = await kv.getKey('key-id', { includeValue: true });
console.log(keyWithValue.value); // The actual secret value
```

#### `getKeyValue(folderId, keyName)`
Get a specific key's value by name (convenience method).

```javascript
const secretValue = await kv.getKeyValue('folder-id', 'database-password');
// Returns the decrypted value directly
```

## Usage Examples

### Basic Secret Retrieval
```javascript
import KeyVault from 'key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => process.env.KEY_VAULT_TOKEN
});

// Get database password
const dbPassword = await kv.getKeyValue('prod-folder', 'database-password');

// Use the secret (never log it!)
connectToDatabase(dbPassword);
```

### Get Database URL from Key Vault
```javascript
async function getDatabaseUrl() {
  try {
    // First, list keys to find the one you want
    const { keys } = await kv.listKeys({ folderId: 'your-folder-id' });
    
    // Find the key by name
    const dbUrlKey = keys.find(key => key.name === 'DB_URL');
    
    if (dbUrlKey) {
      // Get the actual value
      const keyWithValue = await kv.getKey(dbUrlKey.id, { includeValue: true });
      console.log('Database URL retrieved successfully');
      return keyWithValue.value;
    } else {
      throw new Error('DB_URL key not found');
    }
  } catch (error) {
    console.error('Error fetching database URL:', error);
    throw error;
  }
}

// Use it
const databaseUrl = await getDatabaseUrl();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: databaseUrl });
```

### Environment-Specific Secrets
```javascript
const environment = process.env.NODE_ENV || 'development';
const folderId = environment === 'production' ? 'prod-folder' : 'dev-folder';

const secrets = {
  database: await kv.getKeyValue(folderId, 'database-url'),
  apiKey: await kv.getKeyValue(folderId, 'external-api-key'),
  jwtSecret: await kv.getKeyValue(folderId, 'jwt-secret')
};
```

### List and Process Multiple Keys
```javascript
// Get all keys in a folder
const { keys } = await kv.listKeys({ folderId: 'config-folder' });

// Process each key
for (const key of keys) {
  if (key.type === 'API_KEY') {
    const value = await kv.getKey(key.id, { includeValue: true });
    console.log(`Setting up ${key.name}...`);
    // Use the secret value
  }
}
```

### Error Handling
```javascript
try {
  const secret = await kv.getKeyValue('folder-id', 'secret-name');
  // Use secret
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Secret not found');
  } else if (error.message.includes('Unauthorized')) {
    console.error('Invalid API token');
  } else {
    console.error('Failed to retrieve secret:', error.message);
  }
}
```

## Security Best Practices

### Never Log Secrets
```javascript
// ❌ Wrong - never log secret values
const secret = await kv.getKeyValue('folder', 'password');
console.log('Password:', secret);

// ✅ Correct - only log success/failure
const secret = await kv.getKeyValue('folder', 'password');
console.log('Password retrieved successfully');
```

### Use Environment Variables
```javascript
// Store API token in environment variables
const kv = new KeyVault({
  apiUrl: process.env.KEY_VAULT_API_URL,
  getToken: async () => process.env.KEY_VAULT_TOKEN
});
```

### Handle Errors Gracefully
```javascript
const getSecret = async (folderId, keyName) => {
  try {
    return await kv.getKeyValue(folderId, keyName);
  } catch (error) {
    console.error(`Failed to get secret ${keyName}:`, error.message);
    // Return fallback or throw based on your needs
    throw error;
  }
};
```

## Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `Unauthorized` | Invalid or missing API token | Check your API token |
| `Key not found` | Key doesn't exist in folder | Verify key name and folder ID |
| `Folder not found` | Folder doesn't exist | Check folder ID |
| `Network error` | Connection issues | Check API URL and network |

## Direct API Usage (Alternative to SDK)

If you prefer to use direct API calls instead of the SDK:

### Get Database URL via Direct API
```javascript
import fetch from 'node-fetch';

const BASE_URL = 'https://yourdomain.com';
const API_TOKEN = 'tok_your-api-token-here';

async function getDatabaseUrl() {
  try {
    // 1. List folders to get folder ID
    const foldersResponse = await fetch(`${BASE_URL}/api/folders`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const foldersData = await foldersResponse.json();
    const folderId = foldersData.folders[0].id;
    
    // 2. List keys in the folder
    const keysResponse = await fetch(`${BASE_URL}/api/keys?folderId=${folderId}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const keysData = await keysResponse.json();
    
    // 3. Find the DB_URL key
    const dbUrlKey = keysData.keys.find(key => key.name === 'DB_URL');
    
    if (dbUrlKey) {
      // 4. Get the actual value
      const keyValueResponse = await fetch(`${BASE_URL}/api/keys/${dbUrlKey.id}?includeValue=true`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      const keyValueData = await keyValueResponse.json();
      console.log('Database URL retrieved successfully');
      return keyValueData.key.value;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Use it
const databaseUrl = await getDatabaseUrl();
```

### API Endpoints Reference
- `GET /api/folders` - List all folders
- `GET /api/keys?folderId={id}` - List keys in a folder
- `GET /api/keys/{keyId}?includeValue=true` - Get key with value
- `POST /api/keys` - Create a new key
- `PUT /api/keys/{keyId}` - Update a key
- `DELETE /api/keys/{keyId}` - Delete a key

## Browser Usage

The SDK works in both Node.js and browser environments:

```javascript
// Browser
import KeyVault from 'key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => localStorage.getItem('key-vault-token')
});
```

## TypeScript Support

The SDK includes TypeScript definitions:

```typescript
import KeyVault from 'key-vault-sdk';

interface KeyVaultConfig {
  apiUrl: string;
  getToken: () => Promise<string> | string;
}

const kv: KeyVault = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'your-token'
});
```

## License

MIT License - see LICENSE file for details. 