const notemodel = require('./model/notes.model')

const express = require('express')
const app = express()
app.use(express.json())

app.post('/notes', async (req, res) => {
    const { title, content } = req.body;

    const note = await notemodel.create({title,content})
    res.status(201).json({ message: 'Note created successfully', note })
});

app.get('/notes', async (req, res) => {
    let notes = await notemodel.find()
    res.status(200).json({ message:'Notes retrieved successfully', notes })
})

module.exports = app    