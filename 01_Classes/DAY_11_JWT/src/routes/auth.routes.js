const express = require('express')
const authrouter = express.Router();
const usermodel = require('../models/user.model'); /*NEW*/
const jwt = require('jsonwebtoken');/*NEW*/    

authrouter.post('/register', async (req, res) => {
/*NEW*/
    const isuseralreadyhere = await usermodel.findOne({ email : req.body.email });
    if (isuseralreadyhere) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    const { name, password, email } = req.body;
    const user = await usermodel.create({ name, password, email })

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);
    res.cookie('jwt_token',token)
/*NEW*/
        res.status(200).json(
            { msg: 'User registered successfully', 
            user, token }
        )
})

module.exports = authrouter;