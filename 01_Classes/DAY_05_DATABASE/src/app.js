const express = require('express');
const app = express();

// middleware
app.use(express.json());

// notes routes
const notes = [];

app.post('/notes', (req, res) => {
    const body = req.body;
    notes.push(body);
    res.status(201).json({'message': 'Note created'});
});


app.get('/notes', (req, res) => {
    res.status(200).json({Notess: notes});  /*dekhe bojhai jachy notes a ja thakbe show krbe Notess {} er modhy*/
});

app.delete('/notes/:id', (req, res) => {
    delete notes[req.params.id];
    res.status(200).json({'message': 'Note deleted'});
});

app.patch('/notes/:id', (req, res) => {     /*: id = value of params */
    const body = req.body.content;
    notes[req.params.id].content = body;
    res.status(200).json({'message': 'Note updated'});
});

module.exports = app;