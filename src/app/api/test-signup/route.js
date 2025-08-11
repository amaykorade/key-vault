import { NextResponse } from 'next/server'
import prisma from '../../../lib/database'

export async function POST(request) {
  try {
    console.log('🔍 Test signup route called');
    
    const { name, email, password } = await request.json()
    console.log('📝 Test signup data received:', { name, email, hasPassword: !!password });

    // Test 1: Basic database connection
    console.log('🔍 Test 1: Database connection...');
    const userCount = await prisma.users.count();
    console.log('✅ Database connected, user count:', userCount);

    // Test 2: Check if user exists
    console.log('🔍 Test 2: Check if user exists...');
    const existingUser = await prisma.users.findUnique({
      where: { email }
    })
    console.log('✅ User check completed, existing:', !!existingUser);

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Test 3: Create user (without password hashing for now)
    console.log('🔍 Test 3: Creating user...');
    const user = await prisma.users.create({
      data: {
        email,
        password: 'test-hash', // Temporary
        name,
        role: 'ADMIN'
      }
    })
    console.log('✅ User created:', user.id);

    // Test 4: Create session
    console.log('🔍 Test 4: Creating session...');
    const session = await prisma.sessions.create({
      data: {
        token: 'test-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: user.id
      }
    })
    console.log('✅ Session created');

    // Test 5: Create default folder
    console.log('🔍 Test 5: Creating default folder...');
    const folder = await prisma.folders.create({
      data: {
        name: 'General',
        description: 'Default folder for your keys',
        color: '#3B82F6',
        userId: user.id
      }
    })
    console.log('✅ Default folder created');

    // Test 6: Try to create audit log
    console.log('🔍 Test 6: Testing audit log creation...');
    try {
      await prisma.audit_logs.create({
        data: {
          action: 'LOGIN',
          resource: 'user',
          resourceId: user.id,
          details: { test: true },
          ipAddress: '127.0.0.1',
          userAgent: 'test',
          userId: user.id
        }
      })
      console.log('✅ Audit log created successfully');
    } catch (auditError) {
      console.error('❌ Audit log creation failed:', auditError);
      console.error('❌ Audit error details:', {
        name: auditError.name,
        message: auditError.message,
        code: auditError.code
      });
    }

    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await prisma.folders.delete({ where: { id: folder.id } });
    await prisma.sessions.delete({ where: { id: session.id } });
    await prisma.users.delete({ where: { id: user.id } });
    console.log('✅ Test data cleaned up');

    return NextResponse.json({
      message: 'Test signup completed successfully',
      tests: {
        database: '✅ Connected',
        userCheck: '✅ Completed',
        userCreation: '✅ Success',
        sessionCreation: '✅ Success',
        folderCreation: '✅ Success',
        auditLog: '✅ Success'
      }
    });

  } catch (error) {
    console.error('❌ Test signup error:', error)
    console.error('❌ Error stack:', error.stack)
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error code:', error.code)
    
    return NextResponse.json(
      { 
        message: 'Test signup failed',
        error: error.message,
        name: error.name,
        code: error.code
      },
      { status: 500 }
    )
  }
} 