import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth.js'
import { createKey, getKeysByFolder, validateKeyData } from '../../../lib/keyManagement.js'
// import { checkUserRateLimit } from '../../../lib/rateLimit.js'

export async function POST(request) {
  // Rate limiting removed
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { folderId, ...keyData } = body

    // Validate required fields
    if (!folderId) {
      return NextResponse.json({ success: false, error: 'Folder ID is required' }, { status: 400 })
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

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    if (!folderId) {
      return NextResponse.json({ success: false, error: 'Folder ID is required' }, { status: 400 })
    }

    // Get keys for the specified folder with pagination
    const { keys, total } = await getKeysByFolder(user.id, folderId, limit, offset)

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