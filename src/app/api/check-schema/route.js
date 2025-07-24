import { NextResponse } from 'next/server'
import prisma from '../../../lib/database'

export async function GET() {
  try {
    console.log('Checking database schema...');
    
    // Connect to database
    await prisma.$connect();
    
    // Get table information
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    // Get User table columns
    const userColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position
    `;
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      tables: tables,
      userColumns: userColumns
    });
    
  } catch (error) {
    console.error('Schema check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 