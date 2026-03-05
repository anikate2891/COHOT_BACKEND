const express = require('express')
const Router = express.Router()

const authController = require('../controllers/auth.controller')
const identify = require('../middlewares/auth.middleware')

Router.post('/register', authController.registerController)
Router.post('/login' , authController.loginController)
Router.get('/me' , identify , authController.userDetailsController)

module.exports = Router;