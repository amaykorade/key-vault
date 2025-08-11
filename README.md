# Key Vault - Secure Secret Management

A modern, secure secret management application built with Next.js, featuring encrypted storage, API access, and subscription-based plans.

## 📦 **Official SDKs Now Available!**

Both JavaScript and Python SDKs are now published and ready to use:

```bash
# JavaScript/Node.js
npm install amay-key-vault-sdk

# Python
pip install amay-key-vault-sdk
```

**New in v1.0.4**: Path-based key access with `getKeysByPath('Project/Subfolder')` - no more folder IDs needed!

## Features

### 🔐 Security
- **AES-256-GCM Encryption**: All secrets are encrypted at rest
- **Secure Authentication**: JWT-based sessions with bcrypt password hashing
- **API Token Access**: Generate tokens for programmatic access
- **Audit Logging**: Complete audit trail of all actions

### 📁 Organization
- **Hierarchical Folder Structure**: Create nested folders within projects for better organization
- **Project-based Organization**: Group secrets by projects/folders
- **Tags & Favorites**: Organize and mark important secrets
- **Search & Filter**: Find secrets quickly with advanced filtering

### 🚀 Developer Experience
- **JavaScript SDK**: Easy integration with Node.js/TypeScript applications
- **Python SDK**: Simple Python integration for your applications
- **RESTful API**: Full API access for automation
- **Multiple Key Types**: Passwords, API keys, SSH keys, certificates, and more

### 💳 Subscription Plans
- **Free Plan**: 1 project, 5 secrets, basic features
- **Pro Plan ($9/month)**: 3 projects, 100 secrets, audit logs, expiring secrets
- **Team Plan ($29/month)**: Unlimited projects, 1000+ secrets, team features

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd key-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/key_vault_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   ENCRYPTION_KEY="your-32-character-encryption-key"
   SESSION_SECRET="your-session-secret-key-here"
   
   # For payments (optional)
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
   RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 SDK Usage

Key Vault provides official SDKs for multiple programming languages, now available on their respective package registries:

### 📦 Package Registries
- **JavaScript SDK**: [npmjs.com/package/amay-key-vault-sdk](https://npmjs.com/package/amay-key-vault-sdk)
- **Python SDK**: [pypi.org/project/amay-key-vault-sdk](https://pypi.org/project/amay-key-vault-sdk)

### JavaScript/TypeScript SDK

#### Installation
```bash
npm install amay-key-vault-sdk
```

#### Basic Usage
```javascript
import { KeyVault } from 'amay-key-vault-sdk';

const kv = new KeyVault('your-api-token', 'https://yourdomain.com');

// Get a key by name
async function getKey(keyName, folderId) {
  const { keys } = await kv.listKeys({ folderId, limit: 100 });
  const key = keys.find(k => k.name === keyName);
  const keyWithValue = await kv.getKey(key.id, { includeValue: true });
  return keyWithValue.value;
}

const apiKey = await getKey('key-name', 'folder-id');
```

#### 🆕 New Path-Based Access (v1.0.4+)
```javascript
// Access keys using human-readable paths instead of folder IDs
const keys = await kv.getKeysByPath('MyApp/Production');
const projectKeys = await kv.getProjectKeys('MyApp');
const envKeys = await kv.getEnvironmentKeys('MyApp', 'PRODUCTION');
```

### Python SDK

#### Installation
```bash
pip install amay-key-vault-sdk
```

#### Basic Usage
```python
from key_vault_sdk import KeyVault

# Initialize
kv = KeyVault('your-api-token', 'https://yourdomain.com')

# Get a key by name
api_key = kv.get_key_by_name("folder-id", "key-name")
print(f"API Key: {api_key}")
```

#### 🆕 New Path-Based Access (v1.0.4+)
```python
# Access keys using human-readable paths instead of folder IDs
keys = kv.get_keys_by_path('MyApp/Production')
project_keys = kv.get_project_keys('MyApp')
env_keys = kv.get_environment_keys('MyApp', 'PRODUCTION')
```

### Advanced Usage
```javascript
// List all keys in a folder
const { keys } = await kv.listKeys({ folderId: 'your-folder-id' });

// Get a specific key with metadata
const key = await kv.getKey('key-id', { includeValue: true });

// Navigate hierarchical folder structure
const { folders } = await kv.listFolders({ projectId: 'your-project-id' });
```

## Getting Started with API Access

### Step 1: Get Your API Token
1. Login to your Key Vault application
2. Navigate to the "API" page
3. Copy your API token (starts with `tok_`)

### Step 2: Use the SDK to Retrieve Keys

#### Method 1: Using the SDK (Recommended)
```javascript
import { KeyVault } from 'amay-key-vault-sdk';

// Initialize the SDK
const kv = new KeyVault('tok_your-api-token-here', 'https://yourdomain.com');

// Get a specific key by name
async function getDatabaseUrl() {
  try {
    // First, list keys to find the one you want
    const { keys } = await kv.listKeys({ folderId: 'your-folder-id' });
    
    // Find the key by name
    const dbUrlKey = keys.find(key => key.name === 'DB_URL');
    
    if (dbUrlKey) {
      // Get the actual value
      const keyWithValue = await kv.getKey(dbUrlKey.id, { includeValue: true });
      console.log('Database URL:', keyWithValue.value);
      return keyWithValue.value;
    }
  } catch (error) {
    console.error('Error fetching key:', error);
  }
}

getDatabaseUrl();
```

#### 🆕 New Path-Based Method (Easiest)
```javascript
// Get keys directly by project/folder path - no need to know folder IDs!
const keys = await kv.getKeysByPath('MyApp/Database');
const dbUrlKey = keys.find(key => key.name === 'DB_URL');
console.log('Database URL:', dbUrlKey.value);
```

#### Method 2: Using Direct API Calls
```javascript
import fetch from 'node-fetch';

const BASE_URL = 'https://yourdomain.com';
const API_TOKEN = 'tok_your-api-token-here';

async function getDatabaseUrl() {
  try {
    // 1. List folders to get folder ID
    const foldersResponse = await fetch(`${BASE_URL}/api/folders`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const foldersData = await foldersResponse.json();
    const folderId = foldersData.folders[0].id;
    
    // 2. List keys in the folder
    const keysResponse = await fetch(`${BASE_URL}/api/keys?folderId=${folderId}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const keysData = await keysResponse.json();
    
    // 3. Find the DB_URL key
    const dbUrlKey = keysData.keys.find(key => key.name === 'DB_URL');
    
    if (dbUrlKey) {
      // 4. Get the actual value
      const keyValueResponse = await fetch(`${BASE_URL}/api/keys/${dbUrlKey.id}?includeValue=true`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      const keyValueData = await keyValueResponse.json();
      console.log('Database URL:', keyValueData.key.value);
      return keyValueData.key.value;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

getDatabaseUrl();
```

### Step 3: Use in Your Application
```javascript
// Example: Using retrieved database URL
const databaseUrl = await getDatabaseUrl();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: databaseUrl
});

// Now you can use the database connection
const result = await pool.query('SELECT NOW()');
console.log('Database connected:', result.rows[0]);
```

## Hierarchical Folder Structure

Key Vault now supports hierarchical folder structures within projects, allowing you to organize your keys more effectively:

### Creating a Project Structure

1. **Create a Main Project**
   - Go to Dashboard → Create Project
   - Name it (e.g., "E-commerce Platform")
   - Choose a color and description

2. **Add Subfolders**
   - Open your project
   - Click "Add Folder" to create subfolders:
     - `Database URLs` - For database connection strings
     - `Payment Keys` - For payment gateway APIs
     - `API Keys` - For third-party services
     - `SSH Keys` - For server access
     - `Secrets` - For application secrets

### Example Structure
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

### Navigation Features
- **Folder Tree Sidebar**: Visual representation of your project structure
- **Breadcrumb Navigation**: Shows your current location in the hierarchy
- **Click to Navigate**: Easy navigation between folders
- **Folder-Specific Keys**: Add and view keys organized by folder

### API Access to Folder Structure
```javascript
// Get folder tree for a project
const { folders } = await kv.listFolders({ projectId: 'project-id' });

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

**Python SDK:**
```python
# Get folder tree for a project
folders = kv.list_folders(project_id="project-id")

# Navigate through folder structure
tree = kv.navigate_folder_tree(project_id="project-id")
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

## API Documentation

### Authentication
All API requests require authentication via:
- **Session Cookie**: For web application
- **Bearer Token**: For API access (`Authorization: Bearer <token>`)

### Key Endpoints

#### Create a Key
```http
POST /api/keys
Content-Type: application/json

{
  "name": "Database Password",
  "value": "secret-password",
  "type": "PASSWORD",
  "folderId": "folder-id",
  "description": "Production database password"
}
```

#### List Keys
```http
GET /api/keys?folderId=folder-id
```

#### Get Key Value
```http
GET /api/keys/{keyId}?includeValue=true
```

#### Update Key
```http
PUT /api/keys/{keyId}
Content-Type: application/json

{
  "name": "Updated Name",
  "value": "new-secret-value"
}
```

#### Delete Key
```http
DELETE /api/keys/{keyId}
```

### Folder Endpoints

#### Create Folder
```http
POST /api/folders
Content-Type: application/json

{
  "name": "Production",
  "description": "Production environment secrets",
  "color": "#ff0000"
}
```

#### List Folders
```http
GET /api/folders
```

## Payment Integration

The application integrates with Razorpay for subscription management:

### Webhook Setup
1. Configure webhook URL in Razorpay dashboard: `https://yourdomain.com/api/payment/webhook`
2. Select events: `payment.captured` and `order.paid`
3. Set webhook secret in environment variables

### Plan Limits
- **Free**: 1 project, 5 secrets
- **Pro**: 3 projects, 100 secrets  
- **Team**: Unlimited projects, 1000+ secrets

## Development

### Database Commands
```bash
npm run db:setup    # Initial setup
npm run db:seed     # Add sample data
npm run db:migrate  # Run migrations
npm run db:studio   # Open Prisma Studio
```

### Available Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

## Security Considerations

### Encryption
- All secret values are encrypted using AES-256-GCM
- Each encryption uses a unique salt and IV
- Master encryption key is stored securely

### Authentication
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- API tokens for programmatic access

### Access Control
- Users can only access their own secrets
- Admin users have additional privileges
- Audit logging for compliance

## Deployment

### Environment Variables
See `env.example` for all required environment variables.

### Production Checklist
- [ ] Set strong, unique secrets
- [ ] Configure SSL/TLS
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up webhook endpoints
- [ ] Test payment integration

## Version Information

### SDK Versions
- **Python SDK**: v1.0.2 - [PyPI Package](https://pypi.org/project/amay-key-vault-sdk/)
- **JavaScript SDK**: v1.0.3 - [npm Package](https://www.npmjs.com/package/amay-key-vault-sdk)

### Recent Updates
- **JavaScript SDK v1.0.3** (2025-08-07): Updated documentation, improved examples, tested functionality
- **Python SDK v1.0.2** (2025-08-07): Updated documentation, improved examples, tested functionality
- **Python SDK v1.0.1** (2025-07-30): Fixed URL construction bug that was causing API requests to fail
- **Python SDK v1.0.0** (2025-07-23): Initial release with basic functionality

## 🎨 Logo Assets

High-quality logo files are available in the `public/` directory:

### SVG Files (Vector Format)
- **`logo.svg`** - Standard logo for general use
- **`logo-large.svg`** - Large logo for navigation and marketing materials
- **`logo-simple.svg`** - Simple logo for small spaces (40x40)
- **`favicon.svg`** - Browser favicon (48x48, enhanced visibility)

### PNG Files (Raster Format)
- **`public/png/`** - High-quality PNG versions in multiple sizes
- **16x16 to 960x960** - Various sizes for different use cases
- **Transparent backgrounds** - Perfect for any background

### Commands
- `npm run generate:logos` - Check all logo files
- `npm run convert:logos` - Convert SVG to PNG (requires puppeteer)
- `npm run download:logos` - Get download instructions

### Download
- **ZIP Archive**: `key-vault-logos.zip` (475 KB) - All logos in one file

## Support

- **Documentation**: Check the `/docs` page in the application
- **API Reference**: Available at `/api` page
- **Issues**: Report bugs and feature requests via GitHub

## License

MIT License - see LICENSE file for details.
