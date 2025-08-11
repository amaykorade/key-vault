import prisma from './database.js'

export async function logAction(action, resource, userId, details = {}, requestInfo = {}) {
  try {
    // Enhanced details with more context
    const enhancedDetails = {
      ...details,
      timestamp: new Date().toISOString(),
      userAgent: requestInfo.userAgent,
      method: requestInfo.method,
      endpoint: requestInfo.endpoint,
      statusCode: requestInfo.statusCode,
      responseTime: requestInfo.responseTime,
      // Add resource-specific details
      resourceName: details.resourceName,
      resourceType: details.resourceType,
      folderName: details.folderName,
      keyType: details.keyType,
      tags: details.tags,
      // Add user context
      userEmail: details.userEmail,
      userRole: details.userRole,
      userPlan: details.userPlan,
      // Add session/token info
      authMethod: details.authMethod, // 'session', 'jwt', 'api_token'
      tokenType: details.tokenType,
      // Add error information if any
      error: details.error,
      errorMessage: details.errorMessage
    };

    await prisma.audit_logs.create({
      data: {
        action,
        resource,
        resourceId: details.resourceId,
        details: enhancedDetails,
        ipAddress: requestInfo.ipAddress,
        userAgent: requestInfo.userAgent,
        userId
      }
    })
  } catch (error) {
    // Don't let audit logging failures break the main functionality
    console.error('Audit logging failed:', error)
  }
}

export async function getAuditLogs(userId, options = {}) {
  const { action, resource, startDate, endDate, limit = 50, offset = 0 } = options
  
  const where = {
    ...(userId && { userId }),
    ...(action && { action }),
    ...(resource && { resource }),
    ...(startDate && endDate && {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    })
  }
  
  return await prisma.audit_logs.findMany({
    where,
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit,
    skip: offset
  })
}

export async function getAuditStats(userId, startDate, endDate) {
  const stats = await prisma.audit_logs.groupBy({
    by: ['action'],
    where: {
      userId,
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    },
    _count: true
  })
  
  return stats.reduce((acc, stat) => {
    acc[stat.action] = stat._count
    return acc
  }, {})
}

// Enhanced convenience functions for common audit events
export async function logKeyAccess(keyId, userId, requestInfo, keyDetails = {}) {
  await logAction('READ', 'key', userId, { 
    resourceId: keyId,
    resourceName: keyDetails.name,
    keyType: keyDetails.type,
    folderName: keyDetails.folderName,
    tags: keyDetails.tags,
    authMethod: keyDetails.authMethod || 'api_token'
  }, requestInfo)
}

export async function logKeyCreation(keyId, userId, requestInfo, keyDetails = {}) {
  await logAction('CREATE', 'key', userId, { 
    resourceId: keyId,
    resourceName: keyDetails.name,
    keyType: keyDetails.type,
    folderName: keyDetails.folderName,
    tags: keyDetails.tags,
    description: keyDetails.description,
    authMethod: keyDetails.authMethod || 'session'
  }, requestInfo)
}

export async function logKeyUpdate(keyId, userId, requestInfo, keyDetails = {}) {
  await logAction('UPDATE', 'key', userId, { 
    resourceId: keyId,
    resourceName: keyDetails.name,
    keyType: keyDetails.type,
    folderName: keyDetails.folderName,
    tags: keyDetails.tags,
    changes: keyDetails.changes,
    authMethod: keyDetails.authMethod || 'session'
  }, requestInfo)
}

export async function logKeyDeletion(keyId, userId, requestInfo, keyDetails = {}) {
  await logAction('DELETE', 'key', userId, { 
    resourceId: keyId,
    resourceName: keyDetails.name,
    keyType: keyDetails.type,
    folderName: keyDetails.folderName,
    tags: keyDetails.tags,
    authMethod: keyDetails.authMethod || 'session'
  }, requestInfo)
}

export async function logUserLogin(userId, requestInfo, userDetails = {}) {
  await logAction('LOGIN', 'user', userId, {
    userEmail: userDetails.email,
    userRole: userDetails.role,
    userPlan: userDetails.plan,
    authMethod: 'session',
    loginMethod: userDetails.loginMethod || 'email_password'
  }, requestInfo)
}

export async function logUserLogout(userId, requestInfo, userDetails = {}) {
  await logAction('LOGOUT', 'user', userId, {
    userEmail: userDetails.email,
    userRole: userDetails.role,
    userPlan: userDetails.plan,
    authMethod: 'session'
  }, requestInfo)
}

export async function logFolderCreation(folderId, userId, requestInfo, folderDetails = {}) {
  await logAction('CREATE', 'folder', userId, {
    resourceId: folderId,
    resourceName: folderDetails.name,
    folderName: folderDetails.name,
    description: folderDetails.description,
    color: folderDetails.color,
    isProject: !folderDetails.parentId,
    authMethod: folderDetails.authMethod || 'session'
  }, requestInfo)
}

export async function logFolderUpdate(folderId, userId, requestInfo, folderDetails = {}) {
  await logAction('UPDATE', 'folder', userId, {
    resourceId: folderId,
    resourceName: folderDetails.name,
    folderName: folderDetails.name,
    changes: folderDetails.changes,
    authMethod: folderDetails.authMethod || 'session'
  }, requestInfo)
}

export async function logFolderDeletion(folderId, userId, requestInfo, folderDetails = {}) {
  await logAction('DELETE', 'folder', userId, {
    resourceId: folderId,
    resourceName: folderDetails.name,
    folderName: folderDetails.name,
    authMethod: folderDetails.authMethod || 'session'
  }, requestInfo)
}

export async function logAPITokenGeneration(userId, requestInfo, tokenDetails = {}) {
  await logAction('GENERATE', 'api_token', userId, {
    tokenType: 'legacy_api_token',
    authMethod: 'session',
    userEmail: tokenDetails.userEmail,
    userRole: tokenDetails.userRole,
    userPlan: tokenDetails.userPlan
  }, requestInfo)
}

export async function logJWTTokenGeneration(userId, requestInfo, tokenDetails = {}) {
  await logAction('GENERATE', 'jwt_token', userId, {
    tokenType: 'jwt',
    authMethod: 'session',
    userEmail: tokenDetails.userEmail,
    userRole: tokenDetails.userRole,
    userPlan: tokenDetails.userPlan,
    permissions: tokenDetails.permissions
  }, requestInfo)
}

export async function logError(error, userId, requestInfo, errorDetails = {}) {
  await logAction('ERROR', 'system', userId, {
    error: true,
    errorMessage: error.message,
    errorType: error.name,
    errorStack: error.stack,
    endpoint: errorDetails.endpoint,
    method: errorDetails.method,
    authMethod: errorDetails.authMethod
  }, requestInfo)
}

export async function logExport(userId, details, requestInfo) {
  await logAction('EXPORT', 'data', userId, details, requestInfo)
}

export async function logImport(userId, details, requestInfo) {
  await logAction('IMPORT', 'data', userId, details, requestInfo)
} 