import express from 'express';
import morgan from 'morgan';
import { createPod } from './kubernetes/pod.js';
import { createService } from './kubernetes/service.js';
import {v7 as uuid} from 'uuid'
const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/sandbox/health', (req, res) => {
    res.status(200).json({ message: 'Sandbox Service is healthy' });
});

app.post('/api/sandbox/start', async (req, res) => {
    const sandboxId = uuid();
    try {
        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId)
        ]);
        res.status(201).json(
            { 
                message: 'Sandbox started successfully', 
                sandboxId,
                previewUrl: `http://${sandboxId}.preview.localhost`
            }
        );
    } catch (error) {
        console.error('Error starting sandbox:', error);
        res.status(500).json({ message: 'Error starting sandbox' });
    }
});
export default app;