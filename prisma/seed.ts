import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
    console.log('Start seeding...');

    // 1. Science Center
    await prisma.building.upsert({
        where: { id: 'building-1' },
        update: {},
        create: {
            id: 'building-1',
            name: 'Science Center',
            description: 'Major hub for science and research',
            latitude: 5.5543254,
            longitude: -0.2087566,
            imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585',
            floors: {
                create: [
                    {
                        level: 1,
                        rooms: {
                            create: [
                                { name: 'Main Hall', type: 'Hallway', buildingId: 'building-1' },
                                { name: 'Lab 101', type: 'Laboratory', buildingId: 'building-1' }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // 2. Tech Plaza (Labs & IT)
    await prisma.building.upsert({
        where: { id: 'building-2' },
        update: {},
        create: {
            id: 'building-2',
            name: 'Tech Plaza',
            description: 'Advanced technology hub and computer labs',
            latitude: 5.5503254,
            longitude: -0.2107566,
            imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
            floors: {
                create: [
                    {
                        level: 1,
                        rooms: {
                            create: [
                                { name: 'IT Helpdesk', type: 'Office', buildingId: 'building-2' },
                                { name: 'Computer Lab A', type: 'Lab', buildingId: 'building-2' }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // 3. Founders Library
    await prisma.building.upsert({
        where: { id: 'building-3' },
        update: {},
        create: {
            id: 'building-3',
            name: 'Founders Library',
            description: 'The main university library and archives',
            latitude: 5.5563254,
            longitude: -0.2077566,
            imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
            floors: {
                create: [
                    {
                        level: 1,
                        rooms: {
                            create: [
                                { name: 'Circulation Desk', type: 'Service', buildingId: 'building-3' },
                                { name: 'Quiet Study Area', type: 'Study Room', buildingId: 'building-3' }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // 4. Central Dining Hall
    await prisma.building.upsert({
        where: { id: 'building-4' },
        update: {},
        create: {
            id: 'building-4',
            name: 'Central Dining Hall',
            description: 'Main food court and student lounge',
            latitude: 5.5523254,
            longitude: -0.2097566,
            imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127ff144326',
            floors: {
                create: [
                    {
                        level: 1,
                        rooms: {
                            create: [
                                { name: 'Western Kitchen', type: 'Dining', buildingId: 'building-4' },
                                { name: 'Coffee Shop', type: 'Dining', buildingId: 'building-4' }
                            ]
                        }
                    }
                ]
            }
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
