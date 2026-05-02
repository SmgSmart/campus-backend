import prisma from '../src/services/prisma';

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('No user accounts found in the database.');
    } else {
      console.log('--- Current User Accounts ---');
      console.table(users);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
