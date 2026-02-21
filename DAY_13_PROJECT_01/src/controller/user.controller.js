const followModel = require('../models/follow.model')


async function followUserController(req,res){
    const followerUserName = req.user.username; // Log in user name
    const followeUserName = req.params.username; //Followee user name

    if(followeUserName === followeUserName){
        return res.status(404).json({message:"You can't following himself."})
    }

    const isExistFollowee = await followModel.findOne({
        username:followeUserName
    })
    if(!isExistFollowee){
        res.status(404).json({
            message: 'User does not exist, please try again'
        })
    }

    const IsUserAlreadyFolllowing = await followModel.findOne({
        follower:followeUserName, followee:followeUserName
    })

    if(IsUserAlreadyFolllowing){
        res.status(409).json({
            message:'You already following..',
            follow: IsUserAlreadyFolllowing
        })
    }

    const followRecord = await followModel.create({
        follower:followerUserName,
        followee:followeUserName
    })
    res.status(201).json({
        message:`You are now following ${followeUserName}`,
        follow:followRecord
    })

}

async function unfollowUserController(req,res){
    const followerUserName = req.user.username; // Log in user name
    const followeUserName = req.params.username; //Followee user name

    if(followeUserName === followeUserName){
        return res.status(404).json({message:"You can't following himself."})
    }

    const isuserfollowing = await followModel.findOne({
        follower:followerUserName,
        followee:followeUserName
    })

    if(!isuserfollowing){
        return res.status(200).json({
            message : `You are not following ${followeUserName}`
        })
    }

    await followModel.findByIDAndDelete(isuserfollowing._id)
    res.status(200).json({message:'Unfollow done'})





}




module.exports = {followUserController,unfollowUserController}