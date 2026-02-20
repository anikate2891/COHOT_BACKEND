const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model')


async function userController(req , res){
    const {username,password,bio} = req.body;

    const isUserAlreadyExist = await userModel.findone(username)
    if(isUserAlreadyExist){
        return res.status(400).json({
            message:`user already exist with this ${isUserAlreadyExist.username} 'username'}`
        }) 

    }

    const hashPassword = await bcrypt.hash(password,10);

    const newUser = await userModel.create({
        username , password:hashPassword , bio
    })

    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
    res.cookie('token', token)

    res.status(200).json({
        message:'New User created done.', 
        newUser
    })

}

async function userLoginController(req , res){
    
}


module.exports = {userController,userLoginController}