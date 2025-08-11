import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    console.log('🔍 Debug route called');
    
    // Check environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasEncryptionKey: !!process.env.ENCRYPTION_KEY,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      databaseUrlPreview: process.env.DATABASE_URL ? 
        `${process.env.DATABASE_URL.substring(0, 20)}...` : 'NOT SET'
    };
    
    console.log('📋 Environment check:', envCheck);
    
    // Test database connection
    let dbStatus = 'Not tested';
    let userCount = 0;
    
    if (process.env.DATABASE_URL) {
      try {
        console.log('🔌 Testing database connection...');
        const prisma = new PrismaClient();
        await prisma.$connect();
        console.log('✅ Database connected!');
        
        // Try a simple query
        userCount = await prisma.users.count();
        console.log(`📊 Users found: ${userCount}`);
        
        await prisma.$disconnect();
        dbStatus = 'Connected successfully';
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        dbStatus = `Error: ${dbError.message}`;
      }
    } else {
      dbStatus = 'No DATABASE_URL set';
    }
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        userCount: userCount
      },
      message: 'Debug information retrieved successfully'
    };
    
    console.log('📊 Debug info:', debugInfo);
    
    return NextResponse.json(debugInfo);
    
  } catch (error) {
    console.error('❌ Debug route error:', error);
    return NextResponse.json(
      { 
        error: 'Debug route failed', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 