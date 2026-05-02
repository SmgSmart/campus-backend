import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getPaths = async (req: Request, res: Response) => {
    const { from, to } = req.query;
    try {
        const paths = await prisma.navigationPath.findMany({
            where: {
                AND: [
                    from ? { fromName: { contains: String(from), mode: 'insensitive' } } : {},
                    to ? { toName: { contains: String(to), mode: 'insensitive' } } : {}
                ]
            }
        });
        res.status(200).json(paths);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch paths' });
    }
};
