const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('.././config/cache');

async function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const isTokenblacklisted = await redis.get(token);
    if (isTokenblacklisted === 'blacklisted') {
        return res.status(401).json({ message: 'Hacker ko maru pakar ke' });
    }
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // If decoded is true, then decode carry that value which we set in token in auth.controller.js
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}       

module.exports = {authUser};