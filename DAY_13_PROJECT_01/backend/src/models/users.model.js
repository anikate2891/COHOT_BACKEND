const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true ,'Username already exist'],
        required:[true, 'username required']
    },
    email:{
        type:String,
        unique:[true ,'Username e-mail already exist'],
        required:[true, 'email required']
    },
    password:{
        type:String,
        required:[true, 'password requrired']
    },
    bio:String,
    profileImage:{
        type:String,
        default:'https://ik.imagekit.io/xjjrog7g9i/user-sign-icon-person-symbol-hum.jpg'
    }
})

const userModel = mongoose.model('users',userSchema)
module.exports = userModel