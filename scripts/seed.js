#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // Create test user
  const hashedPassword = await bcrypt.hash('testpassword123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create a default folder
  const folder = await prisma.folder.upsert({
    where: { 
      id: 'default'  // Using a fixed ID for the default folder
    },
    update: {},
    create: {
      id: 'default',
      name: 'Default',
      userId: user.id,
    },
  });

  console.log('✅ Created default folder');

  // Create some test keys
  const testKeys = [
    {
      name: 'API Key',
      description: 'Test API key',
      value: 'test_api_key_12345',
      type: 'API_KEY',
      tags: ['test', 'api'],
    },
    {
      name: 'Database Password',
      description: 'Test database password',
      value: 'db_password_67890',
      type: 'PASSWORD',
      tags: ['test', 'database'],
    },
    {
      name: 'OAuth Secret',
      description: 'Test OAuth client secret',
      value: 'oauth_secret_abcde',
      type: 'SECRET',
      tags: ['test', 'oauth'],
    },
  ];

  for (const keyData of testKeys) {
    const key = await prisma.key.create({
      data: {
        ...keyData,
        userId: user.id,
        folderId: folder.id,
      },
    });
    console.log('✅ Created test key:', key.name);
  }

  console.log('✨ Seeding completed');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 