const express = require('express');
let app = express()
app.use(express.json())

let notes = []

// notes a data cholee gachy via postman [demo frontend data]
app.post('/notes',(req,res)=>{
    notes.push(req.body)
    res.send('res sent data to frontend from the server ')
});

app.get('/notes',(req,res)=>{
    res.send(notes)
})

app.listen(3000)