const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const authModel = require('../models/auth.model')

async function registerController(req,res){
    const {username , password , bio} = req.body
    const usernameAlreadyExist = await authModel.findOne({username})
    if(usernameAlreadyExist){
        return res.status(409).json({message:`Username ${username} already exists`})
    }
    const hashPassword = await bcrypt.hash(password,10)

    const user = await authModel.create({
        username:username,
        password:hashPassword,
        bio:bio
    })

    const token = jwt.sign({ id:user._id , username:username}, process.env.JWT_SECRET, {expiresIn:'1d' }) 

    res.cookie('token',token)
    res.status(200).json({
        message: 'User Created Successfully',
        username:user.username,
        bio:user.bio
    })
}
async function loginController(req,res){
    const {username , password } = req.body

//User Find
    const user = await authModel.findOne({username})
    if(!user){
        return res.status(404).json({message:`Username ${username} does not exists`})
    }
//Password Checking
    const ispasswordvalid = await bcrypt.compare(password,user.password)
        if(!ispasswordvalid){
            return res.status(401).json({
                message : "Password invalid"
            })
        }

    const token = jwt.sign({id:user._id , username:user.username}, process.env.JWT_SECRET, {expiresIn:"1d"})
    res.cookie('token',token)
    res.status(200).json({
        message : 'User Login Successfully',
        user:{
            username:user.username,
            bio:user.bio
        }
    })
}

async function userDetailsController(req,res){
    const userId = req.body.id
    if(!userId){
        return res.status(404).json({message:'usern not found'})
    }
    const user = await authModel.findById(userId)
    res.status(200).json({
        user:{
            user:user.username,
            bio:user.bio
        }
    })
}


module.exports = {
    registerController , 
    loginController , 
    userDetailsController}