# KeyVault SDK (Read-Only)

Easily and securely access your Key Vault keys from your JavaScript/TypeScript projects.

**Note:** This SDK is read-only. Key creation, update, and deletion must be performed via the Key Vault web platform.

---

## Installation

```bash
npm install key-vault-sdk # (if published to npm)
# or use directly from your repo:
# import KeyVault from '../sdk/index.js'
```

## Usage

```js
import KeyVault from 'key-vault-sdk';
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
})();
```

## API

### `new KeyVault({ apiUrl, token })`
- `apiUrl` (string): Base URL of your Key Vault API (e.g., `https://yourdomain.com/api`)
- `token` (string): JWT token for authentication

### `listKeys({ folderId, limit, offset })`
- `folderId` (string, required): Folder to list keys from
- `limit` (number, optional): Number of keys to return (default: 20)
- `offset` (number, optional): Number of keys to skip (default: 0)
- **Returns:** `{ keys, total, limit, offset }`

### `getKey(keyId, { includeValue })`
- `keyId` (string, required): The key's ID
- `includeValue` (boolean, optional): If true, includes the decrypted key value (if authorized)
- **Returns:** `key` object

---

## Security
- This SDK is read-only. All key management (create, update, delete) must be done via the Key Vault platform.
- Always keep your API token secure and never expose it in client-side code.

---

## License
MIT 