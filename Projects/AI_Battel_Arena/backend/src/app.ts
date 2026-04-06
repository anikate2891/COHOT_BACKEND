import express from 'express';
import runGraph from './services/grap.ai.service.js';
const app = express();

// Basic Server Setup

app.get('/', async(req, res) => {
    const result = await runGraph('What is the capital of France?');
    res.status(200).json(result);
});

export default app;