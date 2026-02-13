import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
