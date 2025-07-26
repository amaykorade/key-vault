import { PrismaClient } from '@prisma/client';

export async function POST() {
  try {
    const prisma = new PrismaClient();
    
    // Enable UUID extension
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Create enums first (PostgreSQL doesn't support IF NOT EXISTS for enums)
    try {
      await prisma.$executeRawUnsafe(`CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PRO', 'TEAM')`);
    } catch (e) {
      // Enum might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER')`);
    } catch (e) {
      // Enum might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`CREATE TYPE "KeyType" AS ENUM ('PASSWORD', 'API_KEY', 'SSH_KEY', 'CERTIFICATE', 'SECRET', 'OTHER')`);
    } catch (e) {
      // Enum might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT')`);
    } catch (e) {
      // Enum might already exist
    }
    
    // Create users table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
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
      CREATE TABLE IF NOT EXISTS "folders" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "parentId" TEXT,
        CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create keys table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "keys" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "type" "KeyType" NOT NULL DEFAULT 'PASSWORD',
        "value" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT NOT NULL,
        "folderId" TEXT NOT NULL,
        CONSTRAINT "keys_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create sessions table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "sessions" (
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
      CREATE TABLE IF NOT EXISTS "audit_logs" (
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
      CREATE TABLE IF NOT EXISTS "refresh_tokens" (
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
      CREATE TABLE IF NOT EXISTS "payments" (
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
      CREATE TABLE IF NOT EXISTS "accounts" (
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
      CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier", "token")
      )
    `);
    
    // Create teams table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "teams" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "ownerId" TEXT NOT NULL,
        CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create team_members table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "team_members" (
        "id" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'MEMBER',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "invitedBy" TEXT,
        "userId" TEXT NOT NULL,
        "teamId" TEXT NOT NULL,
        CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Create key_accesses table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "key_accesses" (
        "id" TEXT NOT NULL,
        "permissions" TEXT[] NOT NULL,
        "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "grantedBy" TEXT NOT NULL,
        "keyId" TEXT NOT NULL,
        "teamId" TEXT NOT NULL,
        CONSTRAINT "key_accesses_pkey" PRIMARY KEY ("id")
      )
    `);
    
    // Add unique constraints (one by one to avoid errors if they already exist)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD CONSTRAINT "users_apiToken_key" UNIQUE ("apiToken")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_key" UNIQUE ("token")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_token_key" UNIQUE ("token")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_token_key" UNIQUE ("token")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    // Add foreign key constraints (one by one)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "keys" ADD CONSTRAINT "keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "keys" ADD CONSTRAINT "keys_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    // Add foreign key constraints for teams and related tables
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "teams" ADD CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "key_accesses" ADD CONSTRAINT "key_accesses_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "keys"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "key_accesses" ADD CONSTRAINT "key_accesses_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      // Constraint might already exist
    }
    
    // Add unique constraints for teams and related tables
    try {
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "team_members_userId_teamId_key" ON "team_members"("userId", "teamId")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "key_accesses_keyId_teamId_key" ON "key_accesses"("keyId", "teamId")`);
    } catch (e) {
      // Constraint might already exist
    }
    
    await prisma.$disconnect();
    
    return Response.json({ 
      success: true, 
      message: 'Database tables created successfully' 
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 