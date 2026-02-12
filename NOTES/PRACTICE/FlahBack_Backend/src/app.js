const express = require('express')
const app = express();
app.use(express.json())

const cookie = require('cookie-parser')
app.use(cookie())

const authRoute = require('./routes/auth.rouths')
app.use('/api/auth', authRoute)


module.exports = app;