import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
