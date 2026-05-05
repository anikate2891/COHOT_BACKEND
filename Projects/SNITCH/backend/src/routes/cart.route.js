import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { addToCartValidator } from '../validator/cart.validator.js';
import { addToCart, getCart } from '../controller/cart.controller.js';


const cartRouter = express.Router();

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add an item to the cart
 * @access Private
 */
cartRouter.post('/add/:productId/:variantId', authenticateUser, addToCartValidator, addToCart)

/**
 * @route GET /api/cart
 * @desc Get the user's cart
 * @access Private
 */
cartRouter.get('/', authenticateUser, getCart); 

export default cartRouter;