const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true, 'Title must be required'],
    },
    password:{
        type:String,
        required:[true, 'Password needed']
    },
    bio: {
        type: String,
        default: ""
    },
})

const userModel = new mongoose.model('users', userSchema);
module.exports = userModel