import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const postFeedback = async (req: Request, res: Response) => {
    const { content, rating, userId } = req.body;
    try {
        const feedback = await prisma.feedback.create({
            data: { content, rating, userId }
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};

export const postAnalytics = async (req: Request, res: Response) => {
    const { eventType, eventData } = req.body;
    try {
        const analytics = await prisma.analytics.create({
            data: { eventType, eventData }
        });
        res.status(201).json(analytics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to record analytics' });
    }
};
