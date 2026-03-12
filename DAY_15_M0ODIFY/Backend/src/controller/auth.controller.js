const usserModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blackListModel = require('../models/blackList.model');



async function registerUser(req, res) {
    const { username, email, password } = req.body;
    const alreadRegistered = await usserModel.findOne({
        $or: [{ username }, { email }]
    })
    if (alreadRegistered) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usserModel.create({
        username,
        email,
        password: hashedPassword
    });
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token)
    res.status(201).json({ 
        message: 'User registered successfully',
        user: { username: user.username, email: user.email }
    });
}

async function loginUser(req, res) {
    const { email, username, password } = req.body;
    const user = await usserModel.findOne({
        $or: [{ email }, { username }]
    }).select('+password');

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token);

    res.status(200).json({
        message: 'Login successful', 
        user: { username: user.username, email: user.email } 
    });

}

async function getMe(req, res) {
    const user = await usserModel.findById(req.user.userId)
    if (!user) {    
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(
        {   message: 'User details fetched successfully',
            user
        });
}

async function logoutUser(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'No token found' });
    }

    await blackListModel.create({ token });
    res.clearCookie('token');
    
    res.status(200).json({ 
        message: 'Logout successful'
    });
}

module.exports = { registerUser, loginUser, getMe, logoutUser };