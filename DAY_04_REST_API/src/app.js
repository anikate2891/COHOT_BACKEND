// Create a Server with Express.js 
// Configure the server to parse JSON request bodies

const express = require('express');
const app = express();
app.use(express.json());

// Sample in-memory data store
let notes = [];

// Create a new Api
app.get('/', (req, res) => {
    res.send('Welcome to the Notes API');
});


// Endpoint to get all notes
app.post('/notes', (req, res) => {
    const note = req.body;
    notes.push(note);
    console.log(note);
    // console.log(notes)
    res.send('Note added successfully');   
});

app.get('/notes', (req, res) => {
    res.send(notes);
});

// Params - carries the dyanamic data in the url
app.delete('/notes/:index', (req, res) => {
    const index = req.params.index;
    console.log(index);
    delete notes[index];

    res.send('Note deleted successfully');
});


app.patch('/notes/:index', (req, res) => {
    notes[req.params.index].content = req.body.content;
    
    res.send('Note updated successfully');
});

module.exports = app;