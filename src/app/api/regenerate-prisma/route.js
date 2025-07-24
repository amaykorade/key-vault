import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function POST() {
  try {
    console.log('Regenerating Prisma client...');
    
    // Regenerate Prisma client
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    console.log('Prisma client regenerated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Prisma client regenerated successfully'
    });
    
  } catch (error) {
    console.error('Prisma regeneration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 