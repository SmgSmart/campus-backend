import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Labs', icon: 'Microscope' },
    { name: 'Dining', icon: 'Utensils' },
    { name: 'Library', icon: 'Library' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    console.log(`Created/Verified category: ${cat.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
