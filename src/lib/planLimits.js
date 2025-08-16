/**
 * Plan Limits Configuration
 * Defines features and limits for each subscription plan
 */

export const PLAN_LIMITS = {
  FREE: {
    name: 'Free',
    maxProjects: 1,
    maxKeysPerProject: 5,
    maxKeysTotal: 5,
    hasTeamFeatures: false,
    hasRBAC: false,
    hasExpiringSecrets: true, // Now available for all users
    hasAPIAnalytics: false,
    hasEmailSupport: false,
    hasPrioritySupport: false,
    price: 0, // $0
    features: [
      '1 project',
      '5 keys total',
      'Basic API access',
      'Basic dashboard',
      'Expiring secrets' // Added to features
    ],
    restrictions: [
      'No team features',
      'No RBAC',
      'No API analytics',
      'No email support'
    ]
  },
  PRO: {
    name: 'Pro',
    maxProjects: 3,
    maxKeysPerProject: 10,
    maxKeysTotal: 30, // 3 projects × 10 keys
    hasTeamFeatures: false,
    hasRBAC: false,
    hasExpiringSecrets: true,
    hasAPIAnalytics: true,
    hasEmailSupport: true,
    hasPrioritySupport: false,
    price: 900, // $9.00
    features: [
      '3 projects',
      '10 keys per project',
      'Expiring secrets',
      'API analytics',
      'Email support',
      'Advanced API access'
    ],
    restrictions: [
      'No team features',
      'No RBAC'
    ]
  },
  TEAM: {
    name: 'Team',
    maxProjects: -1, // Unlimited
    maxKeysPerProject: -1, // Unlimited
    maxKeysTotal: -1, // Unlimited
    hasTeamFeatures: true,
    hasRBAC: true,
    hasExpiringSecrets: true,
    hasAPIAnalytics: true,
    hasEmailSupport: true,
    hasPrioritySupport: true,
    price: 2900, // $29.00
    features: [
      'Unlimited projects',
      'Unlimited keys',
      'Team collaboration',
      'Full RBAC',
      'Expiring secrets',
      'API analytics',
      'Priority support',
      'Advanced security'
    ],
    restrictions: []
  }
};

/**
 * Get plan limits for a specific plan
 */
export function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
}

/**
 * Check if user can create more projects
 */
export function canCreateProject(user) {
  const limits = getPlanLimits(user.plan);
  if (limits.maxProjects === -1) return true; // Unlimited
  return user.projectCount < limits.maxProjects;
}

/**
 * Check if user can create more keys in a project
 */
export function canCreateKey(user, projectKeyCount = 0) {
  const limits = getPlanLimits(user.plan);
  
  // Check total keys limit
  if (limits.maxKeysTotal !== -1 && user.keyCount >= limits.maxKeysTotal) {
    return false;
  }
  
  // Check per-project keys limit
  if (limits.maxKeysPerProject !== -1 && projectKeyCount >= limits.maxKeysPerProject) {
    return false;
  }
  
  return true;
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeature(user, feature) {
  const limits = getPlanLimits(user.plan);
  
  switch (feature) {
    case 'team_features':
      return limits.hasTeamFeatures;
    case 'rbac':
      return limits.hasRBAC;
    case 'expiring_secrets':
      return limits.hasExpiringSecrets;
    case 'apiAnalytics':
      return limits.hasAPIAnalytics;
    case 'email_support':
      return limits.hasEmailSupport;
    case 'priority_support':
      return limits.hasPrioritySupport;
    default:
      return false;
  }
}

/**
 * Get upgrade message for a specific limit
 */
export function getUpgradeMessage(user, limitType) {
  const currentPlan = user.plan;
  const limits = getPlanLimits(currentPlan);
  
  switch (limitType) {
    case 'projects':
      if (currentPlan === 'FREE') {
        return 'Upgrade to Pro for 3 projects or Team for unlimited projects';
      } else if (currentPlan === 'PRO') {
        return 'Upgrade to Team for unlimited projects';
      }
      break;
    case 'keys':
      if (currentPlan === 'FREE') {
        return 'Upgrade to Pro for 10 keys per project or Team for unlimited keys';
      } else if (currentPlan === 'PRO') {
        return 'Upgrade to Team for unlimited keys';
      }
      break;
    case 'team_features':
      return 'Upgrade to Team plan for team collaboration and RBAC';
    case 'expiring_secrets':
      return 'Upgrade to Pro or Team for expiring secrets';
    case 'api_analytics':
      return 'Upgrade to Pro or Team for API analytics';
    default:
      return 'Upgrade your plan for more features';
  }
  
  return 'Upgrade your plan for more features';
}

/**
 * Get usage statistics for a user
 */
export function getUserUsage(user) {
  const limits = getPlanLimits(user.plan);
  
  return {
    plan: user.plan,
    planName: limits.name,
    projects: {
      used: user.projectCount,
      limit: limits.maxProjects,
      unlimited: limits.maxProjects === -1
    },
    keys: {
      used: user.keyCount,
      limit: limits.maxKeysTotal,
      unlimited: limits.maxKeysTotal === -1
    },
    features: {
      teamFeatures: limits.hasTeamFeatures,
      rbac: limits.hasRBAC,
      expiringSecrets: limits.hasExpiringSecrets,
      apiAnalytics: limits.hasAPIAnalytics,
      emailSupport: limits.hasEmailSupport,
      prioritySupport: limits.hasPrioritySupport
    }
  };
} 