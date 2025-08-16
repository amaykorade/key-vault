'use client'

import React from 'react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Vault Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to the API Vault documentation. This guide covers everything you need to know about using API Vault for secure secret management.
          </p>
          
          {/* SDK Installation Banner */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold mb-2">🚀 Official SDKs Now Available!</h3>
            <p className="text-blue-100 mb-4">Both JavaScript and Python SDKs are now published and ready to use:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <code className="text-white font-mono">npm install amay-key-vault-sdk</code>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <code className="text-white font-mono">pip install amay-key-vault-sdk</code>
              </div>
            </div>
            <p className="text-blue-100 mt-3 text-sm">
              <strong>New in v1.0.4:</strong> Function-based key access with simple function calls instead of building URLs
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg p-6 mb-12 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <a href="#sdk" className="text-slate-600 hover:text-slate-500 hover:underline">JavaScript SDK</a>
              <a href="#python-sdk" className="text-slate-600 hover:text-slate-500 hover:underline">Python SDK</a>
              <a href="#api" className="text-slate-600 hover:text-slate-500 hover:underline">REST API & Function-Based Access</a>
              <a href="#packages" className="text-slate-600 hover:text-slate-500 hover:underline">📦 Package Information</a>
              <a href="#authentication" className="text-slate-600 hover:text-slate-500 hover:underline">Authentication</a>
              <a href="#security" className="text-slate-600 hover:text-slate-500 hover:underline">Security</a>
              <a href="#expiration" className="text-slate-600 hover:text-slate-500 hover:underline">⏰ Key Expiration</a>
              <a href="#plans" className="text-slate-600 hover:text-slate-500 hover:underline">Subscription Plans</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-500 hover:underline">FAQ</a>
              <a href="#summary" className="text-slate-600 hover:text-slate-500 hover:underline">🎯 Summary</a>
            </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* SDK Section */}
          <section id="sdk" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">JavaScript SDK</h2>
            <p className="text-lg text-gray-600 mb-8">
              The API Vault SDK allows you to securely access your vault keys from JavaScript/TypeScript projects. 
              <strong className="text-red-600"> This SDK is read-only</strong>: key creation, update, and deletion must be performed via the API Vault web platform.
              <br /><br />
              <strong className="text-green-600">✅ Supports both ES Modules and CommonJS</strong> - works in any JavaScript environment!
              <br /><br />
              <strong className="text-blue-600">🆕 v1.0.4+ includes function-based access</strong> - access keys using simple function calls instead of building URLs!
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Installation</h3>
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <code className="text-green-600 text-sm">npm install amay-key-vault-sdk</code>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  📦 <a href="https://npmjs.com/package/amay-key-vault-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on npm</a>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Get Your API Token</h4>
                    <ol className="space-y-2 text-gray-600 ml-6">
                      <li>1. Login to your API Vault application</li>
                      <li>2. Navigate to the &quot;API&quot; page</li>
                      <li>3. Copy your API token (starts with <code className="bg-gray-200 px-1 rounded text-gray-800">tok_</code>)</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Initialize the SDK</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">ES Modules (v1.0.4+ Recommended)</h5>
                        <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                          <pre className="text-green-600 text-sm">
                            <code>{`import { KeyVault } from 'amay-key-vault-sdk';

// Simplified constructor
const kv = new KeyVault('your-api-token', 'https://yourdomain.com');`}</code>
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">CommonJS (v1.0.4+)</h5>
                        <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                          <pre className="text-green-600 text-sm">
                            <code>{`const { KeyVault } = require('amay-key-vault-sdk');

// Simplified constructor
const kv = new KeyVault('your-api-token', 'https://yourdomain.com');`}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Retrieve Secrets</h4>
                    

                    

                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">API Reference</h3>
                
                <div className="space-y-6">

                  
                  {/* Legacy Constructor */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">new KeyVault(apiToken, baseUrl)</code> (v1.0.4+)
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>apiToken</strong> (string): Your API token from the dashboard</li>
                      <li><strong>baseUrl</strong> (string): Base URL of your Key Vault instance</li>
                    </ul>
                  </div>
                  

                </div>
              </div>


            </div>
          </section>

          {/* Python SDK Section */}
          <section id="python-sdk" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Python SDK</h2>
            <p className="text-lg text-gray-600 mb-8">
              The API Vault Python SDK allows you to securely access your vault keys from Python applications. 
              <strong className="text-red-600"> This SDK is read-only</strong>: key creation, update, and deletion must be performed via the API Vault web platform.
              <br /><br />
              <strong className="text-green-600">✅ Latest Version: v1.0.4</strong> - Now includes function-based access and simplified constructor!
              <br /><br />
              <strong className="text-blue-600">🆕 v1.0.4+ includes function-based access</strong> - access keys using simple function calls instead of building URLs!
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Installation</h3>
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <code className="text-green-600 text-sm">pip install amay-key-vault-sdk</code>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  📦 <a href="https://pypi.org/project/amay-key-vault-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on PyPI</a>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Get Your API Token</h4>
                    <ol className="space-y-2 text-gray-600 ml-6">
                      <li>1. Login to your API Vault application</li>
                      <li>2. Navigate to the &quot;API&quot; page</li>
                      <li>3. Copy your API token</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Initialize the SDK</h4>
                    <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border border-gray-200">
                      <pre className="text-green-600 text-sm">
                        <code>{`from key_vault_sdk import KeyVault

# Initialize the SDK (v1.0.4+)
kv = KeyVault('your-api-token-here', 'https://yourdomain.com')`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Retrieve Secrets</h4>
                    

                    

                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">API Reference</h3>
                
                <div className="space-y-6">

                  
                  {/* New Constructor */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">KeyVault(token, base_url, timeout=30)</code> (v1.0.4+)
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>token</strong> (str): Your API token from the dashboard</li>
                      <li><strong>base_url</strong> (str): Base URL of your Key Vault instance</li>
                      <li><strong>timeout</strong> (int, optional): Request timeout in seconds</li>
                    </ul>
                  </div>
                  



                </div>
              </div>


            </div>
          </section>

          {/* Package Information Section */}
          <section id="packages" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">📦 Package Information</h2>
            <p className="text-lg text-gray-600 mb-8">
              Both JavaScript and Python SDKs are now officially published and available on their respective package registries.
              <br /><br />
              <strong className="text-blue-600">🆕 New Function-Based Approach:</strong> Use simple function calls instead of building URLs manually!
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">JavaScript/Node.js SDK</h3>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">amay-key-vault-sdk</h4>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">v1.0.4</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">📦 Registry:</span>
                      <a href="https://npmjs.com/package/amay-key-vault-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">npmjs.com</a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">🔧 Install:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm install amay-key-vault-sdk</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">📁 Size:</span>
                      <span className="text-gray-800">17.6 kB (compressed), 108.8 kB (unpacked)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">🔄 Formats:</span>
                      <span className="text-gray-800">ESM (.mjs) and CommonJS (.cjs)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Python SDK</h3>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">amay-key-vault-sdk</h4>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">v1.0.4</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">📦 Registry:</span>
                      <a href="https://pypi.org/project/amay-key-vault-sdk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">pypi.org</a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">🔧 Install:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">pip install amay-key-vault-sdk</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">📁 Size:</span>
                      <span className="text-gray-800">10.5 kB (wheel), 9.8 kB (source)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">🐍 Python:</span>
                      <span className="text-gray-800">3.7+ compatibility</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">🆕 What&apos;s New in v1.0.4</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>Function-based access:</strong> Use simple function calls instead of building URLs manually</li>
                  <li>• <strong>Simplified constructors:</strong> <code className="bg-blue-200 px-1 rounded">new KeyVault(token, baseUrl)</code> and <code className="bg-blue-200 px-1 rounded">KeyVault(token, base_url)</code></li>
                  <li>• <strong>Environment filtering:</strong> Easy access to keys by environment (dev/staging/prod)</li>
                  <li>• <strong>Cross-language support:</strong> Same approach works in JavaScript, Python, and PHP</li>
                  <li>• <strong>Official publication:</strong> Both packages now available on npm and PyPI</li>
                </ul>
              </div>
            </div>
          </section>

          {/* API Section */}
          <section id="api" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">REST API & Function-Based Access</h2>
            <p className="text-lg text-gray-600 mb-8">
              The Key Vault REST API provides full programmatic access to your secrets. All endpoints require authentication.
              <br /><br />
              <strong className="text-blue-600">🆕 New Function-Based Approach:</strong> Use simple function calls instead of building URLs manually!
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">🆕 Function-Based Access (Recommended)</h3>
                <p className="text-gray-600 mb-6">
                  Instead of building URLs manually, use these simple function classes to access your keys with any path depth!
                  <br /><br />
                  <strong className="text-red-600">🔒 Security Update:</strong> Environment parameter is now <strong>MANDATORY</strong> for key access to prevent security risks and ensure proper environment isolation.
                </p>
                
                <div className="space-y-8">
                  {/* JavaScript Function-Based Approach */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-blue-900 mb-4">JavaScript/Node.js</h4>
                    <div className="bg-blue-100 rounded-lg p-4 overflow-x-auto border border-blue-200">
                      <pre className="text-blue-800 text-sm">
                        <code>{`class KeyVaultClient {
  constructor(apiToken, baseUrl = 'https://apivault.it.com') {
    this.apiToken = apiToken;
    this.baseUrl = baseUrl;
  }

  async getKey(path, environment) {
    // Environment is now mandatory for key access
    if (!environment) {
      throw new Error('Environment parameter is required for key access. This prevents accessing the wrong environment (e.g., production DB credentials in development).');
    }

    const url = \`\${this.baseUrl}/api/access?path=\${path}&environment=\${environment}\`;
    
    const response = await fetch(url, {
      headers: { "Authorization": \`Bearer \${this.apiToken}\` }
    });
    const data = await response.json();
    
    if (data.success && data.type === 'key') {
      return data.key.value;
    } else {
      throw new Error(data.message || 'Key not found');
    }
  }

  async getFolder(path, environment = null) {
    const url = environment 
      ? \`\${this.baseUrl}/api/access?path=\${path}&environment=\${environment}\`
      : \`\${this.baseUrl}/api/access?path=\${path}\`;
    
    const response = await fetch(url, {
      headers: { "Authorization": \`Bearer \${this.apiToken}\` }
    });
    return response.json();
  }
}

// Usage:
const vault = new KeyVaultClient('YOUR_API_TOKEN');

// ✅ Get specific key (environment is now MANDATORY)
const dbUrl = await vault.getKey('Webmeter/Database/DB_URL', 'DEVELOPMENT');
const apiKey = await vault.getKey('MyApp/Production/API_KEY', 'PRODUCTION');

// ✅ Get folder contents
const folderData = await vault.getFolder('Webmeter/Database');

// ✅ Browse project structure
const projectData = await vault.getFolder('Webmeter');`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Python Function-Based Approach */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-green-900 mb-4">Python</h4>
                    <div className="bg-green-100 rounded-lg p-4 overflow-x-auto border border-green-200">
                      <pre className="text-green-800 text-sm">
                        <code>{`import requests

class KeyVaultClient:
    def __init__(self, api_token, base_url='https://apivault.it.com'):
        self.api_token = api_token
        self.base_url = base_url
    
    def get_key(self, path, environment):
        # Environment is now mandatory for key access
        if not environment:
            raise ValueError('Environment parameter is required for key access. This prevents accessing the wrong environment (e.g., production DB credentials in development).')
            
        params = {"path": path, "environment": environment}
        
        response = requests.get(
            f"{self.base_url}/api/access",
            params=params,
            headers={"Authorization": f"Bearer {self.api_token}"}
        )
        data = response.json()
        return data["key"]["value"]
    
    def get_folder(self, path, environment=None):
        params = {"path": path}
        if environment:
            params["environment"] = environment
            
        response = requests.get(
            f"{self.base_url}/api/access",
            params=params,
            headers={"Authorization": f"Bearer {self.api_token}"}
        )
        return response.json()

# Usage:
vault = KeyVaultClient('YOUR_API_TOKEN')

# ✅ Get specific key (environment is now MANDATORY)
db_url = vault.get_key('Webmeter/Database/DB_URL', 'DEVELOPMENT')
api_key = vault.get_key('MyApp/Production/API_KEY', 'PRODUCTION')

# ✅ Get folder contents
folder_data = vault.get_folder('Webmeter/Database')

# ✅ Browse project structure
project_data = vault.get_folder('Webmeter')`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* PHP Function-Based Approach */}
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200 shadow-sm">
                    <h4 className="text-xl font-semibold text-purple-900 mb-4">PHP</h4>
                    <div className="bg-purple-100 rounded-lg p-4 overflow-x-auto border border-purple-200">
                      <pre className="text-purple-800 text-sm">
                        <code>{`class KeyVaultClient {
    private $apiToken;
    private $baseUrl;
    
    public function __construct($apiToken, $baseUrl = 'https://apivault.it.com') {
        $this->apiToken = $apiToken;
        $this->baseUrl = $baseUrl;
    }
    
    public function getKey($path, $environment) {
        // Environment is now mandatory for key access
        if (!$environment) {
            throw new Exception('Environment parameter is required for key access. This prevents accessing the wrong environment (e.g., production DB credentials in development).');
        }
        
        $url = $this->baseUrl . "/api/access?path=" . urlencode($path) . "&environment=" . urlencode($environment);
        
        $response = file_get_contents($url, false, stream_context_create([
            'http' => [
                'header' => "Authorization: Bearer {$this->apiToken}\\r\\n"
            ]
        ]));
        
        $data = json_decode($response, true);
        return $data['key']['value'];
    }
    
    public function getFolder($path, $environment = null) {
        $url = $this->baseUrl . "/api/access?path=" . urlencode($path);
        if ($environment) {
            $url .= "&environment=" . urlencode($environment);
        }
        
        $response = file_get_contents($url, false, stream_context_create([
            'http' => [
                'header' => "Authorization: Bearer {$this->apiToken}\\r\\n"
            ]
        ]));
        
        return json_decode($response, true);
    }
}

// Usage:
$vault = new KeyVaultClient('YOUR_API_TOKEN');

// ✅ Get specific key (environment is now MANDATORY)
$dbUrl = $vault->getKey('Webmeter/Database/DB_URL', 'DEVELOPMENT');
$apiKey = $vault->getKey('MyApp/Production/API_KEY', 'PRODUCTION');

// ✅ Get folder contents
$folderData = $vault->getFolder('Webmeter/Database');

// ✅ Browse project structure
$projectData = $vault->getFolder('Webmeter');`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                    <h4 className="text-xl font-semibold text-yellow-900 mb-4">🎯 Key Benefits</h4>
                    <ul className="space-y-2 text-yellow-800">
                      <li>• <strong>No URL building:</strong> Just call functions with path names</li>
                      <li>• <strong>Any path depth:</strong> Works with 2 levels (Project/Key) or 10+ levels</li>
                      <li>• <strong>Environment filtering:</strong> Easy access to dev/staging/prod keys</li>
                      <li>• <strong>Simple error handling:</strong> Clear error messages if keys don&apos;t exist</li>
                      <li>• <strong>Cross-language:</strong> Same approach works in JavaScript, Python, PHP</li>
                    </ul>
                  </div>

                  {/* Security Requirements */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                    <h4 className="text-xl font-semibold text-red-900 mb-4">🔒 Security Requirements</h4>
                    <div className="space-y-4 text-red-800">
                      <div>
                        <h5 className="text-lg font-semibold text-red-800 mb-2">⚠️ Environment Parameter is MANDATORY for Key Access</h5>
                        <p className="mb-3">To prevent security risks and ensure proper environment isolation, the <code className="bg-red-200 px-1 rounded">environment</code> parameter is now <strong>REQUIRED</strong> when accessing specific keys.</p>
                        
                        <div className="bg-red-100 rounded p-4 border border-red-200">
                          <h6 className="text-md font-semibold text-red-800 mb-2">Why This is Required:</h6>
                          <ul className="space-y-1 text-red-700 text-sm">
                            <li>• <strong>Prevents accidental access</strong> to production credentials in development</li>
                            <li>• <strong>Ensures environment isolation</strong> - no more ambiguous key access</li>
                            <li>• <strong>Security best practice</strong> for multi-environment deployments</li>
                            <li>• <strong>Clear audit trail</strong> of which environment was accessed</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-lg font-semibold text-red-800 mb-2">✅ What Still Works Without Environment:</h5>
                        <ul className="space-y-1 text-red-700 text-sm">
                          <li>• <strong>Project browsing:</strong> <code className="bg-red-200 px-1 rounded">vault.getFolder(&apos;Webmeter&apos;)</code></li>
                          <li>• <strong>Folder browsing:</strong> <code className="bg-red-200 px-1 rounded">vault.getFolder(&apos;Webmeter/Database&apos;)</code></li>
                          <li>• <strong>Structure discovery:</strong> See available keys and folders</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-lg font-semibold text-red-800 mb-2">❌ What Requires Environment:</h5>
                        <ul className="space-y-1 text-red-700 text-sm">
                          <li>• <strong>Key access:</strong> <code className="bg-red-200 px-1 rounded">vault.getKey(&apos;Webmeter/Database/DB_URL&apos;, &apos;DEVELOPMENT&apos;)</code></li>
                          <li>• <strong>Decrypted values:</strong> Getting actual key values requires environment</li>
                          <li>• <strong>Environment-specific operations:</strong> All key retrieval operations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Environment Parameter Quick Reference */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
                    <h4 className="text-xl font-semibold text-cyan-900 mb-4">🔧 Environment Parameter Quick Reference</h4>
                    <p className="text-cyan-800 mb-4">
                      <strong className="text-red-600">🔒 getKey() requires environment parameter (mandatory)</strong><br />
                      <strong className="text-green-600">✅ getFolder() environment parameter is optional</strong><br />
                      The second parameter filters results by environment:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-cyan-100 rounded p-4 border border-cyan-200">
                        <h5 className="text-lg font-semibold text-cyan-800 mb-2">Method Signature</h5>
                        <div className="space-y-2 text-cyan-700">
                          <div><code className="bg-cyan-200 px-2 py-1 rounded">getKey(path, environment)</code> - Get a specific key <strong className="text-red-600">(REQUIRED)</strong></div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded">getFolder(path, environment?)</code> - Get folder contents <strong className="text-green-600">(OPTIONAL)</strong></div>
                        </div>
                      </div>
                      
                      <div className="bg-cyan-100 rounded p-4 border border-cyan-200">
                        <h5 className="text-lg font-semibold text-cyan-800 mb-2">Environment Values</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-cyan-700">
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">&apos;production&apos;</code></div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">&apos;staging&apos;</code></div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">&apos;development&apos;</code></div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">&apos;testing&apos;</code></div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">null</code> (all environments)</div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">undefined</code> (all environments)</div>
                        </div>
                      </div>
                      
                      <div className="bg-cyan-100 rounded p-4 border border-cyan-200">
                        <h5 className="text-lg font-semibold text-cyan-800 mb-2">Usage Examples</h5>
                        <div className="space-y-2 text-cyan-700">
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">vault.getKey(&apos;Project/Key&apos;, &apos;production&apos;)</code> - Get key from production <strong className="text-red-600">(REQUIRED)</strong></div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">vault.getKey(&apos;Project/Key&apos;, &apos;development&apos;)</code> - Get key from development <strong className="text-red-600">(REQUIRED)</strong></div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">vault.getFolder(&apos;Project/Folder&apos;)</code> - Get folder contents from all environments</div>
                          <div><code className="bg-cyan-200 px-2 py-1 rounded text-xs">vault.getFolder(&apos;Project/Folder&apos;, &apos;development&apos;)</code> - Get folder contents only from development</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real Examples */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
                    <h4 className="text-xl font-semibold text-indigo-900 mb-4">💡 Real-World Examples</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-lg font-semibold text-indigo-800 mb-2">Database Connection</h5>
                        <div className="bg-indigo-100 rounded p-3">
                          <code className="text-indigo-800 text-sm">const dbUrl = await vault.getKey(&apos;Webmeter/Database/DB_URL&apos;, &apos;production&apos;);</code>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-indigo-800 mb-2">API Keys</h5>
                        <div className="bg-indigo-100 rounded p-3">
                          <code className="text-indigo-800 text-sm">const stripeKey = await vault.getKey(&apos;Ecommerce/Stripe/SecretKey&apos;, &apos;production&apos;);</code>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-indigo-800 mb-2">Environment-Specific Config</h5>
                        <div className="bg-indigo-100 rounded p-3">
                          <code className="text-indigo-800 text-sm">const config = await vault.getFolder(&apos;MyApp/Config&apos;, process.env.NODE_ENV);</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environment Filtering Examples */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                    <h4 className="text-xl font-semibold text-emerald-900 mb-4">🌍 Environment Filtering Examples</h4>
                    <p className="text-emerald-800 mb-4">Filter keys by environment (development, staging, production) to get the right configuration for each environment.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-lg font-semibold text-emerald-800 mb-3">JavaScript/Node.js</h5>
                        <div className="bg-emerald-100 rounded p-4 overflow-x-auto border border-emerald-200">
                          <pre className="text-emerald-800 text-sm">
                            <code>{`// Get production database URL
const prodDbUrl = await vault.getKey('Webmeter/Database/DB_URL', 'production');

// Get development database URL  
const devDbUrl = await vault.getKey('Webmeter/Database/DB_URL', 'development');

// Get staging database URL
const stagingDbUrl = await vault.getKey('Webmeter/Database/DB_URL', 'staging');

// Get all production keys in a folder
const prodKeys = await vault.getFolder('Webmeter/Database', 'production');

// Get all development keys in a folder
const devKeys = await vault.getFolder('Webmeter/Database', 'development');

// Dynamic environment based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
const dbUrl = await vault.getKey('Webmeter/Database/DB_URL', environment);

// Environment-specific configuration
const config = {
  production: await vault.getFolder('MyApp/Config', 'production'),
  staging: await vault.getFolder('MyApp/Config', 'staging'),
  development: await vault.getFolder('MyApp/Config', 'development')
};`}</code>
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-lg font-semibold text-emerald-800 mb-3">Python</h5>
                        <div className="bg-emerald-100 rounded p-4 overflow-x-auto border border-emerald-200">
                          <pre className="text-emerald-800 text-sm">
                            <code>{`# Get production database URL
prod_db_url = vault.get_key('Webmeter/Database/DB_URL', 'production')

# Get development database URL
dev_db_url = vault.get_key('Webmeter/Database/DB_URL', 'development')

# Get staging database URL
staging_db_url = vault.get_key('Webmeter/Database/Database/DB_URL', 'staging')

# Get all production keys in a folder
prod_keys = vault.get_folder('Webmeter/Database', 'production')

# Get all development keys in a folder
dev_keys = vault.get_folder('Webmeter/Database', 'development')

# Dynamic environment based on environment variable
import os
environment = os.getenv('ENVIRONMENT', 'development')
db_url = vault.get_key('Webmeter/Database/DB_URL', environment)

# Environment-specific configuration
configs = {
    'production': vault.get_folder('MyApp/Config', 'production'),
    'staging': vault.get_folder('MyApp/Config', 'staging'),
    'development': vault.get_folder('MyApp/Config', 'development')
}`}</code>
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-lg font-semibold text-emerald-800 mb-3">PHP</h5>
                        <div className="bg-emerald-100 rounded p-4 overflow-x-auto border border-emerald-200">
                          <pre className="text-emerald-800 text-sm">
                            <code>{`// Get production database URL
$prodDbUrl = $vault->getKey('Webmeter/Database/DB_URL', 'production');

// Get development database URL
$devDbUrl = $vault->getKey('Webmeter/Database/DB_URL', 'development');

// Get staging database URL
$stagingDbUrl = $vault->getKey('Webmeter/Database/DB_URL', 'staging');

// Get all production keys in a folder
$prodKeys = $vault->getFolder('Webmeter/Database', 'production');

// Get all development keys in a folder
$devKeys = $vault->getFolder('Webmeter/Database', 'development');

// Dynamic environment based on environment variable
$environment = $_ENV['ENVIRONMENT'] ?? 'development';
$dbUrl = $vault->getKey('Webmeter/Database/DB_URL', $environment);

// Environment-specific configuration
$configs = [
    'production' => $vault->getFolder('MyApp/Config', 'production'),
    'staging' => $vault->getFolder('MyApp/Config', 'staging'),
    'development' => $vault->getFolder('MyApp/Config', 'development')
];`}</code>
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-lg font-semibold text-emerald-800 mb-3">Common Environment Names</h5>
                        <div className="bg-emerald-100 rounded p-4 border border-emerald-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="text-center">
                              <div className="bg-red-200 text-red-800 px-3 py-2 rounded font-mono text-sm">production</div>
                              <div className="text-xs text-emerald-700 mt-1">Live environment</div>
                            </div>
                            <div className="text-center">
                              <div className="bg-yellow-200 text-yellow-800 px-3 py-2 rounded font-mono text-sm">staging</div>
                              <div className="text-xs text-emerald-700 mt-1">Pre-production</div>
                            </div>
                            <div className="text-center">
                              <div className="bg-blue-200 text-blue-800 px-3 py-2 rounded font-mono text-sm">development</div>
                              <div className="text-xs text-emerald-700 mt-1">Local development</div>
                            </div>
                            <div className="text-center">
                              <div className="bg-purple-200 text-purple-800 px-3 py-2 rounded font-mono text-sm">testing</div>
                              <div className="text-xs text-emerald-700 mt-1">QA/Testing</div>
                            </div>
                          </div>
                        </div>
                      </div>
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

          {/* Key Expiration Management Section */}
          <section id="expiration" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">⏰ Key Expiration Management</h2>
            <p className="text-lg text-gray-600 mb-8">
              All users can now set expiration dates for their keys to ensure credentials are automatically flagged when they expire.
              This helps maintain security by providing clear visibility into which keys need attention.
            </p>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200 shadow-sm">
                <h3 className="text-xl font-semibold text-orange-900 mb-4">🆕 Available for All Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">FREE</div>
                    <div className="text-sm text-orange-700">✅ Expiration dates</div>
                    <div className="text-sm text-orange-700">✅ Visual warnings</div>
                    <div className="text-sm text-orange-700">✅ Dashboard alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">PRO</div>
                    <div className="text-sm text-blue-700">✅ Expiration dates</div>
                    <div className="text-sm text-blue-700">✅ Visual warnings</div>
                    <div className="text-sm text-blue-700">✅ Dashboard alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">TEAM</div>
                    <div className="text-sm text-purple-700">✅ Expiration dates</div>
                    <div className="text-sm text-purple-700">✅ Visual warnings</div>
                    <div className="text-sm text-purple-700">✅ Dashboard alerts</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Set Expiration Date</h4>
                      <p className="text-gray-600">When creating or editing a key, set an optional expiration date and time.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Automatic Warnings</h4>
                      <p className="text-gray-600">The system automatically tracks expiration status and shows visual indicators.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Dashboard Alerts</h4>
                      <p className="text-gray-600">Get notified on your dashboard when keys are expiring or have expired.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🚨 Warning Levels</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-semibold text-red-700">EXPIRED</span>
                    <span className="text-gray-600">Keys that have already expired (immediate action required)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-semibold text-yellow-700">CRITICAL</span>
                    <span className="text-gray-600">Expiring within 7 days (urgent attention needed)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-orange-700">WARNING</span>
                    <span className="text-gray-600">Expiring within 30 days (plan for renewal)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-700">SAFE</span>
                    <span className="text-gray-600">More than 30 days until expiration</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">💻 API Access</h3>
                <p className="text-gray-600 mb-4">Expiration dates are included in all API responses:</p>
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <pre className="text-gray-800 text-sm overflow-x-auto">
                    <code>{`// Key response now includes expiresAt
{
  "success": true,
  "key": {
    "id": "key_123",
    "name": "DB_PASSWORD",
    "value": "decrypted_value",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "environment": "PRODUCTION",
    // ... other fields
  }
}`}</code>
                  </pre>
                </div>
                <p className="text-gray-600 mt-3">
                  Use the <code className="bg-gray-200 px-1 rounded">expiresAt</code> field to programmatically check expiration status in your applications.
                </p>
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

          {/* Summary Section */}
          <section id="summary" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Summary: Why Choose Function-Based Access?</h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-900 mb-4">✅ What We&apos;ve Removed</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• Complex URL building</li>
                    <li>• Folder ID management</li>
                    <li>• Legacy constructor methods</li>
                    <li>• Old path-based access methods</li>
                    <li>• Traditional usage examples</li>
                    <li>• Redundant API documentation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-900 mb-4">🚀 What We&apos;ve Added</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• Simple function calls</li>
                    <li>• Human-readable paths</li>
                    <li>• Environment filtering</li>
                    <li>• Cross-language examples</li>
                    <li>• Real-world use cases</li>
                    <li>• Quick reference guides</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-2">💡 The Result</h4>
                <p className="text-green-800">
                  Users can now access their keys with simple function calls like <code className="bg-green-200 px-2 py-1 rounded">vault.getKey(&apos;Project/Subfolder/KeyName&apos;, &apos;production&apos;)</code> 
                  instead of building complex URLs and managing folder IDs. This makes the API much more user-friendly and accessible!
                </p>
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