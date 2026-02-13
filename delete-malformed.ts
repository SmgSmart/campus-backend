import prisma from './src/services/prisma';

async function deleteMalformed() {
  try {
    // We'll search for the building with Name "ATU hall" to be safe and delete it by its exact ID
    const building = await prisma.building.findFirst({
      where: { name: "ATU hall" }
    });

    if (building) {
      console.log(`Found building: "${building.name}" with ID: "${building.id}"`);
      await prisma.building.delete({
        where: { id: building.id }
      });
      console.log('Successfully deleted malformed building.');
    } else {
      console.log('Malformed building not found.');
    }
  } catch (error) {
    console.error('Error deleting building:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteMalformed();
