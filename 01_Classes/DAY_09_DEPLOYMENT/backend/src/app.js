const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const noteModel = require('./models/notes.model')

app.post('/notes', async (req, res) => {
    const {title, description} = req.body
    const notes = await noteModel.create({ title, description })

    res.status(201).json( {message: 'Note created successfully', notes} )
});

app.get('/notes', async (req, res) => {
    const notes = await noteModel.find()

    res.status(200).json( {message: 'Notes fetched successfully', notes} )
});

app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id
    await noteModel.findByIdAndDelete(id)

    res.status(200).json( {message: 'Note deleted successfully'} )
});

app.patch('/notes/:id', async (req, res) => {
    const id = req.params.id
    const {description} = req.body
    await noteModel.findByIdAndUpdate(id, {description})

    res.status(200).json( {message: 'Note updated successfully'} )
});


module.exports = app