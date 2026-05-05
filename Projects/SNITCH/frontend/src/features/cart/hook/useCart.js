import { addItem } from '../services/cart.api.js';
import { useDispatch } from 'react-redux';
import { addItem as addItemToCart } from '../state/cart.slice.js';

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({ productId, variantId }) { // object destructure karo
        try {
            const data = await addItem({ productId, variantId });
            dispatch(addItemToCart(data));
            return data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }

    return { handleAddItem };
}