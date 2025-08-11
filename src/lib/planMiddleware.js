/**
 * Plan Enforcement Middleware
 * Enforces plan limits and feature access across the application
 */

import { getCurrentUser } from './auth.js';
import { 
  canCreateProject, 
  canCreateKey, 
  hasFeature, 
  getUpgradeMessage,
  getUserUsage 
} from './planLimits.js';
import prisma from './database.js';

/**
 * Middleware to check if user can create projects
 */
export function requireProjectCreation(req, res, next) {
  return async (req, res, next) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!canCreateProject(user)) {
        const message = getUpgradeMessage(user, 'projects');
        return res.status(403).json({ 
          error: 'Project limit reached',
          message,
          limit: 'projects',
          currentPlan: user.plan
        });
      }

      next();
    } catch (error) {
      console.error('Project creation check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user can create keys
 */
export function requireKeyCreation(req, res, next) {
  return async (req, res, next) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { folderId } = req.body;
      
      // Get current key count for the project
      let projectKeyCount = 0;
      if (folderId) {
        projectKeyCount = await prisma.keys.count({
          where: { folderId }
        });
      }

      if (!canCreateKey(user, projectKeyCount)) {
        const message = getUpgradeMessage(user, 'keys');
        return res.status(403).json({ 
          error: 'Key limit reached',
          message,
          limit: 'keys',
          currentPlan: user.plan,
          projectKeyCount
        });
      }

      next();
    } catch (error) {
      console.error('Key creation check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user has access to a specific feature
 */
export function requireFeature(feature) {
  return async (req, res, next) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!hasFeature(user, feature)) {
        const message = getUpgradeMessage(user, feature);
        return res.status(403).json({ 
          error: 'Feature not available',
          message,
          feature,
          currentPlan: user.plan
        });
      }

      next();
    } catch (error) {
      console.error('Feature check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check team features (RBAC, team collaboration)
 */
export function requireTeamFeatures(req, res, next) {
  return requireFeature('team_features')(req, res, next);
}

/**
 * Middleware to check RBAC features
 */
export function requireRBAC(req, res, next) {
  return requireFeature('rbac')(req, res, next);
}

/**
 * Middleware to check expiring secrets feature
 */
export function requireExpiringSecrets(req, res, next) {
  return requireFeature('expiring_secrets')(req, res, next);
}

/**
 * Middleware to check API analytics feature
 */
export function requireAPIAnalytics(req, res, next) {
  return requireFeature('api_analytics')(req, res, next);
}

/**
 * Middleware to add plan usage to response
 */
export function addPlanUsage(req, res, next) {
  return async (req, res, next) => {
    try {
      const user = await getCurrentUser(req);
      if (user) {
        req.planUsage = getUserUsage(user);
      }
      next();
    } catch (error) {
      console.error('Plan usage check error:', error);
      next(); // Continue even if plan usage check fails
    }
  };
}

/**
 * Update user usage statistics
 */
export async function updateUserUsage(userId, type, increment = true) {
  try {
    const updateData = {};
    
    if (type === 'projects') {
      updateData.projectCount = {
        increment: increment ? 1 : -1
      };
    } else if (type === 'keys') {
      updateData.keyCount = {
        increment: increment ? 1 : -1
      };
    }
    
    updateData.lastUsageUpdate = new Date();
    
    await prisma.users.update({
      where: { id: userId },
      data: updateData
    });
  } catch (error) {
    console.error('Error updating user usage:', error);
  }
}

/**
 * Get user usage statistics
 */
export async function getUserUsageStats(userId) {
  try {
    console.log('🔍 getUserUsageStats - Starting for userId:', userId);
    
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });
    
    console.log('   User found:', user ? 'yes' : 'no');
    if (user) {
      console.log('   User fields:', {
        id: user.id,
        plan: user.plan,
        projectCount: user.projectCount,
        keyCount: user.keyCount
      });
    }
    
    if (!user) {
      console.log('   ❌ No user found, returning null');
      return null;
    }
    
    console.log('   Calling getUserUsage...');
    const usage = getUserUsage(user);
    console.log('   ✅ getUserUsage successful, returning usage');
    return usage;
  } catch (error) {
    console.error('❌ getUserUsageStats - Error:', error);
    console.error('   Stack trace:', error.stack);
    return null;
  }
} 