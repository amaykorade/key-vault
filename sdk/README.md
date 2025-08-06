# Key Vault JavaScript SDK

A JavaScript SDK for securely accessing your Key Vault API keys and secrets. Supports Node.js, ESM, and CommonJS.

## Installation

```bash
npm install amay-key-vault-sdk
```

## Quick Start

```javascript
import KeyVault from 'amay-key-vault-sdk';

// Initialize the SDK
const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'your-api-token',
  onAuthError: async () => {
    // Handle token refresh here
    console.log('Token expired, refreshing...');
  }
});

// Get a key by name
const apiKey = await kv.getKeyByName('folder-id', 'stripe-secret-key');
console.log('API Key:', apiKey);

// List all keys in a folder
const result = await kv.listKeys({ folderId: 'folder-id', limit: 50 });
console.log(`Found ${result.keys.length} keys`);
```

## Features

- 🔐 **Secure Access**: All keys are encrypted and securely transmitted
- 📁 **Folder Support**: Organize keys in hierarchical folders
- 🔍 **Search & Filter**: Find keys by name, type, or tags
- 📊 **Statistics**: Get usage statistics and folder information
- 🔄 **Auto Refresh**: Automatic token refresh handling
- 🛡️ **Error Handling**: Comprehensive error handling
- 📦 **Multiple Formats**: ESM and CommonJS support

## API Reference

### Constructor

```javascript
const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'your-api-token',
  onAuthError: async () => {
    // Optional: handle token refresh
  }
});
```

**Parameters:**
- `apiUrl` (string): Base URL of your Key Vault API
- `getToken` (function): Async function that returns the latest JWT token
- `onAuthError` (function, optional): Async function called on 401 errors

### Key Operations

#### List Keys
```javascript
// List keys in a folder with pagination
const result = await kv.listKeys({
  folderId: 'folder-id',
  limit: 20,  // Number of keys to return
  offset: 0   // Number of keys to skip
});

console.log(`Found ${result.total} keys`);
result.keys.forEach(key => {
  console.log(`- ${key.name} (${key.type})`);
});
```

#### Get Key by ID
```javascript
// Get key metadata only
const key = await kv.getKey('key-id');

// Get key with decrypted value
const keyWithValue = await kv.getKey('key-id', { includeValue: true });
console.log(`Key: ${keyWithValue.name}, Value: ${keyWithValue.value}`);
```

#### Get Key by Name
```javascript
// Get a key by name from a specific folder
const key = await kv.getKeyByName('folder-id', 'stripe-secret-key', { 
  includeValue: true 
});

if (key) {
  console.log(`Found key: ${key.name}`);
  console.log(`Value: ${key.value}`);
} else {
  console.log('Key not found');
}
```

### Folder Operations

#### List Folders
```javascript
// List all folders with hierarchical structure
const folders = await kv.listFolders();
console.log(`Found ${folders.folders.length} root folders`);

// List folders within a specific project
const projectFolders = await kv.listFolders({ projectId: 'project-id' });
```

#### List Projects
```javascript
// List only root folders (projects)
const projects = await kv.listProjects();
projects.folders.forEach(project => {
  console.log(`Project: ${project.name} (ID: ${project.id})`);
});
```

#### Get Folder Details
```javascript
// Get a specific folder with its contents
const folderData = await kv.getFolder('folder-id');
console.log(`Folder: ${folderData.folder.name}`);
console.log(`Contains ${folderData.keys.length} keys`);
```

### Search Operations

#### Search Keys
```javascript
// Search for keys across all folders
const results = await kv.searchKeys({
  search: 'database',
  type: 'PASSWORD',
  favorite: true,
  limit: 20
});

console.log(`Found ${results.keys.length} database passwords`);
```

### Utility Methods

#### Get Statistics
```javascript
// Get folder and key statistics
const stats = await kv.getStats();
console.log(`Total keys: ${stats.totalKeys}`);
console.log(`Total folders: ${stats.folders}`);
```

## Error Handling

The SDK throws standard JavaScript errors for different scenarios:

```javascript
try {
  const key = await kv.getKey('key-id');
} catch (error) {
  if (error.message.includes('401')) {
    console.log('Authentication failed - check your token');
  } else if (error.message.includes('404')) {
    console.log('Key not found');
  } else {
    console.log(`API error: ${error.message}`);
  }
}
```

## Examples

### Complete Example
```javascript
import KeyVault from 'amay-key-vault-sdk';

async function main() {
  // Initialize SDK
  const kv = new KeyVault({
    apiUrl: 'https://yourdomain.com/api',
    getToken: async () => 'your-api-token',
    onAuthError: async () => {
      console.log('Token expired, refreshing...');
      // Implement token refresh logic here
    }
  });
  
  try {
    // List projects
    const projects = await kv.listProjects();
    console.log(`Available projects: ${projects.folders.length}`);
    
    // Get keys from first project
    if (projects.folders.length > 0) {
      const projectId = projects.folders[0].id;
      const result = await kv.listKeys({ 
        folderId: projectId, 
        limit: 10 
      });
      
      console.log(`Keys in ${projects.folders[0].name}:`);
      for (const key of result.keys) {
        console.log(`- ${key.name} (${key.type})`);
        
        // Get key value if needed
        if (key.type === 'API_KEY') {
          const keyWithValue = await kv.getKey(key.id, { includeValue: true });
          console.log(`  Value: ${keyWithValue.value}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();
```

### Environment-Specific Configuration
```javascript
import KeyVault from 'amay-key-vault-sdk';

const environment = process.env.NODE_ENV || 'development';
const apiUrl = environment === 'production' 
  ? 'https://yourdomain.com/api'
  : 'http://localhost:3000/api';

const kv = new KeyVault({
  apiUrl,
  getToken: async () => process.env.KEY_VAULT_TOKEN,
  onAuthError: async () => {
    // Handle token refresh
  }
});
```

### Token Management
```javascript
import KeyVault from 'amay-key-vault-sdk';

class TokenManager {
  constructor() {
    this.token = null;
    this.refreshPromise = null;
  }
  
  async getToken() {
    if (!this.token) {
      await this.refreshToken();
    }
    return this.token;
  }
  
  async refreshToken() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    this.refreshPromise = this._doRefresh();
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }
  
  async _doRefresh() {
    // Implement your token refresh logic here
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    this.token = data.session.token;
  }
}

const tokenManager = new TokenManager();

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => tokenManager.getToken(),
  onAuthError: () => tokenManager.refreshToken()
});
```

## Development

### Local Testing
For local development, use the local server URL:

```javascript
const kv = new KeyVault({
  apiUrl: 'http://localhost:3000/api',
  getToken: async () => 'your-local-token'
});
```

### Running Tests
```bash
cd sdk
npm test
```

## Browser Usage

The SDK can also be used in browsers with proper CORS configuration:

```html
<script type="module">
  import KeyVault from 'https://unpkg.com/amay-key-vault-sdk@latest/dist/index.mjs';
  
  const kv = new KeyVault({
    apiUrl: 'https://yourdomain.com/api',
    getToken: async () => localStorage.getItem('api-token')
  });
  
  // Use the SDK
  const keys = await kv.listKeys({ folderId: 'folder-id' });
</script>
```

## License

MIT License - see LICENSE file for details.

## Support

- GitHub Issues: https://github.com/amaykorade/key-vault/issues
- Documentation: https://github.com/amaykorade/key-vault#readme 