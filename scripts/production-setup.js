const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting production setup...');

  try {
    // 1. Run database migrations
    console.log('📊 Running database migrations...');
    // Note: Prisma migrations should be run via: npx prisma migrate deploy
    
    // 2. Create test users with different plans
    console.log('👥 Creating test users...');
    
    const users = [
      {
        email: 'free@test.com',
        name: 'Free User',
        password: 'Password123', // Capital P
        plan: 'FREE',
        role: 'USER'
      },
      {
        email: 'pro@test.com',
        name: 'Pro User',
        password: 'Password123', // Capital P
        plan: 'PRO',
        role: 'USER'
      },
      {
        email: 'team@test.com',
        name: 'Team User',
        password: 'Password123', // Capital P
        plan: 'TEAM',
        role: 'USER'
      },
      {
        email: 'admin@test.com',
        name: 'Admin User',
        password: 'Password123', // Capital P
        plan: 'PRO',
        role: 'ADMIN'
      }
    ];

    for (const userData of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, updating...`);
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            plan: userData.plan,
            role: userData.role
          }
        });
      } else {
        console.log(`✅ Creating user: ${userData.email} (${userData.plan} plan)`);
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
            plan: userData.plan,
            role: userData.role
          }
        });
      }
    }

    // 3. Create subscription records for PRO and TEAM users
    console.log('💳 Setting up subscriptions...');
    
    const proUsers = await prisma.user.findMany({
      where: {
        plan: { in: ['PRO', 'TEAM'] }
      }
    });

    for (const user of proUsers) {
      const existingSubscription = await prisma.subscription.findFirst({
        where: { userId: user.id }
      });

      if (!existingSubscription) {
        console.log(`✅ Creating subscription for ${user.email}`);
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: user.plan,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            amount: user.plan === 'PRO' ? 900 : 2900, // $9.00 or $29.00 in cents
            currency: 'USD'
          }
        });
      }
    }

    // 4. Create sample projects and keys for testing
    console.log('📁 Creating sample projects and keys...');
    
    const testUser = await prisma.user.findUnique({
      where: { email: 'pro@test.com' }
    });

    if (testUser) {
      // Create a sample project
      const project = await prisma.folder.create({
        data: {
          name: 'Sample Project',
          description: 'A sample project for testing the production environment',
          color: '#3B82F6',
          userId: testUser.id,
          isProject: true
        }
      });

      // Create sample keys
      const sampleKeys = [
        {
          name: 'DATABASE_URL',
          value: 'postgresql://user:pass@localhost:5432/testdb',
          type: 'DATABASE_URL',
          description: 'Sample database connection string',
          environment: 'DEVELOPMENT',
          folderId: project.id,
          userId: testUser.id
        },
        {
          name: 'API_KEY',
          value: 'sk_test_sample_api_key_12345',
          type: 'API_KEY',
          description: 'Sample API key for testing',
          environment: 'DEVELOPMENT',
          folderId: project.id,
          userId: testUser.id
        },
        {
          name: 'JWT_SECRET',
          value: 'your-super-secret-jwt-key-here',
          type: 'SECRET',
          description: 'Sample JWT secret',
          environment: 'DEVELOPMENT',
          folderId: project.id,
          userId: testUser.id
        }
      ];

      for (const keyData of sampleKeys) {
        const existingKey = await prisma.key.findFirst({
          where: {
            name: keyData.name,
            folderId: keyData.folderId
          }
        });

        if (!existingKey) {
          console.log(`✅ Creating key: ${keyData.name}`);
          await prisma.key.create({
            data: keyData
          });
        }
      }
    }

    // 5. Verify setup
    console.log('🔍 Verifying setup...');
    
    const userCount = await prisma.user.count();
    const projectCount = await prisma.folder.count({ where: { isProject: true } });
    const keyCount = await prisma.key.count();
    
    console.log(`📊 Setup complete!`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Keys: ${keyCount}`);

    console.log('\n🎯 Test User Credentials:');
    console.log('   Free Plan: free@test.com / Password123');
    console.log('   Pro Plan:  pro@test.com / Password123');
    console.log('   Team Plan: team@test.com / Password123');
    console.log('   Admin:     admin@test.com / Password123');

    console.log('\n⚠️  IMPORTANT: Change these passwords after testing!');

  } catch (error) {
    console.error('❌ Error during production setup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('✅ Production setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Production setup failed:', error);
    process.exit(1);
  }); 