const mongoose = require('mongoose');
function connectoDB() {
    mongoose.connect( process.env.MONGO_URI ) 
.then(() => {
    console.log('Connected to MongoDB')
});
}

module.exports = connectoDB;