// Call Express
let express = require('express');
let server = express();

//***//
server.use(express.json())


//Blank arr ekahnei sob data asbee & store hochy line no 19 , 20
const notes = [];

// Postman a kaj a mention achy:
server.post('/notes', (req,res)=>{
    console.log(req.body)
    res.send('Note Created');
    notes.push(req.body);
})

// Line 9
server.get('/notes',(req,res)=>{
    res.send(notes);
}) 






// Server suru holo ei port a..
server.listen(3000,()=>{
    console.log('Server is run on port 3000.')
});