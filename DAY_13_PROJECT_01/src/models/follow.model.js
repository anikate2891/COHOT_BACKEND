const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
    {
        followers:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users',
            required:[true, 'Follower are required.']
        },
        followee:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users',
            required:[true, 'Followee are required.']
        },
    },

    {
        timestamps:true
    }
)

const followModel = new mongoose.model('follows', followSchema)
module.exports = followModel;