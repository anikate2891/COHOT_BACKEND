const express = require('express')
const app = express()
app.use(express.json())

// User Reg & Logged-In
const userRoute = require('./routes/user.route')
app.use('/api/user',userRoute)


module.exports = app;