const express = require('express')
const authRouth = express.Router()

const authcontroller = require('../controller/auth.controller.js')

authRouth.post('/register', authcontroller.registerController);

authRouth.post('/log-in', authcontroller.loginController)
module.exports = authRouth