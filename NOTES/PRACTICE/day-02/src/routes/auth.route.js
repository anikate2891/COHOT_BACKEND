const express = require('express')
const authRouter = express.Router()

const authController = require('../controllers/auth.Controller')

authRouter.post('/register' , authController.registerController)
authRouter.post('/log-in' , authController.loginController)
authRouter.get('/me' , authController.findMeController)

module.exports = authRouter;