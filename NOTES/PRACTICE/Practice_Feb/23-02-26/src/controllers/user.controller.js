const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const userModel = require('../models/user.model')

async function userRegisterController(req,res){
    const {username,password} = req.body;

    // Cheacked is username exist or not
    const isUserNameExist = await userModel.findOne({username})
    if(isUserNameExist){
        return res.status(409).json({
            message:'Username already exist,'
        })
    }

    // Password change to hash form
    const hashpassword = await bcrypt.hash(password,10)

    const newUser = await userModel.create({
        username,
        password:hashpassword
    })

    //COOKIE
    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1d'})
    res.cookie('token',token)

    res.status(201).json({
        message:'User Created Successfully',
        username: newUser.username
    })
}


async function userLoginController(req,res){
    const {username,password} = req.body;

    // Cheacked is username already register or not
    const user = await userModel.findOne({username})
    if(!user){
        return res.status(404).json({
            message : 'User not found, Please Register first'
        })
    }

    //Checked password valid or not
    const hashpassword = await bcrypt.compare(password,user.password)
    if(!hashpassword){
        return res.status(401).json({
            message:'password invalid'
        })
    }

    const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '1d'});
    res.cookie('token',token)

    res.status(201).json({
        message:'user logged in Sucessfully',
        user:user.username
    })
}

module.exports = {userRegisterController,userLoginController}

