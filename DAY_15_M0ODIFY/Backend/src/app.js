const express = require('express');
const cookie = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookie());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
    

const authRouter = require('./routes/auth.route');
app.use('/api/auth', authRouter);

module.exports = app;