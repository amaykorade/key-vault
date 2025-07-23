import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'
import { createFolder, getUserFolders } from '../../../lib/folders'

export async function GET(request) {
  try {
    // Get current user (supports both NextAuth and legacy sessions)
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user's folders
    const folders = await getUserFolders(user.id)

    return NextResponse.json({ folders })

  } catch (error) {
    console.error('Folders fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    // Get current user (supports both NextAuth and legacy sessions)
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Enforce Free plan project limit
    if (user.plan === 'FREE') {
      const userFolders = await getUserFolders(user.id);
      if (userFolders.length >= 1) {
      return NextResponse.json(
          { message: 'Free plan users can only create 1 project. Upgrade to add more.' },
          { status: 403 }
        );
      }
    }

    const { name, description, color, parentId } = await request.json()

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: 'Project name is required' },
        { status: 400 }
      )
    }

    // Create folder
    const folder = await createFolder(user.id, {
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#3B82F6',
      parentId: parentId || null
    })

    return NextResponse.json({ 
      message: 'Project created successfully',
      folder 
    })

  } catch (error) {
    console.error('Folder creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 