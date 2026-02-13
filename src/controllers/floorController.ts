import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getFloors = async (req: Request, res: Response) => {
    const { building_id } = req.query;
    try {
        const floors = await prisma.floor.findMany({
            where: building_id ? { buildingId: String(building_id) } : {},
            include: { building: true, rooms: true },
            orderBy: { level: 'asc' }
        });
        res.status(200).json(floors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch floors' });
    }
};

// Admin CRUD
export const createFloor = async (req: Request, res: Response) => {
    try {
        const { level, buildingId, mapImageUrl } = req.body;
        const floor = await prisma.floor.create({
            data: { 
                level: parseInt(level), 
                buildingId, 
                mapImageUrl 
            }
        });
        res.status(201).json(floor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create floor' });
    }
};

export const updateFloor = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { level, buildingId, mapImageUrl } = req.body;
        const floor = await prisma.floor.update({
            where: { id },
            data: { 
                level: parseInt(level), 
                buildingId, 
                mapImageUrl 
            }
        });
        res.status(200).json(floor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update floor' });
    }
};

export const deleteFloor = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.floor.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete floor' });
    }
};
