import express from 'express';
import multer from 'multer';    
import {authenticateSeller} from "../middleware/auth.middleware.js";
import {createProductController, getSellerProductsController} from "../controller/product.controller.js";
import {validateProduct} from "../validator/product.validator.js";
import { get } from 'mongoose';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
})

const productRouter = express.Router();
/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller only)
 */
productRouter.post('/', authenticateSeller, validateProduct, upload.array('image',6), createProductController);

productRouter.get('/seller', authenticateSeller, getSellerProductsController); 

export default productRouter;