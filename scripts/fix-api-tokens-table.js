import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixApiTokensTable() {
  try {
    console.log('🔧 Fixing missing api_tokens table in production database...')
    
    // Check if the api_tokens table exists
    console.log('🔍 Checking if api_tokens table exists...')
    try {
      const tableCheck = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'api_tokens'
      `
      
      if (tableCheck.length > 0) {
        console.log('✅ api_tokens table already exists')
        return
      }
    } catch (error) {
      console.log('ℹ️ Could not check table existence:', error.message)
    }
    
    console.log('❌ api_tokens table missing! Creating it now...')
    
    // Create the api_tokens table
    await prisma.$executeRaw`
      CREATE TABLE "api_tokens" (
        "id" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "name" TEXT,
        "permissions" TEXT[],
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "expiresAt" TIMESTAMP(3),
        "lastUsedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "api_tokens_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ api_tokens table created successfully!')
    
    // Create the unique index on token
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX "api_tokens_token_key" ON "api_tokens"("token")
    `
    console.log('✅ Unique index on token created successfully!')
    
    // Add foreign key constraint
    await prisma.$executeRaw`
      ALTER TABLE "api_tokens" ADD CONSTRAINT "api_tokens_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `
    console.log('✅ Foreign key constraint added successfully!')
    
    // Verify the table was created
    console.log('🔍 Verifying table creation...')
    const verifyTable = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'api_tokens'
    `
    
    if (verifyTable.length > 0) {
      console.log('✅ Table verification successful!')
      
      // Check table structure
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'api_tokens'
        ORDER BY ordinal_position
      `
      
      console.log('📊 Table structure:')
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`)
      })
      
    } else {
      throw new Error('Table verification failed')
    }
    
    console.log('🎉 api_tokens table fix completed successfully!')
    
  } catch (error) {
    console.error('❌ Failed to fix api_tokens table:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixApiTokensTable()
  .then(() => {
    console.log('✅ API tokens table fix completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ API tokens table fix failed:', error)
    process.exit(1)
  }) 