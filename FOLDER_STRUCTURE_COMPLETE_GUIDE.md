# Complete Guide: Hierarchical Folder Structure

## 🎯 Overview

The Key Vault now supports hierarchical folder structures, allowing users to organize their keys in a logical, nested structure. This feature enables better organization, easier navigation, and more efficient key management.

## ✅ What's Been Implemented

### 1. **Backend Infrastructure**
- ✅ Database schema with `parentId` field for hierarchical relationships
- ✅ Enhanced folder management functions with tree structure support
- ✅ API endpoints for folder tree navigation
- ✅ Free plan support (1 project + unlimited subfolders)

### 2. **Frontend Features**
- ✅ Hierarchical folder tree sidebar
- ✅ Breadcrumb navigation
- ✅ Folder-specific key management
- ✅ Add folder modal for creating subfolders
- ✅ Visual folder organization with colors

### 3. **SDK Support**
- ✅ JavaScript/TypeScript SDK with folder methods
- ✅ Python SDK with folder navigation helpers
- ✅ Comprehensive error handling
- ✅ Search and filtering capabilities

### 4. **Documentation & Examples**
- ✅ API documentation with examples
- ✅ SDK usage examples
- ✅ Quick start guide
- ✅ Best practices and security guidelines

## 🏗️ Architecture

### Database Schema
```sql
-- Folders table with hierarchical support
CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  parentId TEXT REFERENCES folders(id),
  userId TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `GET /api/folders/tree` - Get hierarchical folder structure
- `GET /api/folders` - Get root folders (projects)
- `GET /api/folders/{id}` - Get folder with contents
- `POST /api/folders` - Create folder (project or subfolder)
- `GET /api/keys?folderId={id}` - Get keys from specific folder

### SDK Methods

**JavaScript SDK:**
```javascript
// Folder management
await kv.listFolders({ projectId })
await kv.getFolder(folderId)
await kv.listProjects()

// Key management with folders
await kv.listKeys({ folderId })
await kv.getKeyByName(folderId, keyName)
await kv.searchKeys({ search, type, favorite })

// Statistics
await kv.getStats()
```

**Python SDK:**
```python
# Folder management
kv.list_folders(project_id)
kv.get_folder(folder_id)
kv.list_projects()

# Key management with folders
kv.list_keys(folder_id)
kv.get_key_by_name(folder_id, key_name)
kv.search_keys(search, key_type, favorite)

# Navigation helpers
tree = kv.navigate_folder_tree(project_id)
tree['find_folder_by_name'](name)
tree['get_folder_path'](folder_id)

# Statistics
kv.get_stats()
```

## 📁 Folder Structure Examples

### Basic Structure
```
E-commerce Platform (Project)
├── Database URLs
│   ├── Production DB
│   ├── Staging DB
│   └── Development DB
├── Payment Keys
│   ├── Stripe Production
│   ├── Stripe Test
│   └── PayPal Keys
├── API Keys
│   ├── Email Service
│   ├── SMS Gateway
│   └── Analytics
└── SSH Keys
    ├── Production Server
    └── Backup Server
```

### Advanced Structure
```
Multi-Service Platform (Project)
├── Frontend App
│   ├── Production
│   │   ├── API Keys
│   │   ├── Environment Variables
│   │   └── Third-party Services
│   ├── Staging
│   └── Development
├── Backend API
│   ├── Production
│   │   ├── Database URLs
│   │   ├── Payment Keys
│   │   ├── External APIs
│   │   └── Secrets
│   ├── Staging
│   └── Development
├── Mobile App
│   ├── iOS
│   └── Android
└── Infrastructure
    ├── AWS Keys
    ├── SSH Keys
    ├── SSL Certificates
    └── Monitoring
```

## 🔧 Usage Patterns

### 1. Environment-Based Organization
```javascript
// Get environment-specific configurations
const { folders } = await kv.listFolders({ projectId: 'project-123' });
const project = folders[0];

// Find environment folders
const environments = ['Production', 'Staging', 'Development'];
const configs = {};

for (const env of environments) {
  const envFolder = project.children.find(f => f.name.includes(env));
  if (envFolder) {
    const { keys } = await kv.listKeys({ folderId: envFolder.id });
    configs[env] = keys;
  }
}
```

### 2. Service-Based Organization
```python
# Get service-specific API keys
folders = kv.list_folders(project_id="project-123")
project = folders['folders'][0]

# Find API Keys folder
api_folder = next(f for f in project['children'] if f['name'] == 'API Keys')

# Get keys for each service
services = {}
for service_folder in api_folder['children']:
    folder_data = kv.get_folder(folder_id=service_folder['id'])
    services[service_folder['name']] = folder_data['keys']
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
```

## 🔐 Security & Best Practices

### 1. **Environment Separation**
- Keep production, staging, and development keys in separate folders
- Use different API tokens for different environments
- Never mix production and test keys

### 2. **Service Organization**
- Group keys by service or functionality
- Use consistent naming conventions
- Create logical hierarchies

### 3. **Access Control**
- Use different API tokens for different teams
- Implement proper error handling
- Monitor API usage

### 4. **Key Management**
- Regularly rotate sensitive keys
- Use descriptive names for keys
- Add tags for better organization

## 📊 Plan Limitations

### Free Plan
- ✅ 1 project
- ✅ Unlimited subfolders within that project
- ✅ Unlimited nesting levels
- ✅ All folder features

### Pro Plan
- ✅ 3 projects
- ✅ Unlimited subfolders in each project
- ✅ All features

### Team Plan
- ✅ Unlimited projects
- ✅ Unlimited subfolders
- ✅ Team collaboration features

## 🚀 Getting Started

### 1. **Install SDK**
```bash
# JavaScript/TypeScript
npm install amay-key-vault-sdk

# Python
pip install amay-key-vault-sdk
```

### 2. **Initialize SDK**
```javascript
// JavaScript
import KeyVault from 'amay-key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => 'your-api-token'
});
```

```python
# Python
from key_vault_sdk import KeyVault

kv = KeyVault(
    api_url="https://yourdomain.com/api",
    token="your-api-token"
)
```

### 3. **Create Folder Structure**
1. Create a main project in the web interface
2. Add subfolders for different key types
3. Organize keys within appropriate folders

### 4. **Access via SDK**
```javascript
// Get folder structure
const { folders } = await kv.listFolders({ projectId: 'your-project-id' });

// Navigate to specific folder
const dbFolder = folders[0].children.find(f => f.name === 'Database URLs');

// Get keys from folder
const { keys } = await kv.listKeys({ folderId: dbFolder.id });
```

## 📚 Documentation Files

1. **`FOLDER_STRUCTURE_GUIDE.md`** - User guide for web interface
2. **`API_FOLDER_STRUCTURE.md`** - Complete API documentation
3. **`QUICK_START_FOLDER_STRUCTURE.md`** - Quick start guide
4. **`examples/folder-structure-examples.js`** - JavaScript examples
5. **`examples/folder-structure-examples.py`** - Python examples

## 🔍 API Reference

### Core Endpoints
- `GET /api/folders/tree` - Get hierarchical folder structure
- `GET /api/folders` - Get root folders
- `GET /api/folders/{id}` - Get folder details
- `POST /api/folders` - Create folder
- `GET /api/keys?folderId={id}` - Get keys from folder
- `GET /api/keys/{id}` - Get specific key
- `GET /api/stats` - Get statistics

### Query Parameters
- `projectId` - Filter folders by project
- `folderId` - Get keys from specific folder
- `includeValue` - Include decrypted key value
- `search` - Search keys by name/description
- `type` - Filter by key type
- `favorite` - Filter by favorite status
- `limit` - Number of results (max 100)
- `offset` - Pagination offset

## 🎯 Benefits

1. **Better Organization**: Logical grouping of related keys
2. **Easier Navigation**: Quick access to specific key categories
3. **Scalability**: Handle large numbers of keys efficiently
4. **Team Collaboration**: Clear structure for team members
5. **Security**: Logical separation of different types of sensitive data
6. **Free Plan Friendly**: Even free users can organize effectively

## 🔮 Future Enhancements

Potential future features:
- Folder templates for common structures
- Bulk folder operations
- Folder sharing between team members
- Advanced search within folders
- Folder-based access control
- Folder analytics and usage statistics

## 🆘 Support

For questions and support:
- Check the documentation files
- Review the example code
- Test with the provided examples
- Contact support for technical issues

---

**The hierarchical folder structure is now fully functional and ready for production use!** 🎉

Users can organize their keys efficiently, navigate through complex structures, and access everything they need via the web interface, API, or SDKs. 