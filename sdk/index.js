/**
 * KeyVault SDK - Read-only access to your Key Vault keys and folders (with automatic token refresh)
 *
 * Usage:
 *   const kv = new KeyVault({ apiUrl, getToken, onAuthError });
 *   const keys = await kv.listKeys({ folderId, limit, offset });
 *   const key = await kv.getKey(keyId, { includeValue });
 *   const folders = await kv.listFolders({ projectId });
 *   const folder = await kv.getFolder(folderId);
 */
export default class KeyVault {
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

  /**
   * List all folders (projects and subfolders)
   * @param {Object} [params]
   * @param {string} [params.projectId] - If provided, only return folders within this project
   * @returns {Promise<{ folders: Array }>} - Array of folders with hierarchical structure
   */
  async listFolders({ projectId } = {}) {
    const url = projectId 
      ? `${this.apiUrl}/folders/tree?projectId=${encodeURIComponent(projectId)}`
      : `${this.apiUrl}/folders/tree`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to list folders');
    }
    return {
      folders: data.folders || []
    };
  }

  /**
   * Get a specific folder with its contents
   * @param {string} folderId - The folder's ID
   * @returns {Promise<Object>} - The folder object with keys and subfolders
   */
  async getFolder(folderId) {
    const url = `${this.apiUrl}/folders/${encodeURIComponent(folderId)}`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch folder');
    }
    return {
      folder: data.folder,
      keys: data.keys || []
    };
  }

  /**
   * List only root folders (projects)
   * @returns {Promise<{ folders: Array }>} - Array of root folders
   */
  async listProjects() {
    const url = `${this.apiUrl}/folders`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to list projects');
    }
    return {
      folders: data.folders || []
    };
  }

  /**
   * Get a key by name from a specific folder
   * @param {string} folderId - The folder's ID
   * @param {string} keyName - The key's name
   * @param {Object} [options]
   * @param {boolean} [options.includeValue=false] - If true, include the decrypted key value
   * @returns {Promise<Object|null>} - The key object or null if not found
   */
  async getKeyByName(folderId, keyName, { includeValue = false } = {}) {
    const { keys } = await this.listKeys({ folderId, limit: 100 });
    const key = keys.find(k => k.name === keyName);
    if (!key) {
      return null;
    }
    return this.getKey(key.id, { includeValue });
  }

  /**
   * Search for keys across all folders
   * @param {Object} params
   * @param {string} params.search - Search term
   * @param {string} [params.type] - Filter by key type
   * @param {boolean} [params.favorite] - Filter by favorite status
   * @param {number} [params.limit=20] - Number of keys to return
   * @param {number} [params.offset=0] - Number of keys to skip
   * @returns {Promise<{ keys: Array, total: number, limit: number, offset: number }>}
   */
  async searchKeys({ search, type, favorite, limit = 20, offset = 0 }) {
    const params = new URLSearchParams({
      search: search,
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    if (type) params.append('type', type);
    if (favorite !== undefined) params.append('favorite', favorite.toString());
    
    const url = `${this.apiUrl}/keys?${params.toString()}`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to search keys');
    }
    return {
      keys: data.keys || [],
      total: data.total || 0,
      limit: data.limit || limit,
      offset: data.offset || offset
    };
  }

  /**
   * Get folder statistics
   * @returns {Promise<Object>} - Statistics about keys and folders
   */
  async getStats() {
    const url = `${this.apiUrl}/stats`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch stats');
    }
    return data.stats || {};
  }
} 