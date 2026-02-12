const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : [true, 'Email already exists']
    },
    password : String
});

const usermodel = mongoose.model('users', userSchema)
module.exports = usermodel