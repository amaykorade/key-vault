'use client'

import React from 'react';

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 prose prose-blue">
      <h1>Key Vault SDK Documentation</h1>
      <p>
        The Key Vault SDK allows you to securely access your vault keys from JavaScript/TypeScript projects. <strong>This SDK is read-only</strong>: key creation, update, and deletion must be performed via the Key Vault web platform.
      </p>

      <h2>Installation</h2>
      <pre>
        <code>{`npm install key-vault-sdk # (if published to npm)
# or use directly from your repo:
# import KeyVault from '../sdk/index.js'`}</code>
      </pre>

      <h2>Usage</h2>
      <pre>
        <code>{`import KeyVault from 'key-vault-sdk';
// or, if using locally:
// import KeyVault from '../sdk/index.js';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api', // Your Key Vault API base URL
  token: 'YOUR_JWT_TOKEN',              // User JWT token
});

// List keys in a folder (paginated)
(async () => {
  try {
    const { keys, total, limit, offset } = await kv.listKeys({
      folderId: 'FOLDER_ID',
      limit: 10,
      offset: 0
    });
    console.log('Keys:', keys);
    console.log('Total:', total);
  } catch (err) {
    console.error('Error listing keys:', err.message);
  }
})();

// Get a key by ID (optionally with decrypted value)
(async () => {
  try {
    const key = await kv.getKey('KEY_ID', { includeValue: true });
    console.log('Key:', key);
  } catch (err) {
    console.error('Error fetching key:', err.message);
  }
})();`}</code>
      </pre>

      <h2>API Reference</h2>
      <h3><code>new KeyVault(&#123; apiUrl, token &#125;)</code></h3>
      <ul>
        <li><strong>apiUrl</strong> (string): Base URL of your Key Vault API (e.g., <code>https://yourdomain.com/api</code>)</li>
        <li><strong>token</strong> (string): JWT token for authentication</li>
      </ul>
      <h3><code>listKeys(&#123; folderId, limit, offset &#125;)</code></h3>
      <ul>
        <li><strong>folderId</strong> (string, required): Folder to list keys from</li>
        <li><strong>limit</strong> (number, optional): Number of keys to return (default: 20)</li>
        <li><strong>offset</strong> (number, optional): Number of keys to skip (default: 0)</li>
        <li><strong>Returns:</strong> <code>&#123; keys, total, limit, offset &#125;</code></li>
      </ul>
      <h3><code>getKey(keyId, &#123; includeValue &#125;)</code></h3>
      <ul>
        <li><strong>keyId</strong> (string, required): The key's ID</li>
        <li><strong>includeValue</strong> (boolean, optional): If true, includes the decrypted key value (if authorized)</li>
        <li><strong>Returns:</strong> <code>key</code> object</li>
      </ul>

      <h2>Security</h2>
      <ul>
        <li>This SDK is <strong>read-only</strong>. All key management (create, update, delete) must be done via the Key Vault platform.</li>
        <li>Always keep your API token secure and never expose it in client-side code.</li>
      </ul>

      <h2>FAQ</h2>
      <ul>
        <li><strong>How do I get my API token?</strong><br />
          Log in to the Key Vault web platform and generate or copy your API token from your account settings.
        </li>
        <li><strong>Can I create or delete keys with the SDK?</strong><br />
          No, the SDK is read-only for security. Use the web platform for key management.
        </li>
        <li><strong>Is the SDK open source?</strong><br />
          Yes! You can view and contribute to the SDK on our GitHub repository.
        </li>
      </ul>

      <h2>License</h2>
      <p>MIT</p>
    </div>
  );
} 