#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupDatabase() {
  try {
    console.log('🔧 Setting up Key Vault Database...\n')

    // Test database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!\n')

    // Run migrations
    console.log('🔄 Running database migrations...')
    const { execSync } = await import('child_process')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Migrations completed!\n')

    // Check if admin user exists
    const adminUser = await prisma.users.findFirst({
      where: { role: 'ADMIN' }
    })

    if (adminUser) {
      console.log('👤 Admin user already exists.')
      const createAnother = await question('Do you want to create another admin user? (y/N): ')
      if (createAnother.toLowerCase() !== 'y') {
        console.log('✅ Database setup complete!')
        return
      }
    }

    // Create admin user
    console.log('👤 Creating admin user...')
    const email = await question('Enter admin email: ')
    const password = await question('Enter admin password: ')
    const name = await question('Enter admin name (optional): ') || null

    if (!email || !password) {
      console.log('❌ Email and password are required!')
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN'
      }
    })

    console.log(`✅ Admin user created successfully!`)
    console.log(`   Email: ${user.email}`)
    console.log(`   ID: ${user.id}\n`)

    // Create default folder
    console.log('📁 Creating default folder...')
    await prisma.folders.create({
      data: {
        name: 'General',
        description: 'Default folder for your keys',
        color: '#3B82F6',
        userId: user.id
      }
    })
    console.log('✅ Default folder created!\n')

    console.log('🎉 Database setup completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Visit http://localhost:3000')
    console.log('3. Login with your admin credentials')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

setupDatabase() 