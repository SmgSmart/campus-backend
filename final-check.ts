import prisma from './src/services/prisma';

async function finalCheck() {
  try {
    const buildings = await prisma.building.findMany();
    const rooms = await prisma.room.findMany();
    
    console.log('--- Buildings ---');
    buildings.forEach(b => console.log(`ID: "${b.id}", Name: "${b.name}"`));
    
    console.log('--- Rooms ---');
    rooms.forEach(r => console.log(`ID: "${r.id}", Name: "${r.name}", BuildingID: "${r.buildingId}"`));
    
  } catch (error) {
    console.error('Check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalCheck();
