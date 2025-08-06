# Quick Start Guide - Hierarchical Folder Structure

This guide will help you quickly get started with the Key Vault hierarchical folder structure using the API and SDKs.

## 🚀 Quick Setup

### 1. Get Your API Token

1. Login to your Key Vault application
2. Go to the "API" page
3. Copy your API token (starts with `tok_`)

### 2. Choose Your SDK

**JavaScript/TypeScript:**
```bash
npm install amay-key-vault-sdk
```

**Python:**
```bash
pip install amay-key-vault-sdk
```

## 📁 Basic Usage Examples

### JavaScript/TypeScript SDK

```javascript
import KeyVault from 'amay-key-vault-sdk';

// Initialize
const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => 'your-api-token-here'
});

// Get folder structure
const { folders } = await kv.listFolders({ projectId: 'your-project-id' });

// Get keys from a specific folder
const { keys } = await kv.listKeys({ folderId: 'folder-id' });

// Get a key by name
const dbUrl = await kv.getKeyByName('folder-id', 'DB_URL', { includeValue: true });
```

### Python SDK

```python
from key_vault_sdk import KeyVault

# Initialize
kv = KeyVault(
    api_url="https://yourdomain.com/api",
    token="your-api-token-here"
)

# Get folder structure
folders = kv.list_folders(project_id="your-project-id")

# Get keys from a specific folder
folder_data = kv.get_folder(folder_id="folder-id")
keys = folder_data['keys']

# Get a key by name
db_url = kv.get_key_by_name(folder_id="folder-id", key_name="DB_URL")
```

## 🔧 Common Use Cases

### 1. Environment-Based Configuration

```javascript
// Get database URLs for different environments
const { folders } = await kv.listFolders({ projectId: 'project-123' });
const project = folders[0];

// Find Database URLs folder
const dbFolder = project.children.find(f => f.name === 'Database URLs');

// Get production database URL
const prodFolder = dbFolder.children.find(f => f.name === 'Production DB');
const { keys } = await kv.listKeys({ folderId: prodFolder.id });
const dbUrl = await kv.getKeyByName(prodFolder.id, 'DB_URL', { includeValue: true });

console.log('Production DB URL:', dbUrl);
```

### 2. Service API Key Management

```python
# Get API keys for different services
folders = kv.list_folders(project_id="project-123")
project = folders['folders'][0]

# Find API Keys folder
api_folder = next(f for f in project['children'] if f['name'] == 'API Keys')

# Get Stripe API keys
stripe_folder = next(f for f in api_folder['children'] if 'Stripe' in f['name'])
stripe_keys = kv.get_folder(folder_id=stripe_folder['id'])

# Get specific keys
secret_key = kv.get_key_by_name(stripe_folder['id'], 'STRIPE_SECRET_KEY')
publishable_key = kv.get_key_by_name(stripe_folder['id'], 'STRIPE_PUBLISHABLE_KEY')

print(f"Stripe Secret Key: {secret_key}")
```

### 3. Bulk Configuration Loading

```javascript
// Load all configurations at once
async function loadAllConfigs(projectId) {
  const { folders } = await kv.listFolders({ projectId });
  const project = folders[0];
  
  const configs = {};
  
  // Load from each main folder
  for (const folder of project.children) {
    const { keys } = await kv.listKeys({ folderId: folder.id, limit: 100 });
    const folderConfig = {};
    
    for (const key of keys) {
      const keyWithValue = await kv.getKey(key.id, { includeValue: true });
      folderConfig[key.name] = keyWithValue.value;
    }
    
    configs[folder.name] = folderConfig;
  }
  
  return configs;
}

const allConfigs = await loadAllConfigs('project-123');
console.log('Loaded configs:', Object.keys(allConfigs));
```

## 🔍 Search and Navigation

### Search Keys Across All Folders

```javascript
// Search for database-related keys
const results = await kv.searchKeys({ 
  search: 'database', 
  type: 'PASSWORD' 
});

console.log('Found database keys:', results.keys.map(k => k.name));
```

### Navigate Folder Tree

```python
# Use the navigation helper
tree = kv.navigate_folder_tree(project_id="project-123")

# Find folder by name
db_folder = tree['find_folder_by_name']('Database URLs')
prod_folder = tree['find_folder_by_name']('Production DB')

# Get folder path
path = tree['get_folder_path'](prod_folder['id'])
print(f"Path to Production DB: {' > '.join([f['name'] for f in path])}")
```

## 📊 Get Statistics

```javascript
// Get project statistics
const stats = await kv.getStats();
console.log('Total keys:', stats.totalKeys);
console.log('Total folders:', stats.folders);
console.log('Keys by type:', stats.keysByType);
```

## 🛠️ Direct API Usage

If you prefer to use the API directly:

```bash
# Get folder tree
curl -H "Authorization: Bearer your-token" \
     https://yourdomain.com/api/folders/tree?projectId=project-123

# Get keys from a folder
curl -H "Authorization: Bearer your-token" \
     https://yourdomain.com/api/keys?folderId=folder-id

# Get a specific key with value
curl -H "Authorization: Bearer your-token" \
     https://yourdomain.com/api/keys/key-id?includeValue=true

# Search keys
curl -H "Authorization: Bearer your-token" \
     "https://yourdomain.com/api/keys?search=database&type=PASSWORD"
```

## 🏗️ Recommended Folder Structure

Here's a recommended structure for organizing your keys:

```
Your Project
├── Database URLs
│   ├── Production DB
│   ├── Staging DB
│   └── Development DB
├── API Keys
│   ├── Email Service
│   ├── SMS Gateway
│   ├── Analytics
│   └── Payment Gateways
├── Payment Keys
│   ├── Stripe Production
│   ├── Stripe Test
│   └── PayPal
├── SSH Keys
│   ├── Production Server
│   ├── Staging Server
│   └── Backup Server
└── Secrets
    ├── JWT Secrets
    ├── Encryption Keys
    └── OAuth Secrets
```

## 🔐 Security Best Practices

1. **Environment Separation**: Keep production, staging, and development keys separate
2. **Service Organization**: Group keys by service or functionality
3. **Consistent Naming**: Use clear, consistent naming conventions
4. **Access Control**: Use different API tokens for different environments
5. **Regular Rotation**: Regularly rotate sensitive keys

## 🚨 Error Handling

```javascript
try {
  const { folders } = await kv.listFolders({ projectId: 'project-123' });
} catch (error) {
  if (error.message.includes('Not authenticated')) {
    console.log('Please check your API token');
  } else if (error.message.includes('Project not found')) {
    console.log('Project does not exist');
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

```python
try:
    folders = kv.list_folders(project_id="project-123")
except KeyVaultAuthError:
    print("Please check your API token")
except KeyVaultNotFoundError:
    print("Project does not exist")
except KeyVaultError as e:
    print(f"Unexpected error: {e}")
```

## 📚 Next Steps

1. **Explore Examples**: Check out the comprehensive examples in `examples/` folder
2. **Read API Docs**: See `API_FOLDER_STRUCTURE.md` for detailed API documentation
3. **Try Different Patterns**: Experiment with different folder organization patterns
4. **Integrate**: Start integrating the SDK into your applications

## 🆘 Need Help?

- **Documentation**: Check the main README and API documentation
- **Examples**: Look at the example files for practical usage patterns
- **SDK Reference**: See the SDK documentation for all available methods
- **Support**: Contact support if you encounter issues

## 🎯 Quick Reference

### JavaScript SDK Methods
- `kv.listFolders({ projectId })` - Get folder tree
- `kv.listKeys({ folderId })` - Get keys from folder
- `kv.getKey(keyId, { includeValue })` - Get specific key
- `kv.getKeyByName(folderId, keyName)` - Get key by name
- `kv.searchKeys({ search, type, favorite })` - Search keys
- `kv.getStats()` - Get statistics

### Python SDK Methods
- `kv.list_folders(project_id)` - Get folder tree
- `kv.get_folder(folder_id)` - Get folder with contents
- `kv.list_keys(folder_id)` - Get keys from folder
- `kv.get_key(key_id, include_value)` - Get specific key
- `kv.get_key_by_name(folder_id, key_name)` - Get key by name
- `kv.search_keys(search, key_type, favorite)` - Search keys
- `kv.get_stats()` - Get statistics
- `kv.navigate_folder_tree(project_id)` - Navigation helpers

Happy organizing! 🎉 