const express = require('express')
const app = express();
app.use(express.json());


const cookie = require('cookie-parser')
app.use(cookie)

const userRouter = require('./routes/user.route')
app.use('/api/app', userRouter)

const userLogin = require('./routes/userLogin.route')
app.use('/api/app', userLogin)

module.exports = app;