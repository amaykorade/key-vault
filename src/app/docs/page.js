'use client'

import React from 'react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-5xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Key Vault Documentation</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Welcome to the Key Vault documentation. This guide covers everything you need to know about using Key Vault for secure secret management.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-700 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#sdk" className="text-blue-400 hover:text-blue-300 hover:underline">JavaScript SDK</a>
            <a href="#api" className="text-blue-400 hover:text-blue-300 hover:underline">REST API</a>
            <a href="#authentication" className="text-blue-400 hover:text-blue-300 hover:underline">Authentication</a>
            <a href="#security" className="text-blue-400 hover:text-blue-300 hover:underline">Security</a>
            <a href="#plans" className="text-blue-400 hover:text-blue-300 hover:underline">Subscription Plans</a>
            <a href="#faq" className="text-blue-400 hover:text-blue-300 hover:underline">FAQ</a>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* SDK Section */}
          <section id="sdk" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-white mb-6">JavaScript SDK</h2>
            <p className="text-lg text-gray-300 mb-8">
              The Key Vault SDK allows you to securely access your vault keys from JavaScript/TypeScript projects. 
              <strong className="text-red-400"> This SDK is read-only</strong>: key creation, update, and deletion must be performed via the Key Vault web platform.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Installation</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-green-400 text-sm">npm install key-vault-sdk</code>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Quick Start</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{`import KeyVault from 'key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'your-api-token-here'
});

// Get a specific secret value
const secretValue = await kv.getKeyValue('folder-id', 'database-password');
console.log('Secret retrieved successfully');`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">API Reference</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">
                      <code className="bg-gray-600 px-2 py-1 rounded text-gray-100">new KeyVault(&#123; apiUrl, getToken &#125;)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li><strong>apiUrl</strong> (string): Base URL of your Key Vault API</li>
                      <li><strong>getToken</strong> (function): Function that returns your API token</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">
                      <code className="bg-gray-600 px-2 py-1 rounded text-gray-100">listKeys(&#123; folderId &#125;)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li><strong>folderId</strong> (string, required): Folder to list keys from</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-600 px-1 rounded text-gray-100">&#123; keys &#125;</code> - Array of key metadata (no values)</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">
                      <code className="bg-gray-600 px-2 py-1 rounded text-gray-100">getKey(keyId, &#123; includeValue &#125;)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li><strong>keyId</strong> (string, required): The key's ID</li>
                      <li><strong>includeValue</strong> (boolean, optional): If true, includes the decrypted key value</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-600 px-1 rounded text-gray-100">key</code> object with metadata and optionally the value</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">
                      <code className="bg-gray-600 px-2 py-1 rounded text-gray-100">getKeyValue(folderId, keyName)</code>
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li><strong>folderId</strong> (string, required): Folder containing the key</li>
                      <li><strong>keyName</strong> (string, required): Name of the key to retrieve</li>
                      <li><strong>Returns:</strong> <code className="bg-gray-600 px-1 rounded text-gray-100">string</code> - The decrypted secret value</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Usage Examples</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Environment-Specific Secrets</h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`const environment = process.env.NODE_ENV || 'development';
const folderId = environment === 'production' ? 'prod-folder' : 'dev-folder';

const secrets = {
  database: await kv.getKeyValue(folderId, 'database-url'),
  apiKey: await kv.getKeyValue(folderId, 'external-api-key'),
  jwtSecret: await kv.getKeyValue(folderId, 'jwt-secret')
};`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Error Handling</h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`try {
  const secret = await kv.getKeyValue('folder-id', 'secret-name');
  // Use secret
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Secret not found');
  } else if (error.message.includes('Unauthorized')) {
    console.error('Invalid API token');
  } else {
    console.error('Failed to retrieve secret:', error.message);
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API Section */}
          <section id="api" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-white mb-6">REST API</h2>
            <p className="text-lg text-gray-300 mb-8">
              The Key Vault REST API provides full programmatic access to your secrets. All endpoints require authentication.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Base URL</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <code className="text-gray-100 font-mono">https://yourdomain.com/api</code>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Authentication</h3>
                <p className="text-gray-300 mb-4">All API requests require authentication via:</p>
                <ul className="space-y-2 text-gray-300 ml-6">
                  <li><strong>Session Cookie</strong>: For web application requests</li>
                  <li><strong>Bearer Token</strong>: For API access (<code className="bg-gray-600 px-1 rounded text-gray-100">Authorization: Bearer &lt;token&gt;</code>)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Key Endpoints</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Create a Key</h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
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

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">List Keys</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">GET /api/keys?folderId=folder-id</code>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Get Key Value</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">GET /api/keys/{'{keyId}'}?includeValue=true</code>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Update Key</h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{`PUT /api/keys/{keyId}
Content-Type: application/json

{
  "name": "Updated Name",
  "value": "new-secret-value"
}`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Delete Key</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">DELETE /api/keys/{'{keyId}'}</code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Folder Endpoints</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Create Folder</h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
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

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-3">List Folders</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">GET /api/folders</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Authentication Section */}
          <section id="authentication" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Getting Your API Token</h3>
                <ol className="space-y-2 text-gray-300 ml-6">
                  <li>1. Log in to your Key Vault account</li>
                  <li>2. Navigate to the <code className="bg-gray-600 px-1 rounded text-gray-100">/api</code> page</li>
                  <li>3. Copy your API token</li>
                  <li>4. Use this token in your SDK or API requests</li>
                </ol>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Token Security</h3>
                <ul className="space-y-2 text-gray-300 ml-6">
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
            <h2 className="text-3xl font-bold text-white mb-6">Security</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Encryption</h3>
                <ul className="space-y-2 text-gray-300 ml-6">
                  <li>• All secret values are encrypted using AES-256-GCM</li>
                  <li>• Each encryption uses a unique salt and IV</li>
                  <li>• Master encryption key is stored securely</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Access Control</h3>
                <ul className="space-y-2 text-gray-300 ml-6">
                  <li>• Users can only access their own secrets</li>
                  <li>• Admin users have additional privileges</li>
                  <li>• Complete audit logging for compliance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Best Practices</h3>
                <ul className="space-y-2 text-gray-300 ml-6">
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
            <h2 className="text-3xl font-bold text-white mb-6">Subscription Plans</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-2xl font-semibold text-white mb-4">Free Plan</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 1 project (folder)</li>
                  <li>• 5 secrets</li>
                  <li>• SDK access</li>
                  <li>• Basic UI dashboard</li>
                  <li>• Community support</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-2xl font-semibold text-white mb-4">Pro Plan ($9/month)</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 3 projects</li>
                  <li>• 100 secrets</li>
                  <li>• Audit logs</li>
                  <li>• Expiring secrets</li>
                  <li>• API analytics</li>
                  <li>• Email support</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-2xl font-semibold text-white mb-4">Team Plan ($29/month)</h3>
                <ul className="space-y-2 text-gray-300">
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
            <h2 className="text-3xl font-bold text-white mb-6">FAQ</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">How do I get my API token?</h3>
                <p className="text-gray-300">Log in to the Key Vault web platform and navigate to the <code className="bg-gray-600 px-1 rounded text-gray-100">/api</code> page to copy your API token.</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Can I create or delete keys with the SDK?</h3>
                <p className="text-gray-300">No, the SDK is read-only for security. Use the web platform or REST API for key management.</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">What happens if I reach my plan limits?</h3>
                <p className="text-gray-300">You'll see warnings in the UI and API calls will be rejected. Upgrade your plan to continue.</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Is the SDK open source?</h3>
                <p className="text-gray-300">Yes! You can view and contribute to the SDK on our GitHub repository.</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">How secure is the encryption?</h3>
                <p className="text-gray-300">We use AES-256-GCM encryption with unique salts and IVs for each secret. The encryption key is stored securely and never exposed.</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Can I use the SDK in the browser?</h3>
                <p className="text-gray-300">Yes, the SDK works in both Node.js and browser environments.</p>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-white mb-6">Support</h2>
            <div className="bg-gray-700 rounded-lg p-6 border border-blue-200">
              <p className="text-gray-300">
                Need help? Check out our GitHub repository for issues and feature requests, 
                or contact us through the support channels available in your plan.
              </p>
            </div>
          </section>

          {/* License Section */}
          <section className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-white mb-6">License</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300">MIT License - see LICENSE file for details.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 