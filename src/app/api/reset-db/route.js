import { PrismaClient } from '@prisma/client';

export async function POST() {
  try {
    const prisma = new PrismaClient();
    
    // Drop all tables first (one by one)
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "verification_tokens" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "accounts" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "payments" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "refresh_tokens" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "audit_logs" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "sessions" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "keys" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "folders" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "users" CASCADE`);
    
    // Drop enums (one by one)
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "UserPlan" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "UserRole" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "KeyType" CASCADE`);
    await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "AuditAction" CASCADE`);
    
    // Enable UUID extension
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Create enums first (one by one)
    await prisma.$executeRawUnsafe(`CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PRO', 'TEAM')`);
    await prisma.$executeRawUnsafe(`CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER')`);
    await prisma.$executeRawUnsafe(`CREATE TYPE "KeyType" AS ENUM ('PASSWORD', 'API_KEY', 'SSH_KEY', 'CERTIFICATE', 'SECRET', 'OTHER')`);
    await prisma.$executeRawUnsafe(`CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT')`);
    
    // Create users table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "password" TEXT NOT NULL,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "plan" "UserPlan" NOT NULL DEFAULT 'FREE',
        "apiToken" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create folders table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "folders" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "color" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT NOT NULL,
        "parentId" TEXT,
        CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create keys table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "keys" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "value" TEXT NOT NULL,
        "type" "KeyType" NOT NULL DEFAULT 'PASSWORD',
        "tags" TEXT[] NOT NULL DEFAULT '{}',
        "isFavorite" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT NOT NULL,
        "folderId" TEXT,
        CONSTRAINT "keys_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create sessions table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "sessions" (
        "id" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create audit_logs table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "audit_logs" (
        "id" TEXT NOT NULL,
        "action" "AuditAction" NOT NULL,
        "resource" TEXT NOT NULL,
        "resourceId" TEXT,
        "details" JSONB,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT,
        CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create refresh_tokens table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "refresh_tokens" (
        "id" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "revoked" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create payments table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "payments" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "paymentId" TEXT NOT NULL,
        "signature" TEXT NOT NULL,
        "plan" "UserPlan" NOT NULL,
        "amount" INTEGER NOT NULL,
        "currency" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create accounts table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "accounts" (
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
        CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create verification_tokens table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "verification_tokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier", "token")
      )
    `);
    
    // Add unique constraints (one by one)
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD CONSTRAINT "users_apiToken_key" UNIQUE ("apiToken")`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_key" UNIQUE ("token")`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_token_key" UNIQUE ("token")`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_token_key" UNIQUE ("token")`);
    
    // Add foreign key constraints (one by one)
    await prisma.$executeRawUnsafe(`ALTER TABLE "keys" ADD CONSTRAINT "keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "keys" ADD CONSTRAINT "keys_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    
    await prisma.$disconnect();
    
    return Response.json({ 
      success: true, 
      message: 'Database reset and recreated successfully' 
    });
  } catch (error) {
    console.error('Database reset error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 