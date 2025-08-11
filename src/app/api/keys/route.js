import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '../../../lib/auth.js'
import { createKey, getKeysByFolder, validateKeyData } from '../../../lib/keyManagement.js'
import { requirePermissionFromToken, logAccess } from '../../../lib/permissions.js'
import { logKeyCreation, logKeyAccess } from '../../../lib/audit.js'
import { canCreateKey, getUpgradeMessage, hasFeature } from '../../../lib/planLimits.js'
import { updateUserUsage } from '../../../lib/planMiddleware.js'
// import { checkUserRateLimit } from '../../../lib/rateLimit.js'

const prisma = new PrismaClient()

export async function POST(request) {
  // Rate limiting removed
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Enhanced RBAC: Check if user has permission to create keys (supports JWT tokens)
    if (user.permissions && Array.isArray(user.permissions)) {
      // Token-based permission check (fast)
      if (!user.permissions.includes('keys:write') && !user.permissions.includes('*')) {
        await logAccess(user.id, 'keys', null, 'create_denied', 'denied', {
          source: 'token',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent')
        })
        
        return NextResponse.json({ 
          success: false, 
          error: 'Insufficient permissions: keys:write required' 
        }, { status: 403 })
      }
    } else {
      // Database-based permission check (fallback for session tokens)
      const { PermissionManager } = await import('../../../lib/permissions.js')
      const pm = new PermissionManager(user)
      await pm.loadPermissions()
      
      if (!pm.hasPermission('keys:write')) {
        await logAccess(user.id, 'keys', null, 'create_denied', 'denied', {
          source: 'database',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent')
        })
        
        return NextResponse.json({ 
          success: false, 
          error: 'Insufficient permissions: keys:write required' 
        }, { status: 403 })
      }
    }

    const body = await request.json()
    const { folderId, ...keyData } = body

    // Validate required fields
    if (!folderId) {
      return NextResponse.json({ success: false, error: 'Folder ID is required' }, { status: 400 })
    }

    // Check plan limits for key creation
    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: { plan: true, subscriptionExpiresAt: true, keyCount: true }
    });

    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;

    // Get current key count for the project
    const projectKeyCount = await prisma.keys.count({ where: { folderId } });

    // Check if user can create more keys
    if (!canCreateKey(currentUser, projectKeyCount)) {
      const message = getUpgradeMessage(currentUser, 'keys');
      return NextResponse.json({ 
        success: false, 
        error: 'Key limit reached',
        message,
        limit: 'keys',
        currentPlan: currentUser.plan,
        projectKeyCount
      }, { status: 403 });
    }

    // Validate key data
    const validationErrors = validateKeyData(keyData)
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 })
    }

    // Create the key
    const key = await createKey(user.id, folderId, keyData)

    // Update usage statistics
    await updateUserUsage(user.id, 'keys', true);

    // Get folder name for context
    const folder = await prisma.folders.findUnique({
      where: { id: folderId },
      select: { name: true }
    });

    // Log successful key creation with enhanced details
    await logKeyCreation(key.id, user.id, {
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
      method: 'POST',
      endpoint: '/api/keys',
      statusCode: 200
    }, {
      name: key.name,
      type: key.type,
      folderName: folder?.name,
      tags: key.tags,
      description: key.description,
      authMethod: 'session'
    });

    return NextResponse.json({ 
      success: true, 
      key: {
        id: key.id,
        name: key.name,
        description: key.description,
        type: key.type,
        tags: key.tags,
        isFavorite: key.isFavorite,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt
      }
    })

  } catch (error) {
    console.error('Error creating key:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to create key' 
    }, { status: 500 })
  }
}

export async function GET(request) {
  // Rate limiting removed
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Enhanced RBAC: Check if user has permission to read keys (supports JWT tokens)
    if (user.permissions && Array.isArray(user.permissions)) {
      // Token-based permission check (fast)
      if (!user.permissions.includes('keys:read') && !user.permissions.includes('*')) {
        await logAccess(user.id, 'keys', null, 'read_denied', 'denied', {
          source: 'token',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent')
        })
        
        return NextResponse.json({ 
          success: false, 
          error: 'Insufficient permissions: keys:read required' 
        }, { status: 403 })
      }
    } else {
      // Database-based permission check (fallback for session tokens)
      const { PermissionManager } = await import('../../../lib/permissions.js')
      const pm = new PermissionManager(user)
      await pm.loadPermissions()
      
      if (!pm.hasPermission('keys:read')) {
        await logAccess(user.id, 'keys', null, 'read_denied', 'denied', {
          source: 'database',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent')
        })
        
        return NextResponse.json({ 
          success: false, 
          error: 'Insufficient permissions: keys:read required' 
        }, { status: 403 })
      }
    }

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    if (!folderId) {
      return NextResponse.json({ success: false, error: 'Folder ID is required' }, { status: 400 })
    }

    // Get keys for the specified folder with pagination (including team access)
    const { keys, total } = await getKeysByFolder(user.id, folderId, limit, offset)

    // Get folder name for context
    const folder = await prisma.folders.findUnique({
      where: { id: folderId },
      select: { name: true }
    });

    // Log successful key retrieval with enhanced details
    await logKeyAccess(folderId, user.id, {
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
      method: 'GET',
      endpoint: '/api/keys',
      statusCode: 200
    }, {
      name: `Folder: ${folder?.name || folderId}`,
      type: 'folder_access',
      folderName: folder?.name,
      tags: [],
      authMethod: 'session'
    });

    // Return keys without the encrypted values
    const safeKeys = keys.map(key => ({
      id: key.id,
      name: key.name,
      description: key.description,
      type: key.type,
      tags: key.tags,
      isFavorite: key.isFavorite,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt
    }))

    return NextResponse.json({ 
      success: true, 
      keys: safeKeys,
      total,
      limit,
      offset
    })

  } catch (error) {
    console.error('Error fetching keys:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to fetch keys' 
    }, { status: 500 })
  }
} 