const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: [true, 'post_ID required for creating a like']
    },
    user:{
        type:String,
        required:[true,'username required for like any posts']
    },
},{timestamps:true})
likeSchema.index({post:1, user:1},{unique:true})

const likeModel = new mongoose.model('userLikes',likeSchema)
module.exports = likeModel
