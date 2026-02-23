const express = require('express')
const Router = express.Router()

const userController = require('../controllers/user.controller')

Router.post('/register',userController.userRegisterController)
Router.post('/log-in',userController.userLoginController)


module.exports = Router;