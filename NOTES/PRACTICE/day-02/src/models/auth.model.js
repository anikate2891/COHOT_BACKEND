const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username:{
        title:String,
        required:[true,'Username must be needed']
    },
    password:{
        title:String,
        required:[true,'Username must be needed']
    },
    bio:{
        title:String
    }
}, { timestamps:true })

const authModel = new mongoose.model('users', authSchema)
module.exports = authModel