import prisma from './database.js'

export async function logAction(action, resource, userId, details = {}, requestInfo = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        resource,
        resourceId: details.resourceId,
        details: details,
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
  
  return await prisma.auditLog.findMany({
    where,
    include: {
      user: {
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
  const stats = await prisma.auditLog.groupBy({
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

// Convenience functions for common audit events
export async function logKeyAccess(keyId, userId, requestInfo) {
  await logAction('READ', 'key', userId, { resourceId: keyId }, requestInfo)
}

export async function logKeyCreation(keyId, userId, requestInfo) {
  await logAction('CREATE', 'key', userId, { resourceId: keyId }, requestInfo)
}

export async function logKeyUpdate(keyId, userId, requestInfo) {
  await logAction('UPDATE', 'key', userId, { resourceId: keyId }, requestInfo)
}

export async function logKeyDeletion(keyId, userId, requestInfo) {
  await logAction('DELETE', 'key', userId, { resourceId: keyId }, requestInfo)
}

export async function logUserLogin(userId, requestInfo) {
  await logAction('LOGIN', 'user', userId, {}, requestInfo)
}

export async function logUserLogout(userId, requestInfo) {
  await logAction('LOGOUT', 'user', userId, {}, requestInfo)
}

export async function logExport(userId, details, requestInfo) {
  await logAction('EXPORT', 'data', userId, details, requestInfo)
}

export async function logImport(userId, details, requestInfo) {
  await logAction('IMPORT', 'data', userId, details, requestInfo)
} 