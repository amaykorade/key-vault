# 🚀 Path-Based Key Access - Super Easy Key Management

## ✨ What's New

We've added **path-based key access** to make it incredibly easy for users to access keys without needing to know folder IDs or make multiple API calls.

## 🎯 Before vs After

### ❌ **Before (Complex)**
```javascript
// Users had to know folder IDs and make multiple calls
const folders = await kv.listFolders({ projectId: 'abc123' });
const folder = folders.find(f => f.name === 'Production');
const keys = await kv.listKeys({ folderId: folder.id, environment: 'PRODUCTION' });
```

### ✅ **After (Super Easy)**
```javascript
// Users just need to know the path - like navigating a file system!
const keys = await kv.getKeysByPath('MyApp/Production', { environment: 'PRODUCTION' });
```

## 🔑 **New Methods Available**

### **1. `getKeysByPath(path, options)` - Main Method**
```javascript
// Get keys from main project
const projectKeys = await kv.getKeysByPath('MyApp');

// Get keys from subfolder
const subfolderKeys = await kv.getKeysByPath('MyApp/Production');

// Get keys from nested subfolder
const nestedKeys = await kv.getKeysByPath('MyApp/Production/Database');

// Get keys with environment filter
const prodKeys = await kv.getKeysByPath('MyApp/Production', { 
  environment: 'PRODUCTION' 
});
```

### **2. `getProjectKeys(projectName, options)` - Convenience Method**
```javascript
// Get keys from a project by name
const keys = await kv.getProjectKeys('MyApp', { environment: 'DEVELOPMENT' });
```

### **3. `getEnvironmentKeys(projectName, environment, options)` - Environment-Specific**
```javascript
// Get keys from a specific environment
const prodKeys = await kv.getEnvironmentKeys('MyApp', 'PRODUCTION');
const devKeys = await kv.getEnvironmentKeys('MyApp', 'DEVELOPMENT');
```

## 🌍 **Environment Support**

All methods support environment filtering:

```javascript
// Available environments: DEVELOPMENT, STAGING, TESTING, PRODUCTION, ALL
const options = {
  environment: 'PRODUCTION',  // Only PRODUCTION keys
  limit: 100,                // Max 100 keys
  offset: 0                  // Start from beginning
};

const keys = await kv.getKeysByPath('MyApp/Production', options);
```

## 📁 **Path Format**

Paths work like file system paths:

```
MyApp                    → Main project
MyApp/Production        → Production subfolder
MyApp/Production/Database → Database subfolder in Production
MyApp/Development/API   → API subfolder in Development
```

## 🔧 **Implementation Details**

### **How It Works**
1. **Path Parsing**: Splits path into parts (e.g., `['MyApp', 'Production', 'Database']`)
2. **Project Discovery**: Finds the root project by name
3. **Path Navigation**: Traverses through subfolders to find the target
4. **Key Fetching**: Gets keys from the resolved folder with optional environment filtering

### **Error Handling**
- ✅ **Invalid paths** are caught and explained
- ✅ **Missing projects** show clear error messages
- ✅ **Non-existent subfolders** provide helpful feedback
- ✅ **Permission errors** are properly handled

## 📚 **Complete Examples**

### **JavaScript/Node.js**
```javascript
import KeyVault from './sdk/index.js';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'your_api_token_here'
});

// Get all keys from a project
const allKeys = await kv.getKeysByPath('MyApp');

// Get production keys from a specific folder
const prodKeys = await kv.getKeysByPath('MyApp/Production', { 
  environment: 'PRODUCTION' 
});

// Get development API keys
const devApiKeys = await kv.getKeysByPath('MyApp/Development/API', { 
  environment: 'DEVELOPMENT' 
});

console.log(`Found ${prodKeys.keys.length} production keys`);
```

### **Python**
```python
from key_vault_sdk import KeyVault

client = KeyVault(
    api_url="https://yourdomain.com/api",
    token="your_api_token_here"
)

# Get all keys from a project
all_keys = client.get_keys_by_path('MyApp')

# Get production keys from a specific folder
prod_keys = client.get_keys_by_path('MyApp/Production', environment='PRODUCTION')

# Get development API keys
dev_api_keys = client.get_keys_by_path('MyApp/Development/API', environment='DEVELOPMENT')

print(f"Found {len(prod_keys['keys'])} production keys")
```

## 🎨 **Use Cases**

### **1. Deployment Scripts**
```javascript
// Get environment-specific keys for deployment
const deploymentKeys = await kv.getKeysByPath('MyApp/Production', { 
  environment: 'PRODUCTION' 
});

// Convert to environment variables
deploymentKeys.keys.forEach(key => {
  process.env[key.name] = key.value;
});
```

### **2. Configuration Management**
```javascript
// Get different configs for different environments
const devConfig = await kv.getKeysByPath('MyApp/Development');
const prodConfig = await kv.getKeysByPath('MyApp/Production', { environment: 'PRODUCTION' });
```

### **3. Team Collaboration**
```javascript
// Different teams can work with different paths
const frontendKeys = await kv.getKeysByPath('MyApp/Frontend');
const backendKeys = await kv.getKeysByPath('MyApp/Backend');
const databaseKeys = await kv.getKeysByPath('MyApp/Database');
```

## 🚀 **Benefits**

✅ **No more folder IDs** - users work with names they know  
✅ **Single API call** - no need to discover folder structure first  
✅ **Intuitive paths** - like navigating a file system  
✅ **Environment-aware** - automatically handles environment filtering  
✅ **Backward compatible** - existing API still works  
✅ **Error handling** - clear messages for invalid paths  
✅ **Performance** - smart caching and efficient path resolution  

## 🔄 **Migration Guide**

### **Existing Code (Still Works)**
```javascript
// This still works exactly the same
const keys = await kv.listKeys({ folderId: 'abc123' });
```

### **New Easy Code**
```javascript
// New way - much easier!
const keys = await kv.getKeysByPath('MyApp/Production');
```

## 🧪 **Testing**

Test files are included:
- **JavaScript**: `test-path-access.js`
- **Python**: `python-sdk/test_path_access.py`

Run them to see the new functionality in action!

## 📖 **API Reference**

### **getKeysByPath(path, options)**
- **path** (string): Path like 'ProjectName/Subfolder'
- **options.environment** (string): Filter by environment
- **options.limit** (number): Max keys to return (default: 100)
- **options.offset** (number): Keys to skip (default: 0)

### **Returns**
```javascript
{
  keys: Array,           // Array of key objects
  total: number,         // Total keys in folder
  folder: Object,        // Folder information
  path: string          // Original path used
}
```

## 🎉 **Get Started**

1. **Update your SDK** to the latest version
2. **Replace folder ID calls** with path-based calls
3. **Enjoy the simplicity** of path-based key access!

---

**Path-based access makes key management as easy as navigating your file system! 🚀** 