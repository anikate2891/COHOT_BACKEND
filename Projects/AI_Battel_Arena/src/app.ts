import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.status(200).json(
        { message:'Welcome to the AI Battle Arena API!' }
    );
});

export default app;