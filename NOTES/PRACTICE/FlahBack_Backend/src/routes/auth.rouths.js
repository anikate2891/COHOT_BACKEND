const userModel = require('../models/notes.model')

const express = require('express')
const authRouters = express.Router()

const crypto = require('crypto')
const jwt = require('jsonwebtoken')


authRouters.post('/register', async (req, res) => {
    const {name, email, password } = req.body
    const isUserExist = await userModel.findOne({ email: req.body.email })
    if (isUserExist) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashpassword = crypto.createHash('sha256').update(password).digest('hex');
    const user = await userModel.create({ name, email, password: hashpassword });
    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET)
    res.cookie('token',token)
    res.status(201).json(
        { message: 'User registered successfully', 
        user 
        });
})





authRouters.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: 'Invalid Email' });
    }

    const isCorrectPassword = user.password === crypto.createHash('sha256').update(password).digest('hex')
    if (!isCorrectPassword) {
        return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET)
    res.cookie('token',token)
    res.status(200).json({ message: 'Login successful', user });
})



authRouters.get('/find-user', async (req, res) => {
    const token = req.cookies.token; // undefine
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findOne({email: decode.email})
    res.status(201).json({
        message: "user Register Successfully",
        name : user.name,
        email : user.email
    })
})

authRouters.get('/all-users', async(req,res)=>{
    const user = await userModel.find()
    res.status(200).json(
        { message:"All users", 
        user }
    )
})


module.exports = authRouters

