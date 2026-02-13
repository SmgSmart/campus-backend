import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getAllBuildings = async (req: Request, res: Response) => {
    try {
        const buildings = await prisma.building.findMany({
            include: { floors: true, category: true }
        });
        res.status(200).json(buildings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch buildings' });
    }
};

export const getBuildingById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const building = await prisma.building.findUnique({
            where: { id },
            include: { floors: { include: { rooms: true } }, rooms: true }
        });
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch building' });
    }
};

// Admin CRUD
export const createBuilding = async (req: Request, res: Response) => {
    try {
        const { name, description, latitude, longitude, imageUrl, categoryId } = req.body;
        const building = await prisma.building.create({
            data: { name, description, latitude, longitude, imageUrl, categoryId }
        });
        res.status(201).json(building);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create building' });
    }
};

export const updateBuilding = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { name, description, latitude, longitude, imageUrl, categoryId } = req.body;
        const building = await prisma.building.update({
            where: { id },
            data: { name, description, latitude, longitude, imageUrl, categoryId }
        });
        res.status(200).json(building);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update building' });
    }
};

export const deleteBuilding = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Note: In Prisma, if you have relations, you might need to handle them.
        // For simplicity, we assume cascading or no blocking relations.
        const building = await prisma.building.findUnique({ where: { id } });
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        await prisma.building.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete building' });
    }
};
