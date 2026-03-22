const express = require('express')
const app = express();
app.use(express.json())

const cors = require("cors")
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const authRouter = require('./routes/auth.route')
app.use('/api/auth', authRouter)


module.exports = app;