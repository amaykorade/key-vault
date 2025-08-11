import { NextResponse } from 'next/server'
import prisma from '../../../lib/database'

export async function GET(request) {
  try {
    console.log('🔍 Test folder route called');
    
    // Test 1: Check if folders table exists and has data
    console.log('🔍 Test 1: Checking folders table...');
    const folderCount = await prisma.folders.count();
    console.log('✅ Total folders in database:', folderCount);
    
    // Test 2: Check if users table has the new columns
    console.log('🔍 Test 2: Checking users table structure...');
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        projectCount: true,
        keyCount: true,
        lastUsageUpdate: true
      },
      take: 3
    });
    console.log('✅ Sample users:', users);
    
    // Test 3: Check if any folders exist for users
    console.log('🔍 Test 3: Checking user folders...');
    const userFolders = await prisma.folders.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      take: 5
    });
    console.log('✅ User folders found:', userFolders.length);
    
    // Test 4: Check folder structure
    if (userFolders.length > 0) {
      console.log('🔍 Test 4: Checking folder structure...');
      const firstFolder = userFolders[0];
      console.log('✅ First folder details:', {
        id: firstFolder.id,
        name: firstFolder.name,
        userId: firstFolder.userId,
        parentId: firstFolder.parentId,
        user: firstFolder.users
      });
    }
    
    // Test 5: Check if there are any projects (folders with parentId = null)
    console.log('🔍 Test 5: Checking for projects...');
    const projects = await prisma.folders.findMany({
      where: {
        parentId: null
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
    console.log('✅ Projects found:', projects.length);
    
    return NextResponse.json({
      message: 'Folder test completed successfully',
      results: {
        totalFolders: folderCount,
        userFolders: userFolders.length,
        projects: projects.length,
        sampleUsers: users.length,
        sampleFolders: userFolders.map(f => ({
          id: f.id,
          name: f.name,
          userId: f.userId,
          parentId: f.parentId,
          userEmail: f.users?.email
        }))
      }
    });

  } catch (error) {
    console.error('❌ Test folder error:', error)
    console.error('❌ Error stack:', error.stack)
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    
    return NextResponse.json(
      { 
        message: 'Test folder failed',
        error: error.message,
        name: error.name
      },
      { status: 500 }
    )
  }
} 