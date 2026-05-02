import prisma from './src/services/prisma';

async function testPrisma() {
  console.log('Testing Prisma service connection...');
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('Prisma connection successful!');
    console.log('Current time from DB:', result);
  } catch (err) {
    console.error('Prisma connection error:', err.message);
    if (err.message.includes('adapter')) {
        console.log('Hint: Check if the Prisma adapter is correctly initialized.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
