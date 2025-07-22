import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

export async function POST() {
  try {
    const prisma = new PrismaClient();
    
    // Enable UUID extension
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Run migrations using prisma migrate deploy
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'pipe',
        env: { ...process.env }
      });
    } catch (migrationError) {
      console.error('Migration command error:', migrationError);
      // Try alternative approach - push the schema
      try {
        execSync('npx prisma db push', { 
          stdio: 'pipe',
          env: { ...process.env }
        });
      } catch (pushError) {
        console.error('Schema push error:', pushError);
        throw new Error('Failed to migrate database');
      }
    }
    
    await prisma.$disconnect();
    
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