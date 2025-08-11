import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting production setup...');

  try {
    // Test Prisma connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');

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
      try {
        const existingUser = await prisma.users.findUnique({
          where: { email: userData.email }
        });

        if (existingUser) {
          console.log(`⚠️  User ${userData.email} already exists, updating...`);
          await prisma.users.update({
            where: { email: userData.email },
            data: {
              plan: userData.plan,
              role: userData.role
            }
          });
        } else {
          console.log(`✅ Creating user: ${userData.email} (${userData.plan} plan)`);
          const hashedPassword = await bcrypt.hash(userData.password, 12);
          
          await prisma.users.create({
            data: {
              email: userData.email,
              name: userData.name,
              password: hashedPassword,
              plan: userData.plan,
              role: userData.role
            }
          });
        }
      } catch (userError) {
        console.error(`❌ Error processing user ${userData.email}:`, userError);
      }
    }

    // 3. Create payment records for PRO and TEAM users (instead of subscriptions)
    console.log('💳 Setting up payments...');
    
    try {
      const proUsers = await prisma.users.findMany({
        where: {
          plan: { in: ['PRO', 'TEAM'] }
        }
      });

      for (const user of proUsers) {
        try {
          const existingPayment = await prisma.payments.findFirst({
            where: { userId: user.id }
          });

          if (!existingPayment) {
            console.log(`✅ Creating payment record for ${user.email}`);
            await prisma.payments.create({
              data: {
                userId: user.id,
                orderId: `order_${user.id}_${Date.now()}`,
                paymentId: `pay_${user.id}_${Date.now()}`,
                signature: `sig_${user.id}_${Date.now()}`,
                plan: user.plan,
                amount: user.plan === 'PRO' ? 900 : 2900, // $9.00 or $29.00 in cents
                currency: 'USD',
                status: 'captured',
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
              }
            });
          }
        } catch (paymentError) {
          console.error(`❌ Error creating payment for ${user.email}:`, paymentError);
        }
      }
    } catch (paymentError) {
      console.error('❌ Error setting up payments:', paymentError);
    }

    // 4. Create sample projects and keys for testing
    console.log('📁 Creating sample projects and keys...');
    
    try {
      const testUser = await prisma.users.findUnique({
        where: { email: 'pro@test.com' }
      });

      if (testUser) {
        // Create a sample project (parentId = null means it's a project)
        const project = await prisma.folders.create({
          data: {
            name: 'Sample Project',
            description: 'A sample project for testing the production environment',
            color: '#3B82F6',
            userId: testUser.id,
            parentId: null // This makes it a project (root folder)
          }
        });

        // Create sample keys
        const sampleKeys = [
          {
            name: 'DATABASE_URL',
            value: 'postgresql://user:pass@localhost:5432/testdb',
            type: 'SECRET', // Changed from DATABASE_URL to SECRET
            description: 'Sample database connection string',
            environment: 'DEVELOPMENT',
            folderId: project.id,
            userId: testUser.id
          },
          {
            name: 'API_KEY',
            value: 'sk_test_sample_api_key_12345',
            type: 'API_KEY', // This is correct
            description: 'Sample API key for testing',
            environment: 'DEVELOPMENT',
            folderId: project.id,
            userId: testUser.id
          },
          {
            name: 'JWT_SECRET',
            value: 'your-super-secret-jwt-key-here',
            type: 'SECRET', // This is correct
            description: 'Sample JWT secret',
            environment: 'DEVELOPMENT',
            folderId: project.id,
            userId: testUser.id
          }
        ];

        for (const keyData of sampleKeys) {
          try {
            const existingKey = await prisma.keys.findFirst({
              where: {
                name: keyData.name,
                folderId: keyData.folderId
              }
            });

            if (!existingKey) {
              console.log(`✅ Creating key: ${keyData.name}`);
              await prisma.keys.create({
                data: keyData
              });
            }
          } catch (keyError) {
            console.error(`❌ Error creating key ${keyData.name}:`, keyError);
          }
        }
      }
    } catch (projectError) {
      console.error('❌ Error creating sample project:', projectError);
    }

    // 5. Verify setup
    console.log('🔍 Verifying setup...');
    
    try {
      const userCount = await prisma.users.count();
      const projectCount = await prisma.folders.count({ where: { parentId: null } }); // Projects are folders with no parent
      const keyCount = await prisma.keys.count();
      
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
    } catch (verifyError) {
      console.error('❌ Error verifying setup:', verifyError);
    }

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