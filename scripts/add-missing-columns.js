import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns to production database...')
    
    // Add missing columns to users table
    const missingColumns = [
      {
        name: 'projectCount',
        sql: 'ALTER TABLE "users" ADD COLUMN "projectCount" INTEGER NOT NULL DEFAULT 0'
      },
      {
        name: 'keyCount',
        sql: 'ALTER TABLE "users" ADD COLUMN "keyCount" INTEGER NOT NULL DEFAULT 0'
      },
      {
        name: 'lastUsageUpdate',
        sql: 'ALTER TABLE "users" ADD COLUMN "lastUsageUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP'
      }
    ]
    
    for (const column of missingColumns) {
      try {
        console.log(`🔍 Adding ${column.name} column...`)
        await prisma.$executeRawUnsafe(column.sql)
        console.log(`✅ ${column.name} column added successfully`)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️ ${column.name} column already exists`)
        } else {
          console.error(`❌ Failed to add ${column.name} column:`, error.message)
        }
      }
    }
    
    // Add missing column to keys table
    try {
      console.log('🔍 Adding expiresAt column to keys table...')
      await prisma.$executeRaw`ALTER TABLE "keys" ADD COLUMN "expiresAt" TIMESTAMP(3)`
      console.log('✅ expiresAt column added to keys table successfully')
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ expiresAt column already exists in keys table')
      } else {
        console.error('❌ Failed to add expiresAt column to keys table:', error.message)
      }
    }
    
    // Check if plan_limits table exists
    try {
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
    } catch (error) {
      console.error('❌ Error checking/creating plan_limits table:', error.message)
    }
    
    console.log('🎉 Missing columns added successfully!')
    
  } catch (error) {
    console.error('❌ Failed to add missing columns:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
addMissingColumns()
  .then(() => {
    console.log('✅ Column addition completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Column addition failed:', error)
    process.exit(1)
  }) 