import { NextResponse } from 'next/server'
import prisma from '../../../lib/database'

export async function POST() {
  try {
    console.log('Fixing Session table...');
    
    // Connect to database
    await prisma.$connect();
    
    // Drop unused sessionToken column if it exists
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Session" 
        DROP COLUMN IF EXISTS "sessionToken"
      `);
      console.log('Dropped sessionToken column from Session table');
    } catch (error) {
      console.log('sessionToken column might not exist:', error.message);
    }
    
    // Add missing columns to Session table
    const sessionColumns = [
      { column: 'token', type: 'TEXT' },
      { column: 'expiresAt', type: 'TIMESTAMP(3)' },
      { column: 'createdAt', type: 'TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { column: 'updatedAt', type: 'TIMESTAMP(3) NOT NULL' },
      { column: 'userId', type: 'TEXT NOT NULL' }
    ];
    
    for (const { column, type } of sessionColumns) {
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "Session" 
          ADD COLUMN "${column}" ${type}
        `);
        console.log(`Added ${column} to Session table`);
      } catch (error) {
        console.log(`${column} in Session might already exist:`, error.message);
      }
    }
    
    // Add missing columns to RefreshToken table
    const refreshTokenColumns = [
      { column: 'token', type: 'TEXT' },
      { column: 'expiresAt', type: 'TIMESTAMP(3)' },
      { column: 'createdAt', type: 'TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { column: 'updatedAt', type: 'TIMESTAMP(3) NOT NULL' },
      { column: 'userId', type: 'TEXT NOT NULL' }
    ];
    
    for (const { column, type } of refreshTokenColumns) {
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "RefreshToken" 
          ADD COLUMN "${column}" ${type}
        `);
        console.log(`Added ${column} to RefreshToken table`);
      } catch (error) {
        console.log(`${column} in RefreshToken might already exist:`, error.message);
      }
    }
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Session and RefreshToken tables fixed successfully'
    });
    
  } catch (error) {
    console.error('Session fix error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 