import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import apiRoutes from './routes/api';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Campus Map & AR Navigation API is running' });
});

// Basic Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
