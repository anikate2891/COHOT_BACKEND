import { addItem, getCartItems, removeItem, updateQuantity, createCartOrder, verifyCartOrder } from '../services/cart.api.js';
import { useDispatch } from 'react-redux';
import { 
    setItems as setCartItemsInCart,
    // removeItem as removeItemFromCart, updateItemQuantity
} from '../state/cart.slice.js';

export const useGetCartItems = () => {
    const dispatch = useDispatch();

    async function handleGetCartItems() {
        try {
            const data = await getCartItems();
            const cart = data.data
            dispatch(setCartItemsInCart({
                items: cart?.items || [],
                totalPrice: cart?.totalPrice || 0,
                currency: cart?.currency || "INR",
            }));
            return data;
        } catch (error) {
            console.error('Error getting cart items:', error);
        }
    }

    return { handleGetCartItems };
}

export const useCart = () => {
    const dispatch = useDispatch();
    const { handleGetCartItems } = useGetCartItems();

    async function handleAddItem({ productId, variantId }) {
        try {
            const data = await addItem({ productId, variantId });
            await handleGetCartItems();
            return data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }

    async function handleRemoveItem(cartItemId) {
        try {
            await removeItem(cartItemId);
            await handleGetCartItems();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }

    async function handleUpdateQuantity(cartItemId, quantity) {
        try {
            await updateQuantity({ cartItemId, quantity });
            await handleGetCartItems();
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    }

    async function handleCreateOrder() {
        try {
            const data = await createCartOrder();
            return data;
        } catch (error) {
            console.error('Error creating cart order:', error);
        }
    }   

    async function handleVerifyOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        try {
            const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
            return data.success;
        } catch (error) {
            console.error('Error verifying cart order:', error);
        }
    }

    return { handleAddItem, handleRemoveItem, handleUpdateQuantity, handleCreateOrder, handleVerifyOrder };
}
