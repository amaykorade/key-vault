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
    this.permissions = null; // Cache for user permissions
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

  // RBAC Methods

  /**
   * Load user permissions from the server
   * @returns {Promise<Array>} - Array of permission strings
   */
  async loadPermissions() {
    try {
      const url = `${this.apiUrl}/auth/permissions`;
      const res = await this._fetchWithAuth(url);
      const data = await res.json();
      
      if (res.ok && data.permissions) {
        this.permissions = new Set(data.permissions);
        return Array.from(this.permissions);
      } else {
        this.permissions = new Set();
        return [];
      }
    } catch (error) {
      console.warn('Failed to load permissions:', error.message);
      this.permissions = new Set();
      return [];
    }
  }

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check (e.g., 'keys:read')
   * @returns {Promise<boolean>} - True if user has permission
   */
  async hasPermission(permission) {
    if (!this.permissions) {
      await this.loadPermissions();
    }
    return this.permissions.has(permission) || this.permissions.has('*');
  }

  /**
   * Check if user has any of the specified permissions
   * @param {Array<string>} permissions - Array of permissions to check
   * @returns {Promise<boolean>} - True if user has any of the permissions
   */
  async hasAnyPermission(permissions) {
    if (!this.permissions) {
      await this.loadPermissions();
    }
    return permissions.some(p => this.permissions.has(p) || this.permissions.has('*'));
  }

  /**
   * Check if user has all of the specified permissions
   * @param {Array<string>} permissions - Array of permissions to check
   * @returns {Promise<boolean>} - True if user has all permissions
   */
  async hasAllPermissions(permissions) {
    if (!this.permissions) {
      await this.loadPermissions();
    }
    return permissions.every(p => this.permissions.has(p) || this.permissions.has('*'));
  }

  /**
   * Get user's current permissions
   * @returns {Promise<Array>} - Array of permission strings
   */
  async getPermissions() {
    if (!this.permissions) {
      await this.loadPermissions();
    }
    return Array.from(this.permissions);
  }

  /**
   * Get user's roles
   * @returns {Promise<Array>} - Array of role objects
   */
  async getRoles() {
    const url = `${this.apiUrl}/auth/roles`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch roles');
    }
    
    return data.roles || [];
  }

  /**
   * Enhanced listKeys with RBAC permission check
   * @param {Object} params
   * @param {string} params.folderId - Folder ID to list keys from
   * @param {number} [params.limit=20] - Number of keys to return
   * @param {number} [params.offset=0] - Number of keys to skip
   * @returns {Promise<{ keys: Array, total: number, limit: number, offset: number }>}
   */
  async listKeys({ folderId, limit = 20, offset = 0 }) {
    // Check permission before making request
    if (!(await this.hasPermission('keys:read'))) {
      throw new Error('Insufficient permissions: keys:read required');
    }

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
   * Enhanced getKey with RBAC permission check
   * @param {string} keyId - The key's ID
   * @param {Object} [options]
   * @param {boolean} [options.includeValue=false] - If true, include the decrypted key value
   * @returns {Promise<Object>} - The key object
   */
  async getKey(keyId, { includeValue = false } = {}) {
    // Check permission before making request
    if (!(await this.hasPermission('keys:read'))) {
      throw new Error('Insufficient permissions: keys:read required');
    }

    const url = `${this.apiUrl}/keys/${encodeURIComponent(keyId)}?includeValue=${includeValue}`;
    const res = await this._fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.error || 'Failed to fetch key');
    }
    return data.key;
  }

  /**
   * Enhanced getFolder with RBAC permission check
   * @param {string} folderId - The folder's ID
   * @returns {Promise<Object>} - The folder object with keys and subfolders
   */
  async getFolder(folderId) {
    // Check permission before making request
    if (!(await this.hasPermission('folders:read'))) {
      throw new Error('Insufficient permissions: folders:read required');
    }

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
   * Get keys by path (most user-friendly method)
   * @param {string} path - Path like 'ProjectName/Subfolder' or 'ProjectName'
   * @param {Object} [options]
   * @param {string} [options.environment] - Filter by environment (DEVELOPMENT, STAGING, PRODUCTION, etc.)
   * @param {number} [options.limit=100] - Number of keys to return
   * @param {number} [options.offset=0] - Number of keys to skip
   * @returns {Promise<{ keys: Array, total: number, folder: Object }>}
   */
  async getKeysByPath(path, options = {}) {
    const { environment, limit = 100, offset = 0 } = options;
    
    try {
      // Parse the path and find the target folder
      const targetFolder = await this._resolvePathToFolder(path);
      
      if (!targetFolder) {
        throw new Error(`Path not found: ${path}`);
      }

      // Build query parameters
      const params = new URLSearchParams({
        folderId: targetFolder.id,
        limit: limit.toString(),
        offset: offset.toString()
      });
      
      if (environment) {
        params.append('environment', environment.toUpperCase());
      }

      // Fetch keys from the resolved folder
      const url = `${this.apiUrl}/keys?${params.toString()}`;
      const res = await this._fetchWithAuth(url);
      const data = await res.json();
      
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Failed to fetch keys');
      }

      return {
        keys: data.keys || [],
        total: data.total || 0,
        folder: targetFolder,
        path: path
      };

    } catch (error) {
      throw new Error(`Failed to get keys by path '${path}': ${error.message}`);
    }
  }

  /**
   * Helper method to resolve a path to a folder object
   * @param {string} path - Path like 'ProjectName/Subfolder/SubSubfolder'
   * @returns {Promise<Object|null>} - Folder object or null if not found
   */
  async _resolvePathToFolder(path) {
    if (!path || typeof path !== 'string') {
      throw new Error('Path must be a non-empty string');
    }

    const pathParts = path.split('/').filter(part => part.trim());
    
    if (pathParts.length === 0) {
      throw new Error('Invalid path format');
    }

    try {
      // First, get all projects to find the root project
      const { folders: projects } = await this.listProjects();
      const rootProject = projects.find(p => 
        p.name.toLowerCase() === pathParts[0].toLowerCase()
      );

      if (!rootProject) {
        throw new Error(`Project not found: ${pathParts[0]}`);
      }

      // If it's just a project name, return the project
      if (pathParts.length === 1) {
        return rootProject;
      }

      // Navigate through the path to find the target folder
      let currentFolder = rootProject;
      
      for (let i = 1; i < pathParts.length; i++) {
        const part = pathParts[i];
        
        // Get subfolders of current folder
        const { folders } = await this.listFolders({ projectId: rootProject.id });
        
        // Find the next folder in the path
        const nextFolder = this._findFolderInTree(folders, part);
        
        if (!nextFolder) {
          throw new Error(`Subfolder not found: ${part} in path ${path}`);
        }
        
        currentFolder = nextFolder;
      }

      return currentFolder;

    } catch (error) {
      throw new Error(`Path resolution failed: ${error.message}`);
    }
  }

  /**
   * Helper method to find a folder by name in a folder tree
   * @param {Array} folders - Array of folders to search in
   * @param {string} folderName - Name of the folder to find
   * @returns {Object|null} - Found folder or null
   */
  _findFolderInTree(folders, folderName) {
    for (const folder of folders) {
      if (folder.name.toLowerCase() === folderName.toLowerCase()) {
        return folder;
      }
      
      // Search in children recursively
      if (folder.children && folder.children.length > 0) {
        const found = this._findFolderInTree(folder.children, folderName);
        if (found) return found;
      }
    }
    
    return null;
  }

  /**
   * Get keys from a project by name (convenience method)
   * @param {string} projectName - Name of the project
   * @param {Object} [options] - Same options as getKeysByPath
   * @returns {Promise<{ keys: Array, total: number, folder: Object }>}
   */
  async getProjectKeys(projectName, options = {}) {
    return this.getKeysByPath(projectName, options);
  }

  /**
   * Get keys from a specific environment in a project (convenience method)
   * @param {string} projectName - Name of the project
   * @param {string} environment - Environment name (DEVELOPMENT, STAGING, PRODUCTION, etc.)
   * @param {Object} [options] - Additional options
   * @returns {Promise<{ keys: Array, total: number, folder: Object }>}
   */
  async getEnvironmentKeys(projectName, environment, options = {}) {
    return this.getKeysByPath(projectName, {
      ...options,
      environment: environment.toUpperCase()
    });
  }
} 