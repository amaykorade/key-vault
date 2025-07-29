'use client'

import React from 'react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Key Vault Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to the Key Vault documentation. This guide covers everything you need to know about using Key Vault for secure secret management.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg p-6 mb-12 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#sdk" className="text-slate-600 hover:text-slate-500 hover:underline">JavaScript SDK</a>
            <a href="#python-sdk" className="text-slate-600 hover:text-slate-500 hover:underline">Python SDK</a>
            <a href="#api" className="text-slate-600 hover:text-slate-500 hover:underline">REST API</a>
            <a href="#authentication" className="text-slate-600 hover:text-slate-500 hover:underline">Authentication</a>
            <a href="#security" className="text-slate-600 hover:text-slate-500 hover:underline">Security</a>
            <a href="#plans" className="text-slate-600 hover:text-slate-500 hover:underline">Subscription Plans</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-500 hover:underline">FAQ</a>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* SDK Section */}
          <section id="sdk" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">JavaScript SDK</h2>
            <p className="text-lg text-gray-600 mb-8">
              The Key Vault SDK allows you to securely access your vault keys from JavaScript/TypeScript projects. 
              <strong className="text-red-600"> This SDK is read-only</strong>: key creation, update, and deletion must be performed via the Key Vault web platform.
              <br /><br />
              <strong className="text-green-600">✅ Supports both ES Modules and CommonJS</strong> - works in any JavaScript environment!
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Installation</h3>
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <code className="text-green-600 text-sm">npm install amay-key-vault-sdk</code>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Get Your API Token</h4>
                    <ol className="space-y-2 text-gray-600 ml-6">
                      <li>1. Login to your Key Vault application</li>
                      <li>2. Navigate to the &quot;API&quot; page</li>
                      <li>3. Copy your API token (starts with <code className="bg-gray-200 px-1 rounded text-gray-800">tok_</code>)</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Initialize the SDK</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">ES Modules (Recommended)</h5>
                        <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                          <pre className="text-green-600 text-sm">
                            <code>{`import KeyVault from 'amay-key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => 'your-api-token',
  onAuthError: () => console.log('Token expired')
});`}</code>
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">CommonJS</h5>
                        <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                          <pre className="text-green-600 text-sm">
                            <code>{`const KeyVault = require('amay-key-vault-sdk');

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => 'your-api-token',
  onAuthError: () => console.log('Token expired')
});`}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Retrieve Secrets</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`// Simple function to get a key by name
async function getKey(keyName, folderId) {
  const { keys } = await kv.listKeys({ folderId, limit: 100 });
  const key = keys.find(k => k.name === keyName);
  const keyWithValue = await kv.getKey(key.id, { includeValue: true });
  return keyWithValue.value;
}

// Usage
const apiKey = await getKey('key-name', 'folder-id');

// Or get all keys in a folder
const { keys } = await kv.listKeys({ folderId: 'folder-id' });
console.log('Available keys:', keys.map(k => k.name));`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">API Reference</h3>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">new KeyVault(&#123; apiUrl, getToken, onAuthError? &#125;)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>apiUrl</strong> (string): Base URL of your Key Vault API</li>
                      <li><strong>getToken</strong> (function): Function that returns your API token</li>
                      <li><strong>onAuthError</strong> (function, optional): Callback for authentication errors</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">listKeys(&#123; folderId, limit?, offset? &#125;)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>folderId</strong> (string, required): Folder to list keys from</li>
                      <li><strong>limit</strong> (number, optional): Number of keys to return (default: 20)</li>
                      <li><strong>offset</strong> (number, optional): Number of keys to skip (default: 0)</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-200 px-1 rounded text-gray-800">&#123; keys, total, limit, offset &#125;</code> - Array of key metadata (no values)</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">getKey(keyId, &#123; includeValue &#125;)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>keyId</strong> (string, required): The key&apos;s ID</li>
                      <li><strong>includeValue</strong> (boolean, optional): If true, includes the decrypted key value</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-200 px-1 rounded text-gray-800">key</code> object with metadata and optionally the value</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">getKey(keyId, &#123; includeValue? &#125;)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>keyId</strong> (string, required): The key&apos;s ID</li>
                      <li><strong>includeValue</strong> (boolean, optional): If true, includes the decrypted key value</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-200 px-1 rounded text-gray-800">key</code> object with metadata and optionally the value</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Module Format Support</h3>
                <p className="text-gray-600 mb-6">
                  The SDK automatically detects your module system and provides the appropriate format. 
                  No configuration needed - it just works!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">ES Modules</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`// package.json: "type": "module"
import KeyVault from 'amay-key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => 'your-token'
});`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">CommonJS</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`// package.json: no "type" field
const KeyVault = require('amay-key-vault-sdk');

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => 'your-token'
});`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Usage Examples</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Simple Key Retrieval</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`// Simple function to get any key by name
async function getKey(keyName, folderId) {
  const { keys } = await kv.listKeys({ folderId, limit: 100 });
  const key = keys.find(k => k.name === keyName);
  const keyWithValue = await kv.getKey(key.id, { includeValue: true });
  return keyWithValue.value;
}

// Usage
const apiKey = await getKey('stripe-secret-key', 'your-folder-id');
const dbPassword = await getKey('database-password', 'your-folder-id');`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Get Database URL from Key Vault</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`async function getDatabaseUrl() {
  try {
    // First, list keys to find the one you want
    const { keys } = await kv.listKeys({ folderId: 'your-folder-id' });
    
    // Find the key by name
    const dbUrlKey = keys.find(key => key.name === 'DB_URL');
    
    if (dbUrlKey) {
      // Get the actual value
      const keyWithValue = await kv.getKey(dbUrlKey.id, { includeValue: true });
      console.log('Database URL retrieved successfully');
      return keyWithValue.value;
    } else {
      throw new Error('DB_URL key not found');
    }
  } catch (error) {
    console.error('Error fetching database URL:', error);
    throw error;
  }
}

// Use it
const databaseUrl = await getDatabaseUrl();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: databaseUrl });`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Environment-Specific Secrets</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`const environment = process.env.NODE_ENV || 'development';
const folderId = environment === 'production' ? 'prod-folder' : 'dev-folder';

const secrets = {
  database: await kv.getKeyValue(folderId, 'DB_URL'),
  apiKey: await kv.getKeyValue(folderId, 'API_KEY'),
  jwtSecret: await kv.getKeyValue(folderId, 'JWT_SECRET')
};`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Error Handling</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`try {
  const secret = await kv.getKeyValue('folder-id', 'DB_URL');
  // Use secret
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('DB_URL not found');
  } else if (error.message.includes('Unauthorized')) {
    console.error('Invalid API token');
  } else {
    console.error('Failed to retrieve DB_URL:', error.message);
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Python SDK Section */}
          <section id="python-sdk" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Python SDK</h2>
            <p className="text-lg text-gray-600 mb-8">
              The Key Vault Python SDK allows you to securely access your vault keys from Python applications. 
              <strong className="text-red-600"> This SDK is read-only</strong>: key creation, update, and deletion must be performed via the Key Vault web platform.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Installation</h3>
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <code className="text-green-600 text-sm">pip install amay-key-vault-sdk</code>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Get Your API Token</h4>
                    <ol className="space-y-2 text-gray-600 ml-6">
                      <li>1. Login to your Key Vault application</li>
                      <li>2. Navigate to the &quot;API&quot; page</li>
                      <li>3. Copy your API token</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Initialize the SDK</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`from key_vault_sdk import KeyVault

# Initialize the SDK
kv = KeyVault(
    api_url="https://yourdomain.com/api",
    token="your-api-token-here"
)`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Retrieve Secrets</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`# Get a specific secret value by name
secret_value = kv.get_key_by_name("folder-id", "DB_URL")
print("Secret retrieved successfully")

# Or get all keys in a folder
result = kv.list_keys(folder_id="folder-id")
print("Available keys:", [k['name'] for k in result['keys']])`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">API Reference</h3>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">KeyVault(api_url, token, timeout=30)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>api_url</strong> (str): Base URL of your Key Vault API</li>
                      <li><strong>token</strong> (str): Your API token for authentication</li>
                      <li><strong>timeout</strong> (int, optional): Request timeout in seconds</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">list_keys(folder_id, limit=20, offset=0)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>folder_id</strong> (str, required): Folder to list keys from</li>
                      <li><strong>limit</strong> (int, optional): Number of keys to return (default: 20)</li>
                      <li><strong>offset</strong> (int, optional): Number of keys to skip (default: 0)</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-200 px-1 rounded text-gray-800">dict</code> - Dictionary with keys list and pagination info</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">get_key(key_id, include_value=False)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>key_id</strong> (str, required): The key&apos;s ID</li>
                      <li><strong>include_value</strong> (bool, optional): If True, include the decrypted key value</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-200 px-1 rounded text-gray-800">dict</code> - Key object with metadata and optionally the value</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">get_key_by_name(folder_id, key_name)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>folder_id</strong> (str, required): Folder containing the key</li>
                      <li><strong>key_name</strong> (str, required): Name of the key to retrieve</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-200 px-1 rounded text-gray-800">str</code> - The decrypted secret value</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Usage Examples</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Simple Key Retrieval</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`from key_vault_sdk import KeyVault

# Initialize
kv = KeyVault(
    api_url="https://yourdomain.com/api",
    token="your-api-token"
)

# Get a key by name
api_key = kv.get_key_by_name("folder-id", "key-name")
print(f"API Key: {api_key}")

# Get multiple keys
keys = kv.get_multiple_keys(
    folder_id="folder-id",
    key_names=["stripe-key", "database-password"]
)
print(f"Retrieved keys: {keys}")`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Error Handling</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`from key_vault_sdk import KeyVault, KeyVaultError, KeyVaultAuthError, KeyVaultNotFoundError

try:
    secret = kv.get_key_by_name("folder-id", "secret-name")
    # Use secret
except KeyVaultNotFoundError:
    print("Secret not found")
except KeyVaultAuthError:
    print("Invalid API token")
except KeyVaultError as e:
    print(f"Failed to retrieve secret: {e}")`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API Section */}
          <section id="api" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">REST API</h2>
            <p className="text-lg text-gray-600 mb-8">
              The Key Vault REST API provides full programmatic access to your secrets. All endpoints require authentication.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Base URL</h3>
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <code className="text-gray-800 font-mono">https://yourdomain.com/api</code>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h3>
                <p className="text-gray-600 mb-4">All API requests require authentication via:</p>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li><strong>Session Cookie</strong>: For web application requests</li>
                  <li><strong>Bearer Token</strong>: For API access (<code className="bg-gray-200 px-1 rounded text-gray-800">Authorization: Bearer &lt;token&gt;</code>)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Direct API Usage (Alternative to SDK)</h3>
                <p className="text-gray-600 mb-4">If you prefer to use direct API calls instead of the SDK:</p>
                
                <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                  <pre className="text-green-600 text-sm">
                    <code>{`import fetch from 'node-fetch';

const BASE_URL = 'https://yourdomain.com';
const API_TOKEN = 'tok_your-api-token-here';

async function getDatabaseUrl() {
  try {
    // 1. List folders to get folder ID
    const foldersResponse = await fetch(\`\${BASE_URL}/api/folders\`, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json'
      }
    });
    
    const foldersData = await foldersResponse.json();
    const folderId = foldersData.folders[0].id;
    
    // 2. List keys in the folder
    const keysResponse = await fetch(\`\${BASE_URL}/api/keys?folderId=\${folderId}\`, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json'
      }
    });
    
    const keysData = await keysResponse.json();
    
    // 3. Find the DB_URL key
    const dbUrlKey = keysData.keys.find(key => key.name === 'DB_URL');
    
    if (dbUrlKey) {
      // 4. Get the actual value
      const keyValueResponse = await fetch(\`\${BASE_URL}/api/keys/\${dbUrlKey.id}?includeValue=true\`, {
        headers: {
          'Authorization': \`Bearer \${API_TOKEN}\`,
          'Content-Type': 'application/json'
        }
      });
      
      const keyValueData = await keyValueResponse.json();
      console.log('Database URL retrieved successfully');
      return keyValueData.key.value;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Use it
const databaseUrl = await getDatabaseUrl();`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Endpoints</h3>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Create a Key</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`POST /api/keys
Content-Type: application/json

{
  "name": "Database Password",
  "value": "secret-password",
  "type": "PASSWORD",
  "folderId": "folder-id",
  "description": "Production database password"
}`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">List Keys</h4>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <code className="text-green-600 text-sm">GET /api/keys?folderId=folder-id</code>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Get Key Value</h4>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <code className="text-green-600 text-sm">GET /api/keys/{'{keyId}'}?includeValue=true</code>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Update Key</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`PUT /api/keys/{keyId}
Content-Type: application/json

{
  "name": "Updated Name",
  "value": "new-secret-value"
}`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Delete Key</h4>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <code className="text-green-600 text-sm">DELETE /api/keys/{'{keyId}'}</code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Folder Endpoints</h3>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Create Folder</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`POST /api/folders
Content-Type: application/json

{
  "name": "Production",
  "description": "Production environment secrets",
  "color": "#ff0000"
}`}</code>
      </pre>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">List Folders</h4>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <code className="text-green-600 text-sm">GET /api/folders</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Authentication Section */}
          <section id="authentication" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Authentication</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Getting Your API Token</h3>
                <ol className="space-y-2 text-gray-600 ml-6">
                  <li>1. Log in to your Key Vault account</li>
                  <li>2. Navigate to the &quot;API&quot; page</li>
                  <li>3. Copy your API token</li>
                  <li>4. Use this token in your SDK or API requests</li>
                </ol>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Token Security</h3>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li>• Keep your API token secure and never expose it in client-side code</li>
                  <li>• Store tokens in environment variables</li>
                  <li>• Rotate tokens regularly for security</li>
                  <li>• Never commit tokens to version control</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Security</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Encryption</h3>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li>• All secret values are encrypted using AES-256-GCM</li>
                  <li>• Each encryption uses a unique salt and IV</li>
                  <li>• Master encryption key is stored securely</li>
      </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Access Control</h3>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li>• Users can only access their own secrets</li>
                  <li>• Admin users have additional privileges</li>
                  <li>• Complete audit logging for compliance</li>
      </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h3>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li>• Never log secret values</li>
                  <li>• Use environment variables for configuration</li>
                  <li>• Handle errors gracefully without exposing sensitive information</li>
                  <li>• Regularly rotate API tokens</li>
      </ul>
              </div>
            </div>
          </section>

          {/* Plans Section */}
          <section id="plans" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Subscription Plans</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Free Plan</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 1 project (folder)</li>
                  <li>• 5 secrets</li>
                  <li>• SDK access</li>
                  <li>• Basic UI dashboard</li>
                  <li>• Community support</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pro Plan ($9/month)</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 3 projects</li>
                  <li>• 100 secrets</li>
                  <li>• Audit logs</li>
                  <li>• Expiring secrets</li>
                  <li>• API analytics</li>
                  <li>• Email support</li>
      </ul>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Team Plan ($29/month)</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Unlimited projects</li>
                  <li>• 1,000+ secrets</li>
                  <li>• Team members</li>
                  <li>• RBAC (roles & permissions)</li>
                  <li>• SDK token rotation</li>
                  <li>• Priority support</li>
      </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">FAQ</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I get my API token?</h3>
                <p className="text-gray-600">Log in to the Key Vault web platform and navigate to the &quot;API&quot; page to copy your API token.</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I create or delete keys with the SDK?</h3>
                <p className="text-gray-600">No, the SDK is read-only for security. Use the web platform or REST API for key management.</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What happens if I reach my plan limits?</h3>
                <p className="text-gray-600">You&apos;ll see warnings in the UI and API calls will be rejected. Upgrade your plan to continue.</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Is the SDK open source?</h3>
                <p className="text-gray-600">Yes! You can view and contribute to the SDK on our GitHub repository.</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How secure is the encryption?</h3>
                <p className="text-gray-600">We use AES-256-GCM encryption with unique salts and IVs for each secret. The encryption key is stored securely and never exposed.</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Does the SDK support CommonJS?</h3>
                <p className="text-gray-600">Yes! The SDK supports both ES Modules and CommonJS. It automatically detects your module system and provides the appropriate format.</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I use the SDK in the browser?</h3>
                <p className="text-gray-600">Yes, the SDK works in both Node.js and browser environments.</p>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Support</h2>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <p className="text-gray-600">
                Need help? Check out our GitHub repository for issues and feature requests, 
                or contact us through the support channels available in your plan.
              </p>
            </div>
          </section>

          {/* License Section */}
          <section className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">License</h2>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <p className="text-gray-600">MIT License - see LICENSE file for details.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 