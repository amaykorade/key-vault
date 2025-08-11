import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixProductionSchema() {
  try {
    console.log('🔧 Fixing production database schema...')
    
    // Check if the permissions column exists
    console.log('🔍 Checking if permissions column exists...')
    
    try {
      // Try to query the permissions column
      const result = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'permissions'
      `
      console.log('📊 Current columns in users table:', result)
      
      if (result.length === 0) {
        console.log('❌ Permissions column missing! Adding it now...')
        
        // Add the missing permissions column
        await prisma.$executeRaw`
          ALTER TABLE "users" ADD COLUMN "permissions" JSONB
        `
        console.log('✅ Permissions column added successfully!')
        
        // Add other missing columns from the RBAC migration
        console.log('🔧 Adding other missing columns...')
        
        // Check and add failedLoginAttempts
        try {
          await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0
          `
          console.log('✅ failedLoginAttempts column added')
        } catch (e) {
          console.log('ℹ️ failedLoginAttempts column already exists or failed:', e.message)
        }
        
        // Check and add isActive
        try {
          await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true
          `
          console.log('✅ isActive column added')
        } catch (e) {
          console.log('ℹ️ isActive column already exists or failed:', e.message)
        }
        
        // Check and add lastLoginAt
        try {
          await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN "lastLoginAt" TIMESTAMP(3)
          `
          console.log('✅ lastLoginAt column added')
        } catch (e) {
          console.log('ℹ️ lastLoginAt column already exists or failed:', e.message)
        }
        
        // Check and add lockedUntil
        try {
          await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN "lockedUntil" TIMESTAMP(3)
          `
          console.log('✅ lockedUntil column added')
        } catch (e) {
          console.log('ℹ️ lockedUntil column already exists or failed:', e.message)
        }
        
        // Check and add keyCount
        try {
          await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN "keyCount" INTEGER NOT NULL DEFAULT 0
          `
          console.log('✅ keyCount column added')
        } catch (e) {
          console.log('ℹ️ keyCount column already exists or failed:', e.message)
        }
        
        // Check and add lastUsageUpdate
        try {
          await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN "lastUsageUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          `
          console.log('✅ lastUsageUpdate column added')
        } catch (e) {
          console.log('ℹ️ lastUsageUpdate column already exists or failed:', e.message)
        }
        
        // Check and add projectCount
        try {
          await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN "projectCount" INTEGER NOT NULL DEFAULT 0
          `
          console.log('✅ projectCount column added')
        } catch (e) {
          console.log('ℹ️ projectCount column already exists or failed:', e.message)
        }
        
        // Check and add expiresAt to keys table
        try {
          await prisma.$executeRaw`
            ALTER TABLE "keys" ADD COLUMN "expiresAt" TIMESTAMP(3)
          `
          console.log('✅ expiresAt column added to keys table')
        } catch (e) {
          console.log('ℹ️ expiresAt column already exists in keys table or failed:', e.message)
        }
        
      } else {
        console.log('✅ Permissions column already exists')
      }
      
      // Check if the permissions table exists
      console.log('🔍 Checking if permissions table exists...')
      const permissionsTable = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'permissions'
      `
      
      if (permissionsTable.length === 0) {
        console.log('❌ Permissions table missing! Creating it now...')
        
        // Create the permissions table
        await prisma.$executeRaw`
          CREATE TABLE "permissions" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "category" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
          )
        `
        console.log('✅ Permissions table created successfully!')
        
        // Create the roles table
        await prisma.$executeRaw`
          CREATE TABLE "roles" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "isSystem" BOOLEAN NOT NULL DEFAULT false,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
          )
        `
        console.log('✅ Roles table created successfully!')
        
        // Create the role_permissions table
        await prisma.$executeRaw`
          CREATE TABLE "role_permissions" (
            "id" TEXT NOT NULL,
            "roleId" TEXT NOT NULL,
            "permissionId" TEXT NOT NULL,
            "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "grantedBy" TEXT NOT NULL,
            CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
          )
        `
        console.log('✅ Role_permissions table created successfully!')
        
        // Create the access_control_lists table
        await prisma.$executeRaw`
          CREATE TABLE "access_control_lists" (
            "id" TEXT NOT NULL,
            "resourceType" TEXT NOT NULL,
            "resourceId" TEXT NOT NULL,
            "userId" TEXT,
            "teamId" TEXT,
            "roleId" TEXT,
            "permissions" TEXT[],
            "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "grantedBy" TEXT NOT NULL,
            "expiresAt" TIMESTAMP(3),
            CONSTRAINT "access_control_lists_pkey" PRIMARY KEY ("id")
          )
        `
        console.log('✅ Access_control_lists table created successfully!')
        
        // Create the access_audit_logs table
        await prisma.$executeRaw`
          CREATE TABLE "access_audit_logs" (
            "id" TEXT NOT NULL,
            "userId" TEXT,
            "action" TEXT NOT NULL,
            "resourceType" TEXT NOT NULL,
            "resourceId" TEXT,
            "permissions" TEXT[],
            "result" TEXT NOT NULL,
            "ipAddress" TEXT,
            "userAgent" TEXT,
            "metadata" JSONB,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "access_audit_logs_pkey" PRIMARY KEY ("id")
          )
        `
        console.log('✅ Access_audit_logs table created successfully!')
        
        // Add indexes
        await prisma.$executeRaw`CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name")`
        await prisma.$executeRaw`CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name")`
        await prisma.$executeRaw`CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId")`
        await prisma.$executeRaw`CREATE UNIQUE INDEX "access_control_lists_resourceType_resourceId_userId_teamId__key" ON "access_control_lists"("resourceType", "resourceId", "userId", "teamId", "roleId")`
        
        console.log('✅ All indexes created successfully!')
        
        // Add foreign key constraints
        await prisma.$executeRaw`ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        await prisma.$executeRaw`ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        await prisma.$executeRaw`ALTER TABLE "access_control_lists" ADD CONSTRAINT "access_control_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        await prisma.$executeRaw`ALTER TABLE "access_control_lists" ADD CONSTRAINT "access_control_lists_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        await prisma.$executeRaw`ALTER TABLE "access_control_lists" ADD CONSTRAINT "access_control_lists_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        await prisma.$executeRaw`ALTER TABLE "access_audit_logs" ADD CONSTRAINT "access_audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        
        console.log('✅ All foreign key constraints added successfully!')
        
        // Check if plan_limits table exists
        console.log('🔍 Checking if plan_limits table exists...')
        const planLimitsTable = await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_name = 'plan_limits'
        `
        
        if (planLimitsTable.length === 0) {
          console.log('❌ Plan_limits table missing! Creating it now...')
          
          // Create the plan_limits table
          await prisma.$executeRaw`
            CREATE TABLE "plan_limits" (
              "id" TEXT NOT NULL,
              "plan" TEXT NOT NULL,
              "maxProjects" INTEGER NOT NULL DEFAULT 1,
              "maxKeysPerProject" INTEGER NOT NULL DEFAULT 5,
              "maxKeysTotal" INTEGER NOT NULL DEFAULT 5,
              "hasTeamFeatures" BOOLEAN NOT NULL DEFAULT false,
              "hasRBAC" BOOLEAN NOT NULL DEFAULT false,
              "hasExpiringSecrets" BOOLEAN NOT NULL DEFAULT false,
              "hasAPIAnalytics" BOOLEAN NOT NULL DEFAULT false,
              "hasEmailSupport" BOOLEAN NOT NULL DEFAULT false,
              "hasPrioritySupport" BOOLEAN NOT NULL DEFAULT false,
              "price" INTEGER NOT NULL DEFAULT 0,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL,
              CONSTRAINT "plan_limits_pkey" PRIMARY KEY ("id")
            )
          `
          console.log('✅ Plan_limits table created successfully!')
          
          // Add unique index
          await prisma.$executeRaw`CREATE UNIQUE INDEX "plan_limits_plan_key" ON "plan_limits"("plan")`
          console.log('✅ Plan_limits unique index created successfully!')
          
        } else {
          console.log('✅ Plan_limits table already exists')
        }
        
      } else {
        console.log('✅ Permissions table already exists')
      }
      
      console.log('🎉 Production database schema fixed successfully!')
      
    } catch (error) {
      console.error('❌ Error checking/fixing schema:', error)
      throw error
    }
    
  } catch (error) {
    console.error('❌ Failed to fix production schema:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixProductionSchema()
  .then(() => {
    console.log('✅ Schema fix completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Schema fix failed:', error)
    process.exit(1)
  }) 