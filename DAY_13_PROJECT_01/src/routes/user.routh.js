const express = require('express')
const userRouter = express.Router()

const identifyuser = require('../middlewares/auth.middleware')

const UserController = require('../controller/user.controller')

userRouter.post('/follow/:username', identifyuser , UserController.followUserController)
userRouter.post('/unfollow/:username', identifyuser , UserController.unfollowUserController)

module.exports = userRouter