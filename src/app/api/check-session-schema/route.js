import { NextResponse } from 'next/server'
import prisma from '../../../lib/database'

export async function GET() {
  try {
    console.log('Checking Session table schema...');
    
    // Connect to database
    await prisma.$connect();
    
    // Get Session table columns
    const sessionColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Session' 
      ORDER BY ordinal_position
    `;
    
    // Get RefreshToken table columns
    const refreshTokenColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'RefreshToken' 
      ORDER BY ordinal_position
    `;
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      sessionColumns: sessionColumns,
      refreshTokenColumns: refreshTokenColumns
    });
    
  } catch (error) {
    console.error('Schema check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 