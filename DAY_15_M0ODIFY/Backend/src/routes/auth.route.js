const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const authController = require('../controller/auth.controller');


router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/getme', authMiddleware.authUser, authController.getMe);

router.get('/logout', authController.logoutUser);

module.exports = router;