const express = require('express')
const postRouter = express.Router()
const postController = require('../controller/post.controller')
// Change Place in Future
const multer = require('multer')
const identifyUser = require('../middlewares/auth.middleware')
const upload = multer({ storage: multer.memoryStorage() })


postRouter.post('/', upload.single('image'),identifyUser,postController.createPostController )

postRouter.get('/',identifyUser, postController.getpostcontroller)

postRouter.get('/details/:postId', identifyUser ,postController.getpostDetailsController)

postRouter.post('/like/:psotId',identifyUser,postController.likePostController)

module.exports = postRouter
