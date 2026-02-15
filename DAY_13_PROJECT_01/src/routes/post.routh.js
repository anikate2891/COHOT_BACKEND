const express = require('express')
const postRouter = express.Router()
const postController = require('../controller/post.controller')

// Change Place in Future
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

postRouter.post('/', upload.single('image') ,postController.createPostController )

module.exports = postRouter
