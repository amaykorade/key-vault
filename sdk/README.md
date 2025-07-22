# Key Vault SDK

A secure JavaScript SDK for accessing secrets from the Key Vault API. This SDK provides a simple interface for retrieving encrypted secrets programmatically.

## Installation

```bash
npm install key-vault-sdk
```

## Quick Start

```javascript
import KeyVault from 'key-vault-sdk';

// Initialize the SDK
const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'your-api-token-here'
});

// Get a specific secret value by name
const secretValue = await kv.getKeyValue('your-folder-id', 'database-password');
console.log('Secret retrieved successfully');
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