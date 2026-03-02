const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'username must be required'],
        unique: true
    },
    password:{
        type:String,
        required:[true, 'password must be required'],
    }
});

const authModel = new mongoose.model('authUser',authSchema);
module.exports = authModel;