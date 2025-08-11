# 🔑 Key Vault API Documentation

Complete API documentation for Key Vault, including official SDKs, authentication, and all endpoints.

## 📦 **Official SDKs**

### JavaScript/Node.js SDK
```bash
npm install amay-key-vault-sdk
```

**Package**: [npmjs.com/package/amay-key-vault-sdk](https://npmjs.com/package/amay-key-vault-sdk)

### Python SDK
```bash
pip install amay-key-vault-sdk
```

**Package**: [pypi.org/project/amay-key-vault-sdk](https://pypi.org/project/amay-key-vault-sdk)

## 🆕 **New in v1.0.4: Path-Based Access**

### Before (Required folder IDs)
```javascript
// Old way - needed to know folder IDs
const { keys } = await kv.listKeys({ folderId: 'cme6wllh7000goh4pzmeqoftn' });
```

### After (Human-readable paths)
```javascript
// New way - use project/folder names
const keys = await kv.getKeysByPath('MyApp/Production');
const projectKeys = await kv.getProjectKeys('MyApp');
const envKeys = await kv.getEnvironmentKeys('MyApp', 'PRODUCTION');
```

## 🔐 **Authentication**

### API Token
All API requests require an API token in the Authorization header:

```bash
Authorization: Bearer tok_your-api-token-here
```

### Getting Your API Token
1. Login to your Key Vault application
2. Navigate to the "API" page
3. Copy your API token (starts with `tok_`)

## 🚀 **Quick Start with SDKs**

### JavaScript/Node.js
```javascript
import { KeyVault } from 'amay-key-vault-sdk';

const kv = new KeyVault('your-api-token', 'https://yourdomain.com');

// Get keys by path (easiest method)
const keys = await kv.getKeysByPath('MyApp/Database');
console.log('Database keys:', keys);

// Get environment-specific keys
const prodKeys = await kv.getEnvironmentKeys('MyApp', 'PRODUCTION');
console.log('Production keys:', prodKeys);
```

### Python
```python
from key_vault_sdk import KeyVault

kv = KeyVault('your-api-token', 'https://yourdomain.com')

# Get keys by path (easiest method)
keys = kv.get_keys_by_path('MyApp/Database')
print('Database keys:', keys)

# Get environment-specific keys
prod_keys = kv.get_environment_keys('MyApp', 'PRODUCTION')
print('Production keys:', prod_keys)
```

## 📋 **API Endpoints**

### Authentication Endpoints

#### POST `/api/auth/login`
Authenticate a user and get a session token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "token": "jwt-session-token",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "plan": "PRO"
    }
  }
}
```

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Key Management Endpoints

#### GET `/api/keys`
List keys in a folder with pagination.

**Query Parameters:**
- `folderId` (required): ID of the folder to list keys from
- `limit` (optional): Number of keys to return (default: 20)
- `offset` (optional): Number of keys to skip (default: 0)
- `environment` (optional): Filter keys by environment

**Example:**
```bash
GET /api/keys?folderId=cme6wllh7000goh4pzmeqoftn&limit=100&environment=PRODUCTION
```

**Response:**
```json
{
  "success": true,
  "keys": [
    {
      "id": "key-id",
      "name": "DB_PASSWORD",
      "type": "PASSWORD",
      "environment": "PRODUCTION",
      "isFavorite": false,
      "createdAt": "2025-08-11T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0
}
```

#### POST `/api/keys`
Create a new key.

**Request Body:**
```json
{
  "name": "API_KEY",
  "value": "secret-api-key-value",
  "type": "API_KEY",
  "description": "API key for external service",
  "folderId": "folder-id",
  "environment": "PRODUCTION"
}
```

#### GET `/api/keys/{id}`
Get a specific key by ID.

**Query Parameters:**
- `includeValue` (optional): Include the key value in response (default: false)

**Example:**
```bash
GET /api/keys/key-id?includeValue=true
```

### Folder Management Endpoints

#### GET `/api/folders`
List all folders/projects for the authenticated user.

**Response:**
```json
{
  "success": true,
  "folders": [
    {
      "id": "folder-id",
      "name": "MyApp",
      "description": "Main application project",
      "color": "#3B82F6",
      "_count": {
        "keys": 5,
        "other_folders": 2
      }
    }
  ]
}
```

#### GET `/api/folders/tree`
Get the hierarchical folder structure.

**Query Parameters:**
- `projectId` (optional): Get tree for specific project

**Response:**
```json
{
  "success": true,
  "folders": [
    {
      "id": "project-id",
      "name": "MyApp",
      "children": [
        {
          "id": "subfolder-id",
          "name": "Database",
          "children": []
        }
      ]
    }
  ]
}
```

## 🔧 **SDK Methods Reference**

### JavaScript SDK Methods

#### Constructor
```javascript
const kv = new KeyVault(apiToken, baseUrl);
```

#### Key Access Methods
- `getKeysByPath(path, options)` - Get keys by project/folder path
- `getProjectKeys(projectName, options)` - Get all keys in a project
- `getEnvironmentKeys(projectName, environment, options)` - Get keys by environment
- `listKeys(options)` - List keys in a folder
- `getKey(keyId, options)` - Get a specific key
- `getKeyByName(folderId, keyName)` - Get a key by name

#### Folder Methods
- `listFolders(options)` - List all folders
- `listProjects()` - List all projects
- `navigateFolderTree(projectId)` - Get folder hierarchy

#### Permission Methods
- `getPermissions()` - Get user permissions
- `hasPermission(permission)` - Check specific permission
- `hasAllPermissions(permissions)` - Check multiple permissions

### Python SDK Methods

#### Constructor
```python
kv = KeyVault(api_token, base_url)
```

#### Key Access Methods
- `get_keys_by_path(path, **options)` - Get keys by project/folder path
- `get_project_keys(project_name, **options)` - Get all keys in a project
- `get_environment_keys(project_name, environment, **options)` - Get keys by environment
- `list_keys(**options)` - List keys in a folder
- `get_key(key_id, **options)` - Get a specific key
- `get_key_by_name(folder_id, key_name)` - Get a key by name

#### Folder Methods
- `list_folders(**options)` - List all folders
- `list_projects()` - List all projects
- `navigate_folder_tree(project_id)` - Get folder hierarchy

#### Permission Methods
- `get_permissions()` - Get user permissions
- `has_permission(permission)` - Check specific permission
- `has_all_permissions(permissions)` - Check multiple permissions

## 📝 **Error Handling**

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "required": "keys:read"
}
```

#### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

### SDK Error Handling

#### JavaScript
```javascript
try {
  const keys = await kv.getKeysByPath('MyApp/Production');
} catch (error) {
  if (error.status === 401) {
    console.log('Token expired, please refresh');
  } else if (error.status === 403) {
    console.log('Insufficient permissions');
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

#### Python
```python
try:
    keys = kv.get_keys_by_path('MyApp/Production')
except Exception as e:
    if hasattr(e, 'status_code'):
        if e.status_code == 401:
            print('Token expired, please refresh')
        elif e.status_code == 403:
            print('Insufficient permissions')
        else:
            print(f'Unexpected error: {e}')
    else:
        print(f'Error: {e}')
```

## 🔄 **Rate Limiting**

- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1000 requests/hour
- **Team Plan**: 10000 requests/hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1628764800
```

## 📚 **Examples**

### Complete Integration Example

#### JavaScript
```javascript
import { KeyVault } from 'amay-key-vault-sdk';

class DatabaseConfig {
  constructor() {
    this.kv = new KeyVault(process.env.KEY_VAULT_TOKEN, process.env.KEY_VAULT_URL);
  }

  async getDatabaseConfig() {
    try {
      const keys = await this.kv.getKeysByPath('MyApp/Database');
      
      return {
        host: keys.find(k => k.name === 'DB_HOST')?.value,
        port: keys.find(k => k.name === 'DB_PORT')?.value,
        username: keys.find(k => k.name === 'DB_USERNAME')?.value,
        password: keys.find(k => k.name === 'DB_PASSWORD')?.value,
        database: keys.find(k => k.name === 'DB_NAME')?.value
      };
    } catch (error) {
      console.error('Failed to load database config:', error);
      throw error;
    }
  }
}

// Usage
const dbConfig = new DatabaseConfig();
const config = await dbConfig.getDatabaseConfig();
```

#### Python
```python
from key_vault_sdk import KeyVault
import os

class DatabaseConfig:
    def __init__(self):
        self.kv = KeyVault(
            os.environ['KEY_VAULT_TOKEN'],
            os.environ['KEY_VAULT_URL']
        )
    
    def get_database_config(self):
        try:
            keys = self.kv.get_keys_by_path('MyApp/Database')
            
            return {
                'host': next((k.value for k in keys if k.name == 'DB_HOST'), None),
                'port': next((k.value for k in keys if k.name == 'DB_PORT'), None),
                'username': next((k.value for k in keys if k.name == 'DB_USERNAME'), None),
                'password': next((k.value for k in keys if k.name == 'DB_PASSWORD'), None),
                'database': next((k.value for k in keys if k.name == 'DB_NAME'), None)
            }
        except Exception as e:
            print(f'Failed to load database config: {e}')
            raise

# Usage
db_config = DatabaseConfig()
config = db_config.get_database_config()
```

## 🌐 **Support & Resources**

- **GitHub**: [github.com/amaykorade/key-vault](https://github.com/amaykorade/key-vault)
- **Issues**: [github.com/amaykorade/key-vault/issues](https://github.com/amaykorade/key-vault/issues)
- **Documentation**: [github.com/amaykorade/key-vault#readme](https://github.com/amaykorade/key-vault#readme)

## 📈 **Version History**

- **v1.0.4** - Path-based access, official package publication
- **v1.0.1** - Bug fixes and improvements
- **v1.0.0** - Initial release with basic functionality

---

*For the latest updates and features, always use the latest version of the SDKs.* 