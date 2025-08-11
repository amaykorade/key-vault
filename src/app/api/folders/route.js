import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth.js'
import { createFolder, getUserFolders } from '../../../lib/folders.js'
import prisma from '../../../lib/database.js'
import { updateUserUsage, getUserUsageStats } from '../../../lib/planMiddleware.js'
import { canCreateProject, getUpgradeMessage } from '../../../lib/planLimits.js'

export async function GET(request) {
  try {
    console.log('🔍 GET /api/folders - Starting request...');
    
    // Get current user (supports both NextAuth and legacy sessions)
    const user = await getCurrentUser(request)
    console.log('   User found:', user ? user.id : 'null');

    if (!user) {
      console.log('   ❌ No user found, returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check subscription status for folder access
    console.log('   Checking subscription status...');
    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: { plan: true, subscriptionExpiresAt: true }
    });
    console.log('   Current user plan:', currentUser?.plan);

    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;
    console.log('   Has active subscription:', hasActiveSubscription);

    // Block folder access for expired subscriptions (except FREE plan)
    if (currentUser.plan !== 'FREE' && !hasActiveSubscription) {
      console.log('   ❌ Subscription expired, returning 403');
      return NextResponse.json({ 
        message: 'Your subscription has expired. Renew your subscription to access your projects.',
        requiresRenewal: true
      }, { status: 403 });
    }

    // Get user's folders
    console.log('   Fetching user folders...');
    const folders = await getUserFolders(user.id)
    console.log('   Folders found:', folders?.length || 0);

    // Add plan usage to response
    console.log('   Getting user usage stats...');
    const planUsage = await getUserUsageStats(user.id);
    console.log('   Plan usage:', planUsage ? 'success' : 'null');

    console.log('   ✅ GET /api/folders - Success, returning response');
    return NextResponse.json({ 
      folders,
      planUsage
    })

  } catch (error) {
    console.error('❌ GET /api/folders - Error:', error);
    console.error('   Stack trace:', error.stack);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    console.log('🔍 POST /api/folders - Starting request...');
    
    // Get current user (supports both NextAuth and legacy sessions)
    const user = await getCurrentUser(request)
    console.log('   User found:', user ? user.id : 'null');

    if (!user) {
      console.log('   ❌ No user found, returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json();
    console.log('   Request body:', body);
    const { name, description, color, parentId } = body;

    // Validate input
    if (!name || !name.trim()) {
      console.log('   ❌ No name provided, returning 400');
      return NextResponse.json(
        { message: 'Folder name is required' },
        { status: 400 }
      )
    }

    console.log('   Creating folder with parentId:', parentId);

    // Check if user can create a new project (root folder)
    if (!parentId) {
      console.log('   Checking project creation limits...');
      // Get current user with usage data for proper limit checking
      const currentUser = await prisma.users.findUnique({
        where: { id: user.id },
        select: { 
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          projectCount: true,
          keyCount: true,
          subscriptionExpiresAt: true
        }
      });
      console.log('   Current user data:', currentUser);

      if (!canCreateProject(currentUser)) {
        console.log('   ❌ Project limit reached, returning 403');
        const message = getUpgradeMessage(currentUser, 'projects');
        return NextResponse.json({ 
          error: 'Project limit reached',
          message,
          limit: 'projects',
          currentPlan: currentUser.plan
        }, { status: 403 });
      }
    }

    // If parentId is provided, check if we can create a subfolder
    if (parentId) {
      console.log('   Checking parent folder...');
      // Check if the parent folder exists and belongs to the user
      const parentFolder = await prisma.folders.findFirst({
        where: { 
          id: parentId, 
          userId: user.id
        }
      });
      
      if (!parentFolder) {
        console.log('   ❌ Parent folder not found, returning 404');
        return NextResponse.json(
          { message: 'Parent folder not found.' },
          { status: 404 }
        );
      }
      
      console.log('   Parent folder found:', parentFolder.name);
      
      // Prevent creating folders inside subfolders (only allow one level of nesting)
      if (parentFolder.parentId !== null) {
        console.log('   ❌ Cannot create in subfolder, returning 403');
        return NextResponse.json(
          { message: 'Cannot create folders inside subfolders. You can only create subfolders directly within projects.' },
          { status: 403 }
        );
      }
    }

    // Create folder
    console.log('   Creating folder...');
    const folder = await createFolder(user.id, {
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#3B82F6',
      parentId: parentId || null
    })
    console.log('   ✅ Folder created:', folder.id);

    // Update usage statistics if it's a new project (root folder)
    if (!parentId) {
      console.log('   Updating project usage...');
      await updateUserUsage(user.id, 'projects', true);
    }

    console.log('   ✅ POST /api/folders - Success, returning response');
    return NextResponse.json({ 
      message: parentId ? 'Folder created successfully' : 'Project created successfully',
      folder 
    })

  } catch (error) {
    console.error('❌ POST /api/folders - Error:', error);
    console.error('   Stack trace:', error.stack);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 