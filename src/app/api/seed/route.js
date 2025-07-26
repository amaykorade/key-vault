import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Create test user first
    const hashedPassword = await bcrypt.hash('Password123', 10);
    const user = await prisma.users.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    // Create default folder
          await prisma.folders.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        name: 'Default',
        description: 'Default folder for keys',
        userId: user.id
      }
    });

    // Create some test keys
            await prisma.keys.create({
      data: {
        name: 'Database Password',
        description: 'Production database password',
        type: 'PASSWORD',
        value: 'encrypted-value-placeholder',
        userId: user.id,
        folderId: 'default'
      }
    });

    return Response.json({ 
      success: true, 
      message: 'Database seeded successfully',
      testUser: {
        email: 'test@example.com',
        password: 'Password123'
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 