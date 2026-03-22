const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
    {
        follower:{
            type:String,
            required:[true, 'Follower are required.']
        },
        followee:{
            type:String,
            required:[true, 'Followee are required.']
        },
        status:{
            type:String,
            default:'pending',
            enum:{
                values:['pending','accepted','rejected'],
                message:'Status can be only pending, accecpt or rejected'
            }
        }
    },

    {
        timestamps:true
    }
)
followSchema.index({followee:1, follower:1},{unique:true})

const followModel = new mongoose.model('follows', followSchema)
module.exports = followModel;