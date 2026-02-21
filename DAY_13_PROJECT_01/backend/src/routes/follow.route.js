const express = require('express')
const followRouth = express.Router()

const identifyuser = require('../middlewares/auth.middleware')

const followController = require('../controller/follow.controller')

followRouth.post('/request/:username', identifyuser, followController.sendFollowRequest)
followRouth.patch('/update/:username', identifyuser, followController.updateFollowStatus)

module.exports = followRouth