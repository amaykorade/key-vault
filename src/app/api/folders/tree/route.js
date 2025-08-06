import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import { getFolderTree } from '../../../../lib/folders'
import prisma from '../../../../lib/database'

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

    // Get project ID from query params
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    // Get user's folder tree (filtered by project if specified)
    const folders = await getFolderTree(user.id, projectId)

    return NextResponse.json({ folders })

  } catch (error) {
    console.error('Folder tree fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 