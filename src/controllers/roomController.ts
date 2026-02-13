import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getRooms = async (req: Request, res: Response) => {
    const { building_id } = req.query;
    try {
        const rooms = await prisma.room.findMany({
            where: building_id ? { buildingId: String(building_id) } : {},
            include: { building: true, floor: true }
        });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

// Admin CRUD
export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, type, buildingId, floorId, latitude, longitude } = req.body;
        const room = await prisma.room.create({
            data: { name, type, buildingId, floorId, latitude, longitude }
        });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { name, type, floorId, latitude, longitude } = req.body;
        const room = await prisma.room.update({
            where: { id },
            data: { name, type, floorId, latitude, longitude }
        });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update room' });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.room.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
};
