const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        name:String,
        password:String,
        email:{ type:String, 
            unique:[true, 'Email already exists']} /*NEW*/
});

const usermodel = mongoose.model('user', userSchema);
module.exports = usermodel;