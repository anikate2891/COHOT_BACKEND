const express = require('express')
const app = express()
app.use(express.json())

/*NEW*/
const cookie = require('cookie-parser')
app.use(cookie())

const authrouter = require('./routes/auth.routes')
app.use('/auth', authrouter)
/*NEW*/

module.exports = app
