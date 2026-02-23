const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    usrname:{
        type:String,
        required:[true,'username must be required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'pssword must be required'],
    }
})

const userModel = new mongoose.model('users', userSchema)
module.exports = userModel;