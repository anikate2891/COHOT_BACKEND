const express = require('express')
const app = express()

const path = require('path')

const cors = require('cors')
app.use(cors())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')))

const noteModel = require('./models/notes.model')

app.use(express.json())
// CRUD operations for notes
app.post('/notes', async (req, res) => {
    const { title, content } = req.body
    const note = await noteModel.create({ title, content })
    res.status(201).json({ message: 'Note created successfully', note })
});

app.get('/notes', async (req, res) => {
    const notes = await noteModel.find()
    res.status(200).json({ message: 'Notes retrieved successfully', notes })
});

app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id
    await noteModel.findByIdAndDelete(id)
    res.status(200).json({ message: 'Note deleted successfully' })
});

app.patch('/notes/:id', async (req, res) => {
    const id = req.params.id
    const {content} = req.body
    const note = await noteModel.findByIdAndUpdate(id, {content})
    res.status(200).json({ message: 'Note updated successfully', note })
});

//Wildcard
app.use('*name',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','../public/index.html'))
})

module.exports = app