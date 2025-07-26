#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updateAdminPassword() {
  try {
    console.log('🔧 Updating admin password...\n')

    // New password that meets requirements: Admin123
    const newPassword = 'Admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    const user = await prisma.users.update({
      where: { email: 'amaykorade@gmail.com' },
      data: { password: hashedPassword }
    })

    console.log('✅ Admin password updated successfully!')
    console.log(`   Email: ${user.email}`)
    console.log(`   New password: ${newPassword}`)
    console.log('\nYou can now login with:')
    console.log('   Email: amaykorade@gmail.com')
    console.log('   Password: Admin123')

  } catch (error) {
    console.error('❌ Failed to update admin password:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminPassword() 