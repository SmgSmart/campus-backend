import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { buildings: true } } }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, icon } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        const category = await prisma.category.create({
            data: { name, icon }
        });
        res.status(201).json(category);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category name already exists' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { name, icon } = req.body;
        const category = await prisma.category.update({
            where: { id },
            data: { name, icon }
        });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
