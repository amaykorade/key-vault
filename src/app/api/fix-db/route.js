import { NextResponse } from 'next/server'
import prisma from '../../../lib/database'

export async function POST() {
  try {
    console.log('Starting database fix...');
    
    // Connect to database
    await prisma.$connect();
    
    // Add the missing subscriptionExpiresAt column
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "User" 
        ADD COLUMN "subscriptionExpiresAt" TIMESTAMP(3)
      `);
      console.log('Added subscriptionExpiresAt column');
    } catch (error) {
      console.log('Column might already exist:', error.message);
    }
    
    // Add other missing columns
    const columns = [
      { table: 'User', column: 'apiToken', type: 'TEXT' },
      { table: 'User', column: 'plan', type: 'TEXT NOT NULL DEFAULT \'FREE\'' },
      { table: 'Session', column: 'sessionToken', type: 'TEXT' },
      { table: 'Account', column: 'refresh_token', type: 'TEXT' },
      { table: 'Account', column: 'access_token', type: 'TEXT' },
      { table: 'Account', column: 'expires_at', type: 'INTEGER' },
      { table: 'Account', column: 'token_type', type: 'TEXT' },
      { table: 'Account', column: 'scope', type: 'TEXT' },
      { table: 'Account', column: 'id_token', type: 'TEXT' },
      { table: 'Account', column: 'session_state', type: 'TEXT' },
      { table: 'Key', column: 'tags', type: 'TEXT[]' },
      { table: 'Key', column: 'isFavorite', type: 'BOOLEAN NOT NULL DEFAULT false' },
      { table: 'AuditLog', column: 'details', type: 'JSONB' },
      { table: 'RefreshToken', column: 'token', type: 'TEXT' },
      { table: 'RefreshToken', column: 'expiresAt', type: 'TIMESTAMP(3)' },
      { table: 'Payment', column: 'razorpayOrderId', type: 'TEXT' },
      { table: 'Payment', column: 'razorpayPaymentId', type: 'TEXT' },
      { table: 'Payment', column: 'plan', type: 'TEXT NOT NULL' },
      { table: 'KeyAccess', column: 'permissions', type: 'TEXT[] NOT NULL' },
      { table: 'KeyAccess', column: 'grantedAt', type: 'TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { table: 'KeyAccess', column: 'grantedBy', type: 'TEXT NOT NULL' }
    ];
    
    for (const { table, column, type } of columns) {
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "${table}" 
          ADD COLUMN "${column}" ${type}
        `);
        console.log(`Added ${column} to ${table}`);
      } catch (error) {
        console.log(`${column} in ${table} might already exist:`, error.message);
      }
    }
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Database columns fixed successfully'
    });
    
  } catch (error) {
    console.error('Database fix error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 