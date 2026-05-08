import axios from 'axios';

const productApi = axios.create({
    baseURL: '/api/products',
    withCredentials: true,
});

export async function createProducts(productData) {
    try {
        const response = await productApi.post('/', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function getSellerProducts() {
    try {
        const response = await productApi.get('/seller');
        return response.data;
    } catch (error) {
        console.error('Error fetching seller products:', error);
        throw error;
    }
}

export async function getAllProducts() {
    try {
        const response = await productApi.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
}

export async function getProductDetails(productId) {
    try {
        const response = await productApi.get(`/detail/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
}

export async function createProductVariant(productId, variantData) {
    try {
        const response = await productApi.post(`/${productId}/variants`, variantData);
        return response.data;
    } catch (error) {
        console.error('Error creating product variant:', error);
        throw error;
    }
}

export async function updateProductVariantStock(productId, variantId, stock) {
    try {
        const response = await productApi.patch(`/${productId}/variants/${variantId}/stock`, { stock });
        return response.data;
    } catch (error) {
        console.error('Error updating product variant stock:', error);
        throw error;
    }
}

export async function updateProductVariant(productId, variantId, variantData) {
    try {
        const response = await productApi.patch(`/${productId}/variants/${variantId}`, variantData);
        return response.data;
    } catch (error) {
        console.error('Error updating product variant:', error);
        throw error;
    }
}

export async function updateProductImages(productId, imageData) {
    try {
        const response = await productApi.patch(`/${productId}/images`, imageData);
        return response.data;
    } catch (error) {
        console.error('Error updating product images:', error);
        throw error;
    }
}

export async function deleteProductVariant(productId, variantId) {
    try {
        const response = await productApi.delete(`/${productId}/variants/${variantId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product variant:', error);
        throw error;
    }
}

export async function deleteProduct(productId) {
    try {
        const response = await productApi.delete(`/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export async function getCategories() {
    try {
        const response = await productApi.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}
