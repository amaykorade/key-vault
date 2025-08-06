# Key Vault API - Hierarchical Folder Structure

This document describes how to use the Key Vault API to work with the hierarchical folder structure feature.

## Authentication

All API requests require authentication via Bearer token:

```http
Authorization: Bearer your-api-token-here
```

## Base URL

```
https://yourdomain.com/api
```

## Folder Structure Endpoints

### 1. List Folder Tree

Get the complete hierarchical folder structure.

**Endpoint:** `GET /folders/tree`

**Query Parameters:**
- `projectId` (optional): If provided, only return folders within this project

**Response:**
```json
{
  "folders": [
    {
      "id": "project-123",
      "name": "E-commerce Platform",
      "description": "Main e-commerce project",
      "color": "#3B82F6",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "_count": {
        "keys": 15,
        "other_folders": 4
      },
      "children": [
        {
          "id": "folder-456",
          "name": "Database URLs",
          "description": "Database connection strings",
          "color": "#10B981",
          "parentId": "project-123",
          "_count": {
            "keys": 3,
            "other_folders": 2
          },
          "children": [
            {
              "id": "folder-789",
              "name": "Production DB",
              "description": "Production database",
              "color": "#EF4444",
              "parentId": "folder-456",
              "_count": {
                "keys": 1,
                "other_folders": 0
              },
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

**Example Requests:**

```bash
# Get all folders
curl -H "Authorization: Bearer your-token" \
     https://yourdomain.com/api/folders/tree

# Get folders within a specific project
curl -H "Authorization: Bearer your-token" \
     https://yourdomain.com/api/folders/tree?projectId=project-123
```

### 2. List Root Folders (Projects)

Get only the root-level folders (projects).

**Endpoint:** `GET /folders`

**Response:**
```json
{
  "folders": [
    {
      "id": "project-123",
      "name": "E-commerce Platform",
      "description": "Main e-commerce project",
      "color": "#3B82F6",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "_count": {
        "keys": 15,
        "other_folders": 4
      },
      "other_folders": [
        {
          "id": "folder-456",
          "name": "Database URLs",
          "_count": {
            "keys": 3,
            "other_folders": 2
          }
        }
      ]
    }
  ]
}
```

### 3. Get Folder Details

Get a specific folder with its contents.

**Endpoint:** `GET /folders/{folderId}`

**Response:**
```json
{
  "folder": {
    "id": "folder-456",
    "name": "Database URLs",
    "description": "Database connection strings",
    "color": "#10B981",
    "parentId": "project-123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "_count": {
      "keys": 3,
      "other_folders": 2
    }
  },
  "keys": [
    {
      "id": "key-789",
      "name": "Production DB URL",
      "description": "Production database connection string",
      "type": "PASSWORD",
      "tags": ["database", "production"],
      "isFavorite": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Key Management with Folders

### 1. List Keys in Folder

Get keys from a specific folder.

**Endpoint:** `GET /keys`

**Query Parameters:**
- `folderId`: Folder ID to list keys from
- `limit` (optional): Number of keys to return (default: 20, max: 100)
- `offset` (optional): Number of keys to skip (default: 0)

**Response:**
```json
{
  "keys": [
    {
      "id": "key-789",
      "name": "Production DB URL",
      "description": "Production database connection string",
      "type": "PASSWORD",
      "tags": ["database", "production"],
      "isFavorite": false,
      "folderId": "folder-456",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### 2. Get Key with Value

Get a specific key, optionally including its decrypted value.

**Endpoint:** `GET /keys/{keyId}`

**Query Parameters:**
- `includeValue` (optional): If true, include the decrypted key value

**Response:**
```json
{
  "key": {
    "id": "key-789",
    "name": "Production DB URL",
    "description": "Production database connection string",
    "value": "postgresql://user:pass@host:5432/db",
    "type": "PASSWORD",
    "tags": ["database", "production"],
    "isFavorite": false,
    "folderId": "folder-456",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Search Keys

Search for keys across all folders.

**Endpoint:** `GET /keys`

**Query Parameters:**
- `search`: Search term
- `type` (optional): Filter by key type (PASSWORD, API_KEY, SSH_KEY, etc.)
- `favorite` (optional): Filter by favorite status (true/false)
- `limit` (optional): Number of keys to return (default: 20)
- `offset` (optional): Number of keys to skip (default: 0)

## Statistics

### Get Statistics

Get overall statistics about keys and folders.

**Endpoint:** `GET /stats`

**Response:**
```json
{
  "stats": {
    "totalKeys": 25,
    "folders": 8,
    "favorites": 5,
    "keysByType": {
      "PASSWORD": 10,
      "API_KEY": 8,
      "SSH_KEY": 3,
      "SECRET": 4
    }
  }
}
```

## SDK Usage Examples

### JavaScript/TypeScript SDK

```javascript
import KeyVault from 'amay-key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => 'your-api-token'
});

// Get folder tree for a project
const { folders } = await kv.listFolders({ projectId: 'project-123' });

// Navigate through folder structure
const dbFolder = folders[0].children.find(f => f.name === 'Database URLs');
const prodDbFolder = dbFolder.children.find(f => f.name === 'Production DB');

// Get keys from specific folder
const { keys } = await kv.listKeys({ folderId: prodDbFolder.id });

// Get a key by name
const dbUrl = await kv.getKeyByName(prodDbFolder.id, 'DB_URL', { includeValue: true });

// Search across all folders
const results = await kv.searchKeys({ 
  search: 'database', 
  type: 'PASSWORD' 
});
```

### Python SDK

```python
from key_vault_sdk import KeyVault

kv = KeyVault(
    api_url="https://yourdomain.com/api",
    token="your-api-token"
)

# Get folder tree for a project
folders = kv.list_folders(project_id="project-123")

# Navigate through folder structure
tree = kv.navigate_folder_tree(project_id="project-123")
db_folder = tree['find_folder_by_name']('Database URLs')
prod_db_folder = tree['find_folder_by_name']('Production DB')

# Get keys from specific folder
folder_data = kv.get_folder(folder_id=prod_db_folder['id'])
keys = folder_data['keys']

# Get a key by name
db_url = kv.get_key_by_name(folder_id=prod_db_folder['id'], key_name='DB_URL')

# Search across all folders
results = kv.search_keys(search="database", key_type="PASSWORD")
```

## Common Use Cases

### 1. Environment-Based Organization

```javascript
// Get all database keys for different environments
const { folders } = await kv.listFolders({ projectId: 'project-123' });
const dbFolder = folders[0].children.find(f => f.name === 'Database URLs');

const environments = ['Production', 'Staging', 'Development'];
const dbKeys = {};

for (const env of environments) {
  const envFolder = dbFolder.children.find(f => f.name.includes(env));
  if (envFolder) {
    const { keys } = await kv.listKeys({ folderId: envFolder.id });
    dbKeys[env] = keys;
  }
}
```

### 2. Service-Based Organization

```python
# Get all API keys for different services
folders = kv.list_folders(project_id="project-123")
api_folder = next(f for f in folders['folders'][0]['children'] if f['name'] == 'API Keys')

services = ['Email Service', 'SMS Gateway', 'Analytics']
api_keys = {}

for service in services:
    service_folder = next((f for f in api_folder['children'] if service in f['name']), None)
    if service_folder:
        folder_data = kv.get_folder(folder_id=service_folder['id'])
        api_keys[service] = folder_data['keys']
```

### 3. Bulk Key Retrieval

```javascript
// Get all keys from a specific folder type
const { folders } = await kv.listFolders({ projectId: 'project-123' });
const paymentFolder = folders[0].children.find(f => f.name === 'Payment Keys');

// Get all payment-related keys
const { keys } = await kv.listKeys({ 
  folderId: paymentFolder.id, 
  limit: 100 
});

// Create a map of key names to values
const paymentKeys = {};
for (const key of keys) {
  const keyWithValue = await kv.getKey(key.id, { includeValue: true });
  paymentKeys[key.name] = keyWithValue.value;
}
```

## Error Handling

### Common Error Responses

```json
{
  "message": "Not authenticated"
}
```
**Status:** 401 - Invalid or missing API token

```json
{
  "message": "Project not found"
}
```
**Status:** 404 - Folder/project doesn't exist

```json
{
  "message": "Free plan users can only create 1 project. Upgrade to add more."
}
```
**Status:** 403 - Plan limitation reached

### SDK Error Handling

```javascript
try {
  const { folders } = await kv.listFolders({ projectId: 'invalid-id' });
} catch (error) {
  if (error.message.includes('Not authenticated')) {
    // Handle authentication error
    console.log('Please check your API token');
  } else if (error.message.includes('Project not found')) {
    // Handle not found error
    console.log('Project does not exist');
  } else {
    // Handle other errors
    console.log('Unexpected error:', error.message);
  }
}
```

```python
try:
    folders = kv.list_folders(project_id="invalid-id")
except KeyVaultAuthError:
    print("Please check your API token")
except KeyVaultNotFoundError:
    print("Project does not exist")
except KeyVaultError as e:
    print(f"Unexpected error: {e}")
```

## Best Practices

1. **Cache Folder Structure**: The folder tree doesn't change frequently, so cache it locally
2. **Use Specific Folder IDs**: Always use specific folder IDs rather than searching by name
3. **Handle Pagination**: Use limit/offset for large key collections
4. **Error Handling**: Always handle authentication and not-found errors
5. **Key Naming**: Use consistent naming conventions for keys within folders
6. **Environment Separation**: Keep production, staging, and development keys in separate folders

## Rate Limiting

- **Free Plan**: 100 requests per hour
- **Pro Plan**: 1000 requests per hour  
- **Team Plan**: 5000 requests per hour

## Support

For API support and questions, please refer to the main documentation or contact support. 