/**
 * KeyVault SDK - Read-only access to your Key Vault keys (with automatic token refresh)
 *
 * Usage:
 *   const kv = new KeyVault({ apiUrl, getToken, onAuthError });
 *   const keys = await kv.listKeys({ folderId, limit, offset });
 *   const key = await kv.getKey(keyId, { includeValue });
 */
class KeyVault {
  /**
   * @param {Object} options
   * @param {string} options.apiUrl - Base URL of the Key Vault API (e.g., https://yourdomain.com/api)
   * @param {function} options.getToken - Async function that returns the latest JWT token
   * @param {function} [options.onAuthError] - Optional async function called on 401 errors (e.g., to refresh token)
   */
  constructor({ apiUrl, getToken, onAuthError }) {
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.getToken = getToken;
    this.onAuthError = onAuthError;
  }

  async _fetchWithAuth(url, options = {}, retry = true) {
    const token = await this.getToken();
    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status === 401 && retry) {
      // Try to refresh token using refresh endpoint
      const refreshRes = await fetch(`${this.apiUrl.replace(/\/api$/, '')}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // send cookies
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.session?.token) {
          // Update token source if possible
          if (typeof this.setToken === 'function') {
            await this.setToken(refreshData.session.token);
          }
          // Retry original request with new token
          return this._fetchWithAuth(url, options, false);
        }
      }
      // If refresh fails, call onAuthError if provided
      if (this.onAuthError) {
        await this.onAuthError();
      }
    }
    return res;
  }

  /**
   * List keys in a folder (paginated)
   * @param {Object} params
   * @param {string} params.folderId - Folder ID to list keys from
   * @param {number} [params.limit=20] - Number of keys to return
   * @param {number} [params.offset=0] - Number of keys to skip
   * @returns {Promise<{ keys: Array, total: number, limit: number, offset: number }>}
   */
  async listKeys({ folderId, limit = 20, offset = 0 }) {
    const url = `${this.apiUrl}/keys?folderId=${encodeURIComponent(folderId)}&limit=${limit}&offset=${offset}`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.error || 'Failed to list keys');
    }
    return {
      keys: data.keys,
      total: data.total,
      limit: data.limit,
      offset: data.offset
    };
  }

  /**
   * Get a key by ID
   * @param {string} keyId - The key's ID
   * @param {Object} [options]
   * @param {boolean} [options.includeValue=false] - If true, include the decrypted key value
   * @returns {Promise<Object>} - The key object
   */
  async getKey(keyId, { includeValue = false } = {}) {
    const url = `${this.apiUrl}/keys/${encodeURIComponent(keyId)}?includeValue=${includeValue}`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.error || 'Failed to fetch key');
    }
    return data.key;
  }
}

export { KeyVault as default };
//# sourceMappingURL=index.mjs.map
