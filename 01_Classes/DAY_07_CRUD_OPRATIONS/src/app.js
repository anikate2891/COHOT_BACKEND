const express = require('express');
const noteModel = require('./models/notes.model');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/notes', async (req, res) => {
    const { title, content } = req.body;

    const newNote = await noteModel.create({ title, content });
    res.status(201).json({ newNote, message: 'Note created successfully' });
});


module.exports = app;