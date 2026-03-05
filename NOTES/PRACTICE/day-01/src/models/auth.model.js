const mongoose = require('mongoose')

const authSchmea = new mongoose.Schema({
    username:{
        type:String,
        required:[true , 'username neeeded'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Password needed']
    },
    bio:{
        type:String
    }
}, {timestamps:true} )

const authModel = new mongoose.model('users', authSchmea)
module.exports = authModel;