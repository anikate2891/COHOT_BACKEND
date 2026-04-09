import express from 'express';
import cors from 'cors';
import runGraph from './services/grap.ai.service.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);


app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());


app.post('/api/chat', async (req, res) => {
    const problem = typeof req.body?.problem === 'string' ? req.body.problem.trim() : '';

    if (!problem) {
        return res.status(400).json({ message: 'Problem is required.' });
    }

    try {
        await runGraph(req, res);
    } catch (error) {
        console.error('Failed to process chat request:', error);
        return res.status(500).json({ message: 'Failed to generate solutions.' });
    }
});

export default app;