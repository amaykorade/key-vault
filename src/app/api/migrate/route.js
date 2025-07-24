import { PrismaClient } from '@prisma/client';

export async function POST() {
  try {
    const prisma = new PrismaClient();
    
    console.log('Starting database migration...');
    
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Enable UUID extension
    try {
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      console.log('UUID extension enabled');
    } catch (extError) {
      console.log('UUID extension already exists or not needed');
    }
    
    // Push the schema directly (this is more reliable in serverless environments)
    try {
      // Import and use Prisma's push functionality
      const { execSync } = await import('child_process');
      
      console.log('Pushing schema to database...');
      execSync('npx prisma db push --accept-data-loss', { 
        stdio: 'pipe',
        env: { ...process.env }
      });
      console.log('Schema push successful');
    } catch (pushError) {
      console.error('Schema push error:', pushError);
      throw new Error(`Schema push failed: ${pushError.message}`);
    }
    
    await prisma.$disconnect();
    console.log('Database migration completed successfully');
    
    return Response.json({ 
      success: true, 
      message: 'Database migration completed successfully' 
    });
  } catch (error) {
    console.error('Migration error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 