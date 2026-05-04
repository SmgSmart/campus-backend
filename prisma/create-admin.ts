import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdmin() {
  const email = 'admin@campaus.com';
  const password = 'admin123';
  const name = 'System Admin';

  console.log(`🚀 Creating admin account for ${email}...`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin account created/updated successfully!');
    console.log('-----------------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

createAdmin();
