import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { addToCartValidator } from '../validator/cart.validator.js';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controller/cart.controller.js';


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

/**
 * @route DELETE /api/cart/remove/:itemId
 * @desc Remove an item from the cart
 * @access Private
 */
cartRouter.delete('/remove/:itemId', authenticateUser, removeFromCart);

/**
 * @route PATCH /api/cart/update/:itemId
 * @desc Update the quantity of an item in the cart
 * @access Private
 */
cartRouter.patch('/update/:itemId', authenticateUser, updateCartItem);

export default cartRouter;