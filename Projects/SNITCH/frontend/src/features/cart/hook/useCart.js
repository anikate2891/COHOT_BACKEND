import { addItem, getCartItems, removeItem, updateQuantity } from '../services/cart.api.js';
import { useDispatch } from 'react-redux';
import { 
    addItem as addItemToCart, 
    setItems as setCartItemsInCart,
    removeItem as removeItemFromCart,
    updateItemQuantity
} from '../state/cart.slice.js';


export const useCart = () => {
    const dispatch = useDispatch();
    const { handleGetCartItems } = useGetCartItems();

    async function handleAddItem({ productId, variantId }) {
    try {
        const data = await addItem({ productId, variantId });
        await handleGetCartItems(); // ← local dispatch hatao, fresh data lo
        return data;
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
}

    async function handleRemoveItem(cartItemId) {
        try {
            await removeItem(cartItemId);
            dispatch(removeItemFromCart(cartItemId));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }

    async function handleUpdateQuantity(cartItemId, quantity) {
        try {
            await updateQuantity({ cartItemId, quantity });
            dispatch(updateItemQuantity({ id: cartItemId, quantity }));
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    }

    return { handleAddItem, handleRemoveItem, handleUpdateQuantity };
}

export const useGetCartItems = () => {
    const dispatch = useDispatch();

    async function handleGetCartItems() {
        try {
            const data = await getCartItems();
            dispatch(setCartItemsInCart(data.data.items));
            return data;
        } catch (error) {
            console.error('Error getting cart items:', error);
        }
    }

    return { handleGetCartItems };
}