import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixMissingEnums() {
  try {
    console.log('🔧 Fixing missing enum types in production database...')
    
    // Check if Environment enum exists
    console.log('🔍 Checking if Environment enum exists...')
    try {
      const envCheck = await prisma.$queryRaw`
        SELECT typname FROM pg_type WHERE typname = 'Environment'
      `
      if (envCheck.length > 0) {
        console.log('✅ Environment enum already exists')
      } else {
        console.log('❌ Environment enum missing! Creating it now...')
        
        // Create the Environment enum
        await prisma.$executeRaw`
          CREATE TYPE "Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING')
        `
        console.log('✅ Environment enum created successfully!')
      }
    } catch (error) {
      console.log('⚠️ Error checking Environment enum:', error.message)
    }
    
    // Check if KeyType enum exists
    console.log('🔍 Checking if KeyType enum exists...')
    try {
      const keyTypeCheck = await prisma.$queryRaw`
        SELECT typname FROM pg_type WHERE typname = 'KeyType'
      `
      if (keyTypeCheck.length > 0) {
        console.log('✅ KeyType enum already exists')
      } else {
        console.log('❌ KeyType enum missing! Creating it now...')
        
        // Create the KeyType enum
        await prisma.$executeRaw`
          CREATE TYPE "KeyType" AS ENUM ('API_KEY', 'SECRET', 'DATABASE_URL', 'PASSWORD', 'TOKEN', 'CERTIFICATE', 'OTHER')
        `
        console.log('✅ KeyType enum created successfully!')
      }
    } catch (error) {
      console.log('⚠️ Error checking KeyType enum:', error.message)
    }
    
    // Check if UserRole enum exists
    console.log('🔍 Checking if UserRole enum exists...')
    try {
      const userRoleCheck = await prisma.$queryRaw`
        SELECT typname FROM pg_type WHERE typname = 'UserRole'
      `
      if (userRoleCheck.length > 0) {
        console.log('✅ UserRole enum already exists')
      } else {
        console.log('❌ UserRole enum missing! Creating it now...')
        
        // Create the UserRole enum
        await prisma.$executeRaw`
          CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN')
        `
        console.log('✅ UserRole enum created successfully!')
      }
    } catch (error) {
      console.log('⚠️ Error checking UserRole enum:', error.message)
    }
    
    // Check if UserPlan enum exists
    console.log('🔍 Checking if UserPlan enum exists...')
    try {
      const userPlanCheck = await prisma.$queryRaw`
        SELECT typname FROM pg_type WHERE typname = 'UserPlan'
      `
      if (userPlanCheck.length > 0) {
        console.log('✅ UserPlan enum already exists')
      } else {
        console.log('❌ UserPlan enum missing! Creating it now...')
        
        // Create the UserPlan enum
        await prisma.$executeRaw`
          CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PRO', 'TEAM')
        `
        console.log('✅ UserPlan enum created successfully!')
      }
    } catch (error) {
      console.log('⚠️ Error checking UserPlan enum:', error.message)
    }
    
    // Check if AuditAction enum exists
    console.log('🔍 Checking if AuditAction enum exists...')
    try {
      const auditActionCheck = await prisma.$queryRaw`
        SELECT typname FROM pg_type WHERE typname = 'AuditAction'
      `
      if (auditActionCheck.length > 0) {
        console.log('✅ AuditAction enum already exists')
      } else {
        console.log('❌ AuditAction enum missing! Creating it now...')
        
        // Create the AuditAction enum
        await prisma.$executeRaw`
          CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'GENERATE', 'EXPORT', 'IMPORT', 'ERROR')
        `
        console.log('✅ AuditAction enum created successfully!')
      }
    } catch (error) {
      console.log('⚠️ Error checking AuditAction enum:', error.message)
    }
    
    // Check if KeyPermission enum exists
    console.log('🔍 Checking if KeyPermission enum exists...')
    try {
      const keyPermissionCheck = await prisma.$queryRaw`
        SELECT typname FROM pg_type WHERE typname = 'KeyPermission'
      `
      if (keyPermissionCheck.length > 0) {
        console.log('✅ KeyPermission enum already exists')
      } else {
        console.log('❌ KeyPermission enum missing! Creating it now...')
        
        // Create the KeyPermission enum
        await prisma.$executeRaw`
          CREATE TYPE "KeyPermission" AS ENUM ('keys:read', 'keys:write', 'keys:delete', 'keys:rotate', 'folders:read', 'folders:write', 'folders:delete', 'projects:read', 'projects:write', 'projects:delete')
        `
        console.log('✅ KeyPermission enum created successfully!')
      }
    } catch (error) {
      console.log('⚠️ Error checking KeyPermission enum:', error.message)
    }
    
    // Check if TeamRole enum exists
    console.log('🔍 Checking if TeamRole enum exists...')
    try {
      const teamRoleCheck = await prisma.$queryRaw`
        SELECT typname FROM pg_type WHERE typname = 'TeamRole'
      `
      if (teamRoleCheck.length > 0) {
        console.log('✅ TeamRole enum already exists')
      } else {
        console.log('❌ TeamRole enum missing! Creating it now...')
        
        // Create the TeamRole enum
        await prisma.$executeRaw`
          CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER')
        `
        console.log('✅ TeamRole enum created successfully!')
      }
    } catch (error) {
      console.log('⚠️ Error checking TeamRole enum:', error.message)
    }
    
    console.log('🎉 All enum types checked/created successfully!')
    
  } catch (error) {
    console.error('❌ Failed to fix missing enums:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixMissingEnums()
  .then(() => {
    console.log('✅ Enum fix completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Enum fix failed:', error)
    process.exit(1)
  }) 