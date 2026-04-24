import { createProducts, getSellerProducts,getAllProducts, getProductDetails, createProductVariant, updateProductVariantStock, deleteProductVariant } from '../services/product.api.js';
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

    const handelCreateProductVariant = useCallback(async (productId, variantData) => {
        try {
            const response = await createProductVariant(productId, variantData);
            return response.variant;
        } catch (error) {
            console.error('Error creating product variant:', error);
            throw error;
        }
    }, []);

    const handelUpdateProductVariantStock = useCallback(async (productId, variantId, stock) => {
        try {
            const response = await updateProductVariantStock(productId, variantId, stock);
            return response.variant;
        } catch (error) {
            console.error('Error updating product variant stock:', error);
            throw error;
        }
    }, []);

    const handelDeleteProductVariant = useCallback(async (productId, variantId) => {
        try {
            const response = await deleteProductVariant(productId, variantId);
            return response.variantId;
        } catch (error) {
            console.error('Error deleting product variant:', error);
            throw error;
        }
    }, []);

    return {
        handelCreateProduct,
        handelGetSellerProducts,
        handelGetAllProducts,
        handelGetProductDetails,
        handelCreateProductVariant,
        handelUpdateProductVariantStock,
        handelDeleteProductVariant,
    };
}