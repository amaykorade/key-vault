# Changelog

All notable changes to the Key Vault project will be documented in this file.

## [Unreleased]

### Added
- Example files demonstrating SDK usage
- Comprehensive documentation for Python SDK
- Environment variable best practices examples

## [2025-07-30] - Python SDK v1.0.1

### Fixed
- **Critical Bug Fix**: Fixed URL construction issue in Python SDK that was causing API requests to return HTML instead of JSON
- **Root Cause**: `urljoin` function was incorrectly handling API URLs, removing the `/api` segment
- **Solution**: Replaced `urljoin` with direct string concatenation to preserve `/api` path
- **Impact**: SDK now correctly hits `/api/folders` instead of `/folders`

### Changed
- Updated Python SDK version to 1.0.1
- Added changelog section to Python SDK README
- Updated main README with version information
- Updated web application documentation with version note

### Added
- Created comprehensive example files:
  - `example_usage.py` - Basic SDK usage
  - `practical_example.py` - Real-world application integration
  - `env_example.py` - Environment variable best practices
  - `EXAMPLES.md` - Complete documentation for all examples
- Added version information to main README
- Updated documentation with bug fix details

## [2025-07-23] - Python SDK v1.0.0

### Added
- Initial release of Python SDK
- Basic SDK functionality for accessing Key Vault API
- Support for listing folders, keys, and retrieving key values
- Comprehensive error handling
- Full API documentation

### Features
- `list_folders()` - List all folders
- `list_keys(folder_id)` - List keys in a folder
- `get_key(key_id, include_value)` - Get a key by ID
- `get_key_by_name(folder_id, key_name)` - Get a key by name
- `get_multiple_keys(folder_id, key_names)` - Get multiple keys at once

## [2025-07-22] - JavaScript SDK v1.0.0

### Added
- Initial release of JavaScript SDK
- Support for both ES Modules and CommonJS
- Automatic token refresh functionality
- Comprehensive error handling
- Full TypeScript support

### Features
- `listKeys()` - List keys in a folder
- `getKey()` - Get a specific key with optional value inclusion
- Automatic authentication error handling
- Token refresh capabilities

## [2025-07-21] - Web Application

### Added
- Initial release of Key Vault web application
- Secure secret management with AES-256-GCM encryption
- User authentication and authorization
- Project-based organization
- API token generation
- Subscription plans and payment integration
- Audit logging
- RESTful API endpoints

### Features
- User registration and authentication
- Secret creation, editing, and deletion
- Folder/project organization
- Search and filtering capabilities
- API access with token authentication
- Subscription management with Razorpay integration
- Admin panel for user management
- Comprehensive audit trail

---

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/amaykorade/key-vault/tags).

## Package Versions

- **Python SDK**: [amay-key-vault-sdk](https://pypi.org/project/amay-key-vault-sdk/) - v1.0.1
- **JavaScript SDK**: [amay-key-vault-sdk](https://www.npmjs.com/package/amay-key-vault-sdk) - v1.0.0
- **Web Application**: Latest development version 