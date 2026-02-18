const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userModel = require('../models/users.model')


async function registerController (req, res){   
    const {username,email,password,bio,profileImage} = req.body

//check if user already exist
    const isusseralreadyexist = await userModel.findOne({
        $or:[ {email},{username} ]
    })
    if(isusseralreadyexist){
        return res.status(400).json({
            message:`user already exist with this ${isusseralreadyexist.email === email ? 'email' : 'username'}`
        }) 
    }

    const hashpassword  = await bcrypt.hash(password,10)
    const user = await userModel.create({
    username,
    email,
    password:hashpassword,
    bio,
    profileImage    
    })

    const token = jwt.sign({id:user._id,}, process.env.JWT_SECRET, 
    {expiresIn:'1d'})

    res.cookie('token', token)

    res.status(201).json({
        message:"user created successfully",
        user:{
            email:user.email,
            username:user.username,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })


}

async function loginController (req,res) {
    const {username,email,password} = req.body
    
    const user = await userModel.findOne({
        $or:[{username:username},{email:email}]
    })

    if(!user){
        return res.status(404).json({
        message : "User not found"
    })}

    
    const ispasswordvalid = await bcrypt.compare(password,user.password)

    if(!ispasswordvalid){
        return res.status(401).json({
            message : "Password invalid"
        })
    }

    const token = jwt.sign( { id: user._id } ,process.env.JWT_SECRET, {expiresIn:'1d'})
    res.cookie('token', token)
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })


}

module.exports = {registerController, loginController}