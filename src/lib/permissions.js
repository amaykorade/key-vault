import prisma from './database.js';

// Permission definitions
export const PERMISSIONS = {
  // Key Management
  'keys:read': 'Read key metadata and values',
  'keys:write': 'Create and update keys',
  'keys:delete': 'Delete keys',
  'keys:rotate': 'Rotate key values',
  
  // Folder Management
  'folders:read': 'View folder structure and contents',
  'folders:write': 'Create and update folders',
  'folders:delete': 'Delete folders',
  
  // Team Management
  'team:read': 'View team members and structure',
  'team:write': 'Invite and manage team members',
  'team:delete': 'Remove team members',
  
  // Role Management
  'roles:read': 'View roles and permissions',
  'roles:write': 'Create and update roles',
  'roles:delete': 'Delete roles',
  
  // Billing & Settings
  'billing:read': 'View billing information',
  'billing:write': 'Update billing settings',
  'settings:read': 'View application settings',
  'settings:write': 'Update application settings',
  
  // Audit & Compliance
  'audit:read': 'View audit logs',
  'audit:export': 'Export audit logs',
  
  // API Access
  'api:read': 'Access API for reading',
  'api:write': 'Access API for writing',
  'api:admin': 'Full API access'
};

// Permission categories
export const PERMISSION_CATEGORIES = {
  'keys': ['keys:read', 'keys:write', 'keys:delete', 'keys:rotate'],
  'folders': ['folders:read', 'folders:write', 'folders:delete'],
  'team': ['team:read', 'team:write', 'team:delete'],
  'roles': ['roles:read', 'roles:write', 'roles:delete'],
  'billing': ['billing:read', 'billing:write'],
  'settings': ['settings:read', 'settings:write'],
  'audit': ['audit:read', 'audit:export'],
  'api': ['api:read', 'api:write', 'api:admin']
};

// Predefined roles
export const PREDEFINED_ROLES = {
  'Super Admin': {
    description: 'Full system access',
    permissions: Object.keys(PERMISSIONS),
    isSystem: true
  },
  
  'Admin': {
    description: 'Team and project management',
    permissions: [
      'keys:read', 'keys:write', 'keys:delete', 'keys:rotate',
      'folders:read', 'folders:write', 'folders:delete',
      'team:read', 'team:write', 'team:delete',
      'roles:read', 'roles:write',
      'billing:read', 'billing:write',
      'settings:read', 'settings:write',
      'audit:read', 'audit:export',
      'api:read', 'api:write'
    ]
  },
  
  'Developer': {
    description: 'Full access to keys and folders',
    permissions: [
      'keys:read', 'keys:write', 'keys:rotate',
      'folders:read', 'folders:write',
      'team:read',
      'api:read', 'api:write'
    ]
  },
  
  'Viewer': {
    description: 'Read-only access to assigned resources',
    permissions: [
      'keys:read',
      'folders:read',
      'team:read',
      'api:read'
    ]
  },
  
  'Billing Manager': {
    description: 'Billing and usage management',
    permissions: [
      'billing:read', 'billing:write',
      'audit:read',
      'api:read'
    ]
  },
  
  'Auditor': {
    description: 'Audit and compliance access',
    permissions: [
      'audit:read', 'audit:export',
      'api:read'
    ]
  }
};

// Permission Manager Class
export class PermissionManager {
  constructor(user, teamId = null) {
    this.user = user;
    this.teamId = teamId;
    this.permissions = new Set();
    this.rolePermissions = new Map();
    this.aclPermissions = new Map();
  }
  
  async loadPermissions() {
    try {
      // Load user's role permissions
      const userRole = await this.getUserRole();
      if (userRole) {
        const rolePermissions = await this.getRolePermissions(userRole.id);
        rolePermissions.forEach(p => {
          this.permissions.add(p.name);
          this.rolePermissions.set(p.name, p);
        });
      }
      
      // Load custom user permissions
      if (this.user.permissions) {
        Object.keys(this.user.permissions).forEach(p => {
          this.permissions.add(p);
        });
      }
      
      // Load ACL permissions
      const aclPermissions = await this.getACLPermissions();
      aclPermissions.forEach(acl => {
        acl.permissions.forEach(p => {
          this.permissions.add(p);
          this.aclPermissions.set(p, acl);
        });
      });
      
      return true;
    } catch (error) {
      console.error('Error loading permissions:', error);
      return false;
    }
  }
  
  async getUserRole() {
    if (!this.user) return null;
    
    // Check if user has a role assigned in team context
    if (this.teamId) {
      const teamMember = await prisma.team_members.findFirst({
        where: {
          userId: this.user.id,
          teamId: this.teamId
        },
        include: {
          roles: true
        }
      });
      
      if (teamMember?.roles) {
        return teamMember.roles;
      }
    }
    
    // Fall back to user's default role
    return { id: this.user.role, name: this.user.role };
  }
  
  async getRolePermissions(roleId) {
    const rolePermissions = await prisma.role_permissions.findMany({
      where: { roleId },
      include: {
        permission: true
      }
    });
    
    return rolePermissions.map(rp => rp.permission);
  }
  
  async getACLPermissions() {
    if (!this.user) return [];
    
    const acls = await prisma.access_control_lists.findMany({
      where: {
        OR: [
          { userId: this.user.id },
          { teamId: this.teamId },
          { roleId: { in: this.getUserRoleIds() } }
        ]
      }
    });
    
    return acls;
  }
  
  getUserRoleIds() {
    const roleIds = [];
    if (this.user.role) {
      roleIds.push(this.user.role);
    }
    return roleIds;
  }
  
  hasPermission(permission) {
    return this.permissions.has(permission) || this.permissions.has('*');
  }
  
  hasAnyPermission(permissions) {
    return permissions.some(p => this.hasPermission(p));
  }
  
  hasAllPermissions(permissions) {
    return permissions.every(p => this.hasPermission(p));
  }
  
  async checkResourceAccess(resourceType, resourceId, requiredPermissions) {
    // Check if user has direct access to resource via ACL
    const acl = await this.getResourceACL(resourceType, resourceId);
    if (acl && this.hasAnyPermission(requiredPermissions)) {
      return true;
    }
    
    // Check if user has global permissions
    return this.hasAllPermissions(requiredPermissions);
  }
  
  async getResourceACL(resourceType, resourceId) {
    if (!this.user) return null;
    
    return await prisma.access_control_lists.findFirst({
      where: {
        resourceType,
        resourceId,
        OR: [
          { userId: this.user.id },
          { teamId: this.teamId },
          { roleId: { in: this.getUserRoleIds() } }
        ]
      }
    });
  }
  
  getPermissionsList() {
    return Array.from(this.permissions);
  }
  
  getRolePermissionsList() {
    return Array.from(this.rolePermissions.keys());
  }
  
  getACLPermissionsList() {
    return Array.from(this.aclPermissions.keys());
  }
}

// Middleware for API routes
export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const pm = new PermissionManager(user);
      await pm.loadPermissions();
      
      if (!pm.hasPermission(permission)) {
        await logAccess(user.id, 'permission_check', null, 'access_denied', 'denied', {
          permission,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });
        
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      req.permissions = pm;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function requireResourceAccess(resourceType, requiredPermissions) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const resourceId = req.params.id || req.body.resourceId;
      
      if (!user || !resourceId) {
        return res.status(400).json({ error: 'Invalid request' });
      }
      
      const pm = new PermissionManager(user);
      await pm.loadPermissions();
      
      const hasAccess = await pm.checkResourceAccess(
        resourceType, 
        resourceId, 
        requiredPermissions
      );
      
      if (!hasAccess) {
        await logAccess(user.id, resourceType, resourceId, 'access_denied', 'denied', {
          permissions: requiredPermissions,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });
        
        return res.status(403).json({ error: 'Access denied' });
      }
      
      req.permissions = pm;
      next();
    } catch (error) {
      console.error('Resource access check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Enhanced middleware for API routes with JWT token support
export function requirePermissionFromToken(permission) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user has permissions embedded in token (JWT or API token)
      if (user.permissions && Array.isArray(user.permissions)) {
        if (user.permissions.includes(permission) || user.permissions.includes('*')) {
          // Log successful access
          await logAccess(user.id, 'permission_check', null, 'access_granted', 'success', {
            permission,
            source: 'token',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
          });
          
          req.permissions = {
            hasPermission: (perm) => user.permissions.includes(perm) || user.permissions.includes('*'),
            hasAnyPermission: (perms) => perms.some(p => user.permissions.includes(p) || user.permissions.includes('*')),
            hasAllPermissions: (perms) => perms.every(p => user.permissions.includes(p) || user.permissions.includes('*')),
            getPermissionsList: () => user.permissions
          };
          return next();
        }
      }

      // Fallback to database check for session tokens
      const pm = new PermissionManager(user);
      await pm.loadPermissions();

      if (!pm.hasPermission(permission)) {
        await logAccess(user.id, 'permission_check', null, 'access_denied', 'denied', {
          permission,
          source: 'database',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.permissions = pm;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Enhanced resource access check with token support
export function requireResourceAccessFromToken(resourceType, requiredPermissions) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const resourceId = req.params.id || req.body.resourceId;

      if (!user || !resourceId) {
        return res.status(400).json({ error: 'Invalid request' });
      }

      // Check if user has permissions embedded in token
      if (user.permissions && Array.isArray(user.permissions)) {
        const hasPermission = requiredPermissions.some(p => 
          user.permissions.includes(p) || user.permissions.includes('*')
        );
        
        if (hasPermission) {
          // For token-based auth, we assume access to all resources
          // unless there's a specific ACL check needed
          await logAccess(user.id, resourceType, resourceId, 'access_granted', 'success', {
            permissions: requiredPermissions,
            source: 'token',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
          });
          
          req.permissions = {
            hasPermission: (perm) => user.permissions.includes(perm) || user.permissions.includes('*'),
            hasAnyPermission: (perms) => perms.some(p => user.permissions.includes(p) || user.permissions.includes('*')),
            hasAllPermissions: (perms) => perms.every(p => user.permissions.includes(p) || user.permissions.includes('*')),
            getPermissionsList: () => user.permissions
          };
          return next();
        }
      }

      // Fallback to database check for session tokens
      const pm = new PermissionManager(user);
      await pm.loadPermissions();

      const hasAccess = await pm.checkResourceAccess(
        resourceType,
        resourceId,
        requiredPermissions
      );

      if (!hasAccess) {
        await logAccess(user.id, resourceType, resourceId, 'access_denied', 'denied', {
          permissions: requiredPermissions,
          source: 'database',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        return res.status(403).json({ error: 'Access denied' });
      }

      req.permissions = pm;
      next();
    } catch (error) {
      console.error('Resource access check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Audit logging function
export async function logAccess(userId, resourceType, resourceId, action, result, metadata = {}) {
  try {
    await prisma.access_audit_logs.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        permissions: metadata.permissions || [],
        result,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        metadata
      }
    });
  } catch (error) {
    console.error('Error logging access:', error);
  }
}

// Initialize permissions and roles
export async function initializeRBAC() {
  try {
    console.log('🔐 Initializing RBAC system...');
    
    // Create permissions
    for (const [name, description] of Object.entries(PERMISSIONS)) {
      const category = Object.keys(PERMISSION_CATEGORIES).find(cat => 
        PERMISSION_CATEGORIES[cat].includes(name)
      ) || 'other';
      
      await prisma.permissions.upsert({
        where: { name },
        update: { description, category },
        create: { name, description, category }
      });
    }
    
    // Create predefined roles
    for (const [roleName, roleData] of Object.entries(PREDEFINED_ROLES)) {
      const role = await prisma.roles.upsert({
        where: { name: roleName },
        update: { 
          description: roleData.description,
          isSystem: roleData.isSystem
        },
        create: {
          name: roleName,
          description: roleData.description,
          isSystem: roleData.isSystem
        }
      });
      
      // Assign permissions to role
      for (const permissionName of roleData.permissions) {
        const permission = await prisma.permissions.findUnique({
          where: { name: permissionName }
        });
        
        if (permission) {
          await prisma.role_permissions.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id
              }
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id,
              grantedBy: 'system'
            }
          });
        }
      }
    }
    
    console.log('✅ RBAC system initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing RBAC:', error);
    return false;
  }
}

// Utility functions
export function getPermissionCategory(permission) {
  return Object.keys(PERMISSION_CATEGORIES).find(cat => 
    PERMISSION_CATEGORIES[cat].includes(permission)
  ) || 'other';
}

export function getPermissionsByCategory() {
  const categorized = {};
  
  for (const [category, permissions] of Object.entries(PERMISSION_CATEGORIES)) {
    categorized[category] = permissions.map(p => ({
      name: p,
      description: PERMISSIONS[p]
    }));
  }
  
  return categorized;
}

export function validatePermissions(permissions) {
  const validPermissions = Object.keys(PERMISSIONS);
  return permissions.every(p => validPermissions.includes(p));
} 