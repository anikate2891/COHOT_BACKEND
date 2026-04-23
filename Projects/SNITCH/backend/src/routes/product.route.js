import express from 'express';
import multer from 'multer';    
import {authenticateSeller} from "../middleware/auth.middleware.js";
import {createProductController, getAllProductsController, getSellerProductsController} from "../controller/product.controller.js";
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
productRouter.post('/', authenticateSeller, upload.array('image',7), validateProduct,  createProductController);


/**
 * @route GET /api/products/seller
 * @desc Get products of the authenticated seller
 * @access Private (Seller only)
 */
productRouter.get('/seller', authenticateSeller, getSellerProductsController); 

/**
 * @route GET /api/products
 * @desc Get all products (for buyers)
 * @access Public
 */
productRouter.get('/', getAllProductsController); 


export default productRouter;