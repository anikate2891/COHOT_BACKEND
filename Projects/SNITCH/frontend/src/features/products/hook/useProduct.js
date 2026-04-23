import { createProducts, getSellerProducts } from '../services/product.api.js';
import { useDispatch } from 'react-redux';
import { setSellerProducts } from '../state/product.slice.js';
import { useCallback } from 'react';


export const useProduct = () => {
    const dispatch = useDispatch();

    const handelCreateProduct = useCallback(async (data) => {
        try {
            const response = await createProducts(data);
            return response.product || response.products;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }, []);

    const handelGetSellerProducts = useCallback(async () => {
        try {
            const response = await getSellerProducts();
            dispatch(setSellerProducts(response.products));
            return response.products;
        } catch (error) {
            console.error('Error fetching seller products:', error);
            throw error;
        }
    }, [dispatch]);

    return { handelCreateProduct, handelGetSellerProducts };
}