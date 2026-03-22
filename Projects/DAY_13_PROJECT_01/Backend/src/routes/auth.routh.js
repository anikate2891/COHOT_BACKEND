const express = require('express')
const authRouth = express.Router()
const identifyUser = require('../middlewares/auth.middleware.js')

const authcontroller = require('../controller/auth.controller.js')

authRouth.post('/register', authcontroller.registerController);

authRouth.post('/login', authcontroller.loginController)

authRouth.get('/get-me', identifyUser ,authcontroller.getmeController)
module.exports = authRouth