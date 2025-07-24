import { NextResponse } from 'next/server'
import prisma from '../../../lib/database'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try to query the User table
    const userCount = await prisma.user.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      nodeEnv: process.env.NODE_ENV
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 })
  }
} 