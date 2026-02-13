const mongoose = require('mongoose')

function connectoDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log('connect to DB')})
}

module.exports = connectoDB