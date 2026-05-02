import prisma from './src/services/prisma';

async function checkBuildings() {
  try {
    const buildings = await prisma.building.findMany();
    console.log('Current buildings:');
    buildings.forEach(b => {
      console.log(`ID: "${b.id}" (length: ${b.id.length}), Name: "${b.name}"`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBuildings();
