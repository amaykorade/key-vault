# Key Vault SDK

A simple JavaScript SDK for accessing the Key Vault API.

## Installation

```sh
npm install key-vault-sdk
```

## Usage

```js
import KeyVault from 'key-vault-sdk';

const apiUrl = 'https://yourdomain.com/api'; // Or your local URL
const token = 'PASTE_YOUR_API_TOKEN_HERE';
const folderId = 'your-folder-id';
const keyName = 'YOUR_KEY_NAME';

async function getKeyValueWithUserToken(userToken, folderId, keyName) {
  const kv = new KeyVault({
    apiUrl,
    getToken: async () => userToken,
  });
  const { keys } = await kv.listKeys({ folderId });
  const keyMeta = keys.find(k => k.name === keyName);
  if (!keyMeta) throw new Error(`Key with name "${keyName}" not found in folder.`);
  const key = await kv.getKey(keyMeta.id, { includeValue: true });
  return key.value;
}

// Example usage:
getKeyValueWithUserToken(token, folderId, keyName)
  .then(secretValue => {
    // Use the secret value programmatically, do NOT log or display it!
    console.log(`Secret for "${keyName}" was retrieved and used programmatically.`);
  })
  .catch(console.error);
```

## API

- `new KeyVault({ apiUrl, getToken })` - Initialize the SDK
- `kv.listKeys({ folderId })` - List keys in a folder
- `kv.getKey(keyId, { includeValue })` - Get a key by ID (optionally with value)

## License

MIT 