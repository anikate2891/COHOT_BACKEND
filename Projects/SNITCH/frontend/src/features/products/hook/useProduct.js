import { createProducts, getSellerProducts,getAllProducts, getProductDetails } from '../services/product.api.js';
import { useDispatch } from 'react-redux';
import { setSellerProducts, setAllProducts } from '../state/product.slice.js';
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

    const handelGetAllProducts = useCallback(async () => {
        try {
            const response = await getAllProducts();
            dispatch(setAllProducts(response.products));
            return response.products;
        } catch (error) {
            console.error('Error fetching all products:', error);
            throw error;
        }
    }, [dispatch]);

    const handelGetProductDetails = useCallback(async (productId) => {
        try {
            const response = await getProductDetails(productId);
            return response.product;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    }, []);

    return { handelCreateProduct, handelGetSellerProducts, handelGetAllProducts, handelGetProductDetails };
}