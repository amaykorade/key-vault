import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth.js'
import { getKeyById, updateKey, deleteKey, decryptKeyValue, validateKeyData } from '../../../../lib/keyManagement.js'
// import { checkUserRateLimit } from '../../../../lib/rateLimit.js'
import { logKeyAccess } from '../../../../lib/audit.js'
import prisma from '../../../../lib/database.js'

export async function GET(request, { params }) {
  // Rate limiting removed
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription status for key access
    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: { plan: true, subscriptionExpiresAt: true }
    });

    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;

    // Block key access for expired subscriptions (except FREE plan)
    if (currentUser.plan !== 'FREE' && !hasActiveSubscription) {
      return NextResponse.json({ 
        success: false, 
        error: 'Your subscription has expired. Renew your subscription to access your keys.',
        requiresRenewal: true
      }, { status: 403 });
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const includeValue = searchParams.get('includeValue') === 'true'

    // Get the key
    let key
    try {
      key = await getKeyById(user.id, id)
    } catch (error) {
      if (error.message === 'Key not found') {
        return NextResponse.json({ success: false, error: 'Key not found' }, { status: 404 })
      }
      return NextResponse.json({ success: false, error: error.message || 'Failed to fetch key' }, { status: 500 })
    }

    // AUDIT LOG: Log all key reads
    const requestInfo = {
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip,
      userAgent: request.headers.get('user-agent')
    }
    await logKeyAccess(key.id, user.id, requestInfo)

    // Prepare response data
    const keyData = {
      id: key.id,
      name: key.name,
      description: key.description,
      type: key.type,
      tags: key.tags,
      isFavorite: key.isFavorite,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt
    }

    // Include decrypted value if requested
    if (includeValue) {
      try {
        const decryptedValue = await decryptKeyValue(key.value)
        keyData.value = decryptedValue
        // AUDIT LOG: Note that decrypted value was accessed (already logged above, but you can add a special log if desired)
      } catch (error) {
        console.error('Error decrypting key value:', error)
        keyData.value = '[Encrypted]'
      }
    }

    return NextResponse.json({ 
      success: true, 
      key: keyData 
    })

  } catch (error) {
    console.error('Error fetching key:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to fetch key' 
    }, { status: 500 })
  }
}

export async function PUT(request, context) {
  // Rate limiting removed
  try {
    const params = await context.params;
    const { id } = params;
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate key data
    const validationErrors = validateKeyData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 })
    }

    // Get the key
    let key
    try {
      key = await getKeyById(user.id, id)
    } catch (error) {
      if (error.message === 'Key not found') {
        return NextResponse.json({ success: false, error: 'Key not found' }, { status: 404 })
      }
      return NextResponse.json({ success: false, error: error.message || 'Failed to update key' }, { status: 500 })
    }

    // Update the key
    const updatedKey = await updateKey(user.id, id, body)

    return NextResponse.json({ 
      success: true, 
      key: {
        id: updatedKey.id,
        name: updatedKey.name,
        description: updatedKey.description,
        type: updatedKey.type,
        tags: updatedKey.tags,
        isFavorite: updatedKey.isFavorite,
        createdAt: updatedKey.createdAt,
        updatedAt: updatedKey.updatedAt
      }
    })

  } catch (error) {
    console.error('Error updating key:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to update key' 
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  // Rate limiting removed
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get the key
    let key
    try {
      key = await getKeyById(user.id, id)
    } catch (error) {
      if (error.message === 'Key not found') {
        return NextResponse.json({ success: false, error: 'Key not found' }, { status: 404 })
      }
      return NextResponse.json({ success: false, error: error.message || 'Failed to delete key' }, { status: 500 })
    }

    // Delete the key
    await deleteKey(user.id, id)

    return NextResponse.json({ 
      success: true, 
      message: 'Key deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting key:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to delete key' 
    }, { status: 500 })
  }
} 