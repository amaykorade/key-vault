import { PrismaClient } from '@prisma/client';

export async function POST() {
  try {
    const prisma = new PrismaClient();
    
    // Enable UUID extension
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Push the schema directly (this will create tables if they don't exist)
    const { execSync } = await import('child_process');
    
    try {
      execSync('npx prisma db push --accept-data-loss', { 
        stdio: 'pipe',
        env: { ...process.env }
      });
    } catch (error) {
      console.error('Schema push error:', error);
      throw new Error('Failed to push database schema');
    }
    
    await prisma.$disconnect();
    
    return Response.json({ 
      success: true, 
      message: 'Database setup completed successfully' 
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 