# Key Vault SDK

A JavaScript SDK for securely accessing your Key Vault API keys and values. Supports both ES Modules and CommonJS.

## Installation

```bash
npm install key-vault-sdk
```

## Usage

### ES Modules (Recommended)

```javascript
import KeyVault from 'key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://your-app.vercel.app/api',
  getToken: () => 'your-api-token',
  onAuthError: () => console.log('Token expired')
});

async function getKey(keyName, folderId) {
  const { keys } = await kv.listKeys({ folderId, limit: 100 });
  const key = keys.find(k => k.name === keyName);
  const keyWithValue = await kv.getKey(key.id, { includeValue: true });
  return keyWithValue.value;
}

// Usage
const apiKey = await getKey('key-name', 'folder-id');
```

### CommonJS

```javascript
const KeyVault = require('key-vault-sdk');

const kv = new KeyVault({
  apiUrl: 'https://your-app.vercel.app/api',
  getToken: () => 'your-api-token',
  onAuthError: () => console.log('Token expired')
});

async function getKey(keyName, folderId) {
  const { keys } = await kv.listKeys({ folderId, limit: 100 });
  const key = keys.find(k => k.name === keyName);
  const keyWithValue = await kv.getKey(key.id, { includeValue: true });
  return keyWithValue.value;
}

// Usage
const apiKey = await getKey('key-name', 'folder-id');
```

## API Reference

### Constructor

```javascript
new KeyVault({
  apiUrl: string,           // Base URL of your Key Vault API
  getToken: () => string,   // Function that returns your API token
  onAuthError?: () => void  // Optional callback for auth errors
})
```

### Methods

#### `listKeys({ folderId, limit?, offset? })`

List all keys in a folder.

```javascript
const { keys, total, limit, offset } = await kv.listKeys({
  folderId: 'your-folder-id',
  limit: 100,    // Optional, default: 20
  offset: 0      // Optional, default: 0
});
```

#### `getKey(keyId, { includeValue? })`

Get a specific key by ID.

```javascript
const key = await kv.getKey('key-id', {
  includeValue: true  // Optional, default: false
});
```

## Examples

### Get Multiple Keys

```javascript
async function getKeys(keyNames, folderId) {
  const { keys } = await kv.listKeys({ folderId, limit: 100 });
  const results = {};
  
  for (const keyName of keyNames) {
    const key = keys.find(k => k.name === keyName);
    if (key) {
      const keyWithValue = await kv.getKey(key.id, { includeValue: true });
      results[keyName] = keyWithValue.value;
    }
  }
  
  return results;
}

const keys = await getKeys(['stripe-key', 'openai-key'], 'folder-id');
```

### Environment Variables

```javascript
import KeyVault from 'key-vault-sdk';

const kv = new KeyVault({
  apiUrl: process.env.KEY_VAULT_API_URL,
  getToken: () => process.env.KEY_VAULT_TOKEN,
  onAuthError: () => console.log('Token expired')
});
```

## Error Handling

The SDK automatically handles:
- Token refresh on 401 errors
- Network retries
- JSON parsing errors

```javascript
try {
  const value = await getKey('important-key', 'folder-id');
  console.log('Key value:', value);
} catch (error) {
  console.error('Failed to get key:', error.message);
}
```

## Building

To build the SDK locally:

```bash
cd sdk
npm install
npm run build
```

This creates both `dist/index.mjs` (ES modules) and `dist/index.cjs` (CommonJS) versions. 