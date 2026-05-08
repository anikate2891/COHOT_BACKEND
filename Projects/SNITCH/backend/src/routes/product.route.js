import express from 'express';
import multer from 'multer';    
import {authenticateSeller} from "../middleware/auth.middleware.js";
import {createProductController, getAllProductsController, getProductDetailsController , getSellerProductsController,  addProductVariantController, updateProductVariantStockController, deleteProductVariantController, deleteProductController, updateProductVariantController, updateProductImagesController, getCategoriesController } from "../controller/product.controller.js";
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
 * @route GET /api/products/categories
 * @desc Get all product categories
 * @access Public
 */
productRouter.get('/categories', getCategoriesController);

/**
 * @route GET /api/products
 * @desc Get all products (for buyers)
 * @access Public
 */
productRouter.get('/', getAllProductsController); 


/**
 * @route GET /api/products/detail/:id
 * @desc Get product details by ID
 * @access Public
 */
productRouter.get('/detail/:id', getProductDetailsController);

/**
 * @route POST /api/products/:productId/variants
 * @desc Add a new variant to a product
 * @access Private (Seller only)
 */
productRouter.post('/:productId/variants', authenticateSeller, upload.array('image', 7), addProductVariantController);

/**
 * @route PATCH /api/products/:productId/variants/:variantId
 * @desc Update a product variant
 * @access Private (Seller only)
 */
productRouter.patch('/:productId/variants/:variantId', authenticateSeller, upload.array('image', 7), updateProductVariantController);

/**
 * @route PATCH /api/products/:productId/variants/:variantId/stock
 * @desc Update the stock of a product variant
 * @access Private (Seller only)
 */
productRouter.patch('/:productId/variants/:variantId/stock', authenticateSeller, updateProductVariantStockController);

/**
 * @route DELETE /api/products/:productId/variants/:variantId
 * @desc Delete a product variant
 * @access Private (Seller only)
 */
productRouter.delete('/:productId/variants/:variantId', authenticateSeller, deleteProductVariantController);

/**
 * @route PATCH /api/products/:productId/images
 * @desc Update product images
 * @access Private (Seller only)
 */
productRouter.patch('/:productId/images', authenticateSeller, upload.array('image', 7), updateProductImagesController);

/**
 * @route DELETE /api/products/:productId
 * @desc Delete a product
 * @access Private (Seller only)
 */
productRouter.delete('/:productId', authenticateSeller, deleteProductController);



export default productRouter;