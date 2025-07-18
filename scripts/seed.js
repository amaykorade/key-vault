#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { encrypt } from '../src/lib/encryption.js'

const prisma = new PrismaClient()

const sampleUsers = [
  {
    email: 'admin@keyvault.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN'
  },
  {
    email: 'user@keyvault.com',
    password: 'user123',
    name: 'Regular User',
    role: 'USER'
  }
]

const sampleFolders = [
  {
    name: 'Work',
    description: 'Work-related keys and passwords',
    color: '#10B981'
  },
  {
    name: 'Personal',
    description: 'Personal accounts and passwords',
    color: '#F59E0B'
  },
  {
    name: 'Development',
    description: 'Development and API keys',
    color: '#8B5CF6'
  }
]

const sampleKeys = [
  {
    name: 'GitHub Personal Access Token',
    description: 'GitHub API access token for personal projects',
    value: 'ghp_example_token_here',
    type: 'API_KEY',
    tags: ['github', 'development', 'api']
  },
  {
    name: 'AWS Access Key',
    description: 'AWS IAM access key for cloud services',
    value: 'AKIAIOSFODNN7EXAMPLE',
    type: 'API_KEY',
    tags: ['aws', 'cloud', 'production']
  },
  {
    name: 'Database Password',
    description: 'Main database password',
    value: 'super_secure_db_password_123',
    type: 'PASSWORD',
    tags: ['database', 'production']
  },
  {
    name: 'SSH Private Key',
    description: 'SSH key for server access',
    value: '-----BEGIN OPENSSH PRIVATE KEY-----\nexample_key_content\n-----END OPENSSH PRIVATE KEY-----',
    type: 'SSH_KEY',
    tags: ['ssh', 'server', 'deployment']
  },
  {
    name: 'Email Password',
    description: 'Primary email account password',
    value: 'email_password_secure_456',
    type: 'PASSWORD',
    tags: ['email', 'personal']
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...\n')

    // Create users
    console.log('👥 Creating sample users...')
    const users = []
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role
        }
      })
      users.push(user)
      console.log(`   ✅ Created user: ${user.email}`)
    }
    console.log()

    // Create folders for each user
    console.log('📁 Creating sample folders...')
    const folders = []
    for (const user of users) {
      for (const folderData of sampleFolders) {
        const folder = await prisma.folder.create({
          data: {
            ...folderData,
            userId: user.id
          }
        })
        folders.push(folder)
        console.log(`   ✅ Created folder: ${folder.name} for ${user.email}`)
      }
    }
    console.log()

    // Create keys for each user
    console.log('🔑 Creating sample keys...')
    const masterPassword = 'master_password_for_seeding'
    
    for (const user of users) {
      const userFolders = folders.filter(f => f.userId === user.id)
      
      for (let i = 0; i < sampleKeys.length; i++) {
        const keyData = sampleKeys[i]
        const folder = userFolders[i % userFolders.length]
        
        const encryptedValue = encrypt(keyData.value, masterPassword)
        
        const key = await prisma.key.create({
          data: {
            name: keyData.name,
            description: keyData.description,
            value: encryptedValue,
            type: keyData.type,
            tags: keyData.tags,
            folderId: folder.id,
            userId: user.id,
            isFavorite: Math.random() > 0.7 // 30% chance of being favorite
          }
        })
        
        console.log(`   ✅ Created key: ${key.name} for ${user.email}`)
      }
    }
    console.log()

    // Create some audit logs
    console.log('📝 Creating sample audit logs...')
    for (const user of users) {
      const actions = ['LOGIN', 'CREATE', 'READ', 'UPDATE']
      for (let i = 0; i < 5; i++) {
        await prisma.auditLog.create({
          data: {
            action: actions[Math.floor(Math.random() * actions.length)],
            resource: ['key', 'folder', 'user'][Math.floor(Math.random() * 3)],
            userId: user.id,
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        })
      }
    }
    console.log('   ✅ Created sample audit logs\n')

    console.log('🎉 Database seeding completed successfully!')
    console.log('\nSample credentials:')
    console.log('Admin: admin@keyvault.com / admin123')
    console.log('User: user@keyvault.com / user123')
    console.log('\nNote: Keys are encrypted with master password: master_password_for_seeding')

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase() 