import prisma from './src/services/prisma';

async function testConnection() {
  try {
    const buildings = await prisma.building.findMany({
      include: { floors: true }
    });
    console.log('Connection successful, building count:', buildings.length);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
