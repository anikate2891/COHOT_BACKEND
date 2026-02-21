const express = require('express')
const app = express();
app.use(express.json())

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const postRouth = require('../src/routes/post.routh')
app.use('/api/post', postRouth)

const authRouter = require('./routes/auth.routh')
app.use('/api/auth', authRouter)

const userRouter = require('../src/routes/user.routh')
app.use('/api/user', userRouter)

const followRouter = require('../src/routes/follow.route')
app.use('/api/follow',followRouter)


module.exports = app;