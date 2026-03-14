import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";

// Create HTTP server - app
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ }); 
// Create Socket.io server and attach to HTTP server


// on = event listener   // socket = single user
io.on("connection", (socket) => {
    console.log('New Connection Created')

    socket.on("message", (msg)=>{
        console.log('User fired message event')
        console.log(msg)
        io.emit('Fire Event in server and send to all users')
    })  
});


// Start the server
httpServer.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});