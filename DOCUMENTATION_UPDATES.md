# Documentation Updates Summary

## Package Name Change: `key-vault-sdk` → `amay-key-vault-sdk`

This document summarizes all the documentation and configuration updates made to reflect the new package naming convention.

## Updated Files

### 1. Python SDK
- **`python-sdk/setup.py`**: Updated package name to `amay-key-vault-sdk`
- **`python-sdk/README.md`**: Updated installation instructions
- **`python-sdk/requirements.txt`**: Updated to use PyPI package
- **`python-sdk/install.sh`**: Updated to install from PyPI

### 2. JavaScript SDK
- **`sdk/package.json`**: Updated package name to `amay-key-vault-sdk`
- **`sdk/package-lock.json`**: Updated package references
- **`sdk/README.md`**: Updated all installation and import examples

### 3. Main Project
- **`README.md`**: Updated both Python and JavaScript SDK references
- **`package.json`**: Updated dependency reference
- **`package-lock.json`**: Updated dependency and node_modules references

### 4. Web Application
- **`src/app/api/page.js`**: Updated code examples
- **`src/app/docs/page.js`**: Updated installation and usage examples
- **`src/app/page.js`**: Updated homepage installation command

## Installation Commands

### Before
```bash
# Python
pip install key-vault-sdk

# JavaScript
npm install key-vault-sdk
```

### After
```bash
# Python
pip install amay-key-vault-sdk

# JavaScript
npm install amay-key-vault-sdk
```

## Import Statements

### Before
```javascript
import KeyVault from 'key-vault-sdk';
const KeyVault = require('key-vault-sdk');
```

```python
from key_vault_sdk import KeyVault
```

### After
```javascript
import KeyVault from 'amay-key-vault-sdk';
const KeyVault = require('amay-key-vault-sdk');
```

```python
from key_vault_sdk import KeyVault  # Import statement unchanged
```

## Benefits of the New Naming

1. **Unique Package Name**: Avoids conflicts with existing packages on PyPI/npm
2. **Brand Recognition**: Includes author name for better identification
3. **Professional Appearance**: More professional package naming convention
4. **Future-Proof**: Allows for potential expansion of the ecosystem

## Package Status

- ✅ **Python SDK**: Published on PyPI as `amay-key-vault-sdk` (v1.0.1)
- ✅ **JavaScript SDK**: Published on npm as `amay-key-vault-sdk`
- ✅ **Documentation**: All references updated consistently
- ✅ **Web Application**: All examples updated

## Recent Bug Fixes

### Python SDK v1.0.1 (2025-07-30)
- **Fixed**: URL construction issue that was causing API requests to return HTML instead of JSON
- **Root Cause**: `urljoin` function was incorrectly handling API URLs, removing the `/api` segment
- **Solution**: Replaced `urljoin` with direct string concatenation to preserve `/api` path
- **Impact**: SDK now correctly hits `/api/folders` instead of `/folders`

## Next Steps

1. Publish JavaScript SDK to npm with new package name
2. Update any external documentation or blog posts
3. Notify users of the package name change
4. Consider deprecating old package names if they exist

## Testing

All packages have been tested to ensure:
- ✅ Installation works correctly
- ✅ Import statements function properly
- ✅ SDK functionality remains unchanged
- ✅ Documentation examples are accurate 