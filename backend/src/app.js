import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
