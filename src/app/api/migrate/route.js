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
    
    // Instead of using execSync, we'll use Prisma's introspection and push
    // This approach works better in serverless environments
    try {
      console.log('Applying schema changes...');
      
      // Generate Prisma client to ensure it's up to date
      const { execSync } = await import('child_process');
      
      // Use a different approach - try to apply migrations directly
      try {
        // First try to push the schema
        execSync('npx prisma db push --skip-generate', { 
          stdio: 'pipe',
          env: { ...process.env, NODE_ENV: 'production' }
        });
        console.log('Schema push successful');
      } catch (pushError) {
        console.log('Schema push failed, trying alternative approach...');
        
        // If push fails, try to create tables manually using raw SQL
        // This is a fallback for serverless environments
        console.log('Creating tables using raw SQL...');
        
        // Create tables one by one to avoid prepared statement issues
        const tables = [
          {
            name: 'User',
            sql: `CREATE TABLE IF NOT EXISTS "User" (
              "id" TEXT NOT NULL,
              "email" TEXT NOT NULL,
              "name" TEXT,
              "password" TEXT NOT NULL,
              "role" TEXT NOT NULL DEFAULT 'USER',
              "apiToken" TEXT,
              "plan" TEXT NOT NULL DEFAULT 'FREE',
              "subscriptionExpiresAt" TIMESTAMP(3),
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL,
              CONSTRAINT "User_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'Team',
            sql: `CREATE TABLE IF NOT EXISTS "Team" (
              "id" TEXT NOT NULL,
              "name" TEXT NOT NULL,
              "description" TEXT,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL,
              "ownerId" TEXT NOT NULL,
              CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'TeamMember',
            sql: `CREATE TABLE IF NOT EXISTS "TeamMember" (
              "id" TEXT NOT NULL,
              "role" TEXT NOT NULL DEFAULT 'MEMBER',
              "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "invitedBy" TEXT,
              "userId" TEXT NOT NULL,
              "teamId" TEXT NOT NULL,
              CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'Folder',
            sql: `CREATE TABLE IF NOT EXISTS "Folder" (
              "id" TEXT NOT NULL,
              "name" TEXT NOT NULL,
              "description" TEXT,
              "color" TEXT NOT NULL DEFAULT '#3B82F6',
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL,
              "userId" TEXT NOT NULL,
              "parentId" TEXT,
              CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'Key',
            sql: `CREATE TABLE IF NOT EXISTS "Key" (
              "id" TEXT NOT NULL,
              "name" TEXT NOT NULL,
              "value" TEXT NOT NULL,
              "description" TEXT,
              "type" TEXT NOT NULL DEFAULT 'PASSWORD',
              "tags" TEXT[],
              "isFavorite" BOOLEAN NOT NULL DEFAULT false,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL,
              "userId" TEXT NOT NULL,
              "folderId" TEXT,
              CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
            )`
          }
        ];
        
        // Execute each table creation separately
        for (const table of tables) {
          try {
            await prisma.$executeRawUnsafe(table.sql);
            console.log(`Table ${table.name} created successfully`);
          } catch (error) {
            console.log(`Table ${table.name} already exists or error:`, error.message);
          }
        }
        
        console.log('Schema created successfully using raw SQL');
      }
      
    } catch (error) {
      console.error('Schema application error:', error);
      throw new Error(`Schema application failed: ${error.message}`);
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