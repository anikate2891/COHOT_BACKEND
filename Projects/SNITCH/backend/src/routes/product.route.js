import express from 'express';
import multer from 'multer';    
import {authenticateSeller} from "../middleware/auth.middleware.js";
import {createProductController} from "../controller/product.controller.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
})

const productRouter = express.Router();
productRouter.post('/', authenticateSeller, upload.array('image',6), createProductController);


export default productRouter;