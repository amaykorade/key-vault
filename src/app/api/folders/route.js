import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'
import { createFolder, getUserFolders } from '../../../lib/folders'
import prisma from '../../../lib/database'

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

    // Check subscription status for folder access
    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: { plan: true, subscriptionExpiresAt: true }
    });

    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;

    // Block folder access for expired subscriptions (except FREE plan)
    if (currentUser.plan !== 'FREE' && !hasActiveSubscription) {
      return NextResponse.json({ 
        message: 'Your subscription has expired. Renew your subscription to access your projects.',
        requiresRenewal: true
      }, { status: 403 });
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

    const { name, description, color, parentId } = await request.json()

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: 'Folder name is required' },
        { status: 400 }
      )
    }

    // Enforce Free plan project limit (only for root folders/projects)
    if (user.plan === 'FREE' && !parentId) {
      const userFolders = await getUserFolders(user.id);
      if (userFolders.length >= 1) {
        return NextResponse.json(
          { message: 'Free plan users can only create 1 project. Upgrade to add more.' },
          { status: 403 }
        );
      }
    }

    // For free users, ensure they can only create subfolders within their existing project
    if (user.plan === 'FREE' && parentId) {
      // Check if the parent folder belongs to the user and is a root folder (project)
      const parentFolder = await prisma.folders.findFirst({
        where: { 
          id: parentId, 
          userId: user.id,
          parentId: null // Ensure it's a root folder (project)
        }
      });
      
      if (!parentFolder) {
        return NextResponse.json(
          { message: 'You can only create subfolders within your existing project.' },
          { status: 403 }
        );
      }
    }

    // Create folder
    const folder = await createFolder(user.id, {
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#3B82F6',
      parentId: parentId || null
    })

    return NextResponse.json({ 
      message: parentId ? 'Folder created successfully' : 'Project created successfully',
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