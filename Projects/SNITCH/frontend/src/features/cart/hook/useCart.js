import { addItem, getCartItems, removeItem, updateQuantity } from '../services/cart.api.js';
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

    return { handleAddItem, handleRemoveItem, handleUpdateQuantity };
}