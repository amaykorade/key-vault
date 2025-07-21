import KeyVault from '../../sdk/index.js';

const apiUrl = 'http://localhost:3001/api'; // or your production URL

export async function getKeysWithUserToken(userToken, folderId) {
  const kv = new KeyVault({
    apiUrl,
    getToken: async () => userToken,
  });
  const { keys } = await kv.listKeys({ folderId });
  if (keys.length === 0) return [];
  const keysWithValue = await Promise.all(
    keys.map(async (k) => {
      const fullKey = await kv.getKey(k.id, { includeValue: true });
      return fullKey;
    })
  );
  return keysWithValue;
}

// New: Fetch only the value of a key by name
export async function getKeyValueWithUserToken(userToken, folderId, keyName) {
  const kv = new KeyVault({
    apiUrl,
    getToken: async () => userToken,
  });
  // List keys in the folder (names only, not values)
  const { keys } = await kv.listKeys({ folderId });
  // Find the key with the given name
  const keyMeta = keys.find(k => k.name === keyName);
  if (!keyMeta) {
    throw new Error(`Key with name "${keyName}" not found in folder.`);
  }
  // Fetch the key value
  const key = await kv.getKey(keyMeta.id, { includeValue: true });
  return key.value;
}

// --- Test block for direct execution (ESM safe) ---
// Uncomment to test directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const token = 'tok_cmd22lcix001xohw698khr7v8_sbnje5s95is';
  const folderId = 'cmd73hr5z0005ohqjb0dq6vsx';
  const keyName = 'DB_URL'; // Change to the key name you want to fetch
  getKeyValueWithUserToken(token, folderId, keyName)
    .then(value => {
      console.log(`Value for key "${keyName}":`);
      console.log(value);
    })
    .catch(console.error);
} 