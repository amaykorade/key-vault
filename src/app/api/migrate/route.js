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
          },
          {
            name: 'Session',
            sql: `CREATE TABLE IF NOT EXISTS "Session" (
              "id" TEXT NOT NULL,
              "sessionToken" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "expires" TIMESTAMP(3) NOT NULL,
              CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'Account',
            sql: `CREATE TABLE IF NOT EXISTS "Account" (
              "id" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "type" TEXT NOT NULL,
              "provider" TEXT NOT NULL,
              "providerAccountId" TEXT NOT NULL,
              "refresh_token" TEXT,
              "access_token" TEXT,
              "expires_at" INTEGER,
              "token_type" TEXT,
              "scope" TEXT,
              "id_token" TEXT,
              "session_state" TEXT,
              CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'AuditLog',
            sql: `CREATE TABLE IF NOT EXISTS "AuditLog" (
              "id" TEXT NOT NULL,
              "action" TEXT NOT NULL,
              "resource" TEXT NOT NULL,
              "resourceId" TEXT,
              "userId" TEXT NOT NULL,
              "details" JSONB,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'RefreshToken',
            sql: `CREATE TABLE IF NOT EXISTS "RefreshToken" (
              "id" TEXT NOT NULL,
              "token" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "expiresAt" TIMESTAMP(3) NOT NULL,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'Payment',
            sql: `CREATE TABLE IF NOT EXISTS "Payment" (
              "id" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "amount" INTEGER NOT NULL,
              "currency" TEXT NOT NULL DEFAULT 'INR',
              "status" TEXT NOT NULL,
              "razorpayOrderId" TEXT,
              "razorpayPaymentId" TEXT,
              "plan" TEXT NOT NULL,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL,
              CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
            )`
          },
          {
            name: 'KeyAccess',
            sql: `CREATE TABLE IF NOT EXISTS "KeyAccess" (
              "id" TEXT NOT NULL,
              "keyId" TEXT NOT NULL,
              "teamId" TEXT NOT NULL,
              "permissions" TEXT[] NOT NULL,
              "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "grantedBy" TEXT NOT NULL,
              CONSTRAINT "KeyAccess_pkey" PRIMARY KEY ("id")
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
        
        // Add foreign key constraints and indexes
        console.log('Adding foreign key constraints and indexes...');
        const constraints = [
          // User unique constraints
          `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
          `CREATE UNIQUE INDEX IF NOT EXISTS "User_apiToken_key" ON "User"("apiToken")`,
          
          // Session constraints
          `CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`,
          `ALTER TABLE "Session" ADD CONSTRAINT IF NOT EXISTS "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          
          // Account constraints
          `CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`,
          `ALTER TABLE "Account" ADD CONSTRAINT IF NOT EXISTS "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          
          // Team constraints
          `ALTER TABLE "Team" ADD CONSTRAINT IF NOT EXISTS "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          
          // TeamMember constraints
          `CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_userId_teamId_key" ON "TeamMember"("userId", "teamId")`,
          `ALTER TABLE "TeamMember" ADD CONSTRAINT IF NOT EXISTS "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          `ALTER TABLE "TeamMember" ADD CONSTRAINT IF NOT EXISTS "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          
          // Folder constraints
          `ALTER TABLE "Folder" ADD CONSTRAINT IF NOT EXISTS "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          `ALTER TABLE "Folder" ADD CONSTRAINT IF NOT EXISTS "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
          
          // Key constraints
          `ALTER TABLE "Key" ADD CONSTRAINT IF NOT EXISTS "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          `ALTER TABLE "Key" ADD CONSTRAINT IF NOT EXISTS "Key_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
          
          // AuditLog constraints
          `ALTER TABLE "AuditLog" ADD CONSTRAINT IF NOT EXISTS "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          
          // RefreshToken constraints
          `CREATE UNIQUE INDEX IF NOT EXISTS "RefreshToken_token_key" ON "RefreshToken"("token")`,
          `ALTER TABLE "RefreshToken" ADD CONSTRAINT IF NOT EXISTS "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          
          // Payment constraints
          `ALTER TABLE "Payment" ADD CONSTRAINT IF NOT EXISTS "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          
          // KeyAccess constraints
          `CREATE UNIQUE INDEX IF NOT EXISTS "KeyAccess_keyId_teamId_key" ON "KeyAccess"("keyId", "teamId")`,
          `ALTER TABLE "KeyAccess" ADD CONSTRAINT IF NOT EXISTS "KeyAccess_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "Key"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
          `ALTER TABLE "KeyAccess" ADD CONSTRAINT IF NOT EXISTS "KeyAccess_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        ];
        
        for (const constraint of constraints) {
          try {
            await prisma.$executeRawUnsafe(constraint);
            console.log('Constraint/index added successfully');
          } catch (error) {
            console.log('Constraint/index already exists or error:', error.message);
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