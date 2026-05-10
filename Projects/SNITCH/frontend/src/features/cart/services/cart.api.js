import axios from 'axios';

const cartApi = axios.create({
    baseURL: 'http://localhost:3000/api/cart',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const addItem = async ({ productId, variantId }) => {
    const response = await cartApi.post(`/add/${productId}/${variantId}`, { quantity: 1 });
    return response.data;
};

export const getCartItems = async () => {
    const response = await cartApi.get(`/`);
    return response.data;
};

export const removeItem = async (itemId) => {
    const response = await cartApi.delete(`/remove/${itemId}`);
    return response.data;
};

export const updateQuantity = async ({ cartItemId, quantity }) => {
    const response = await cartApi.patch(`/update/${cartItemId}`, { quantity });
    return response.data;
};

export const createCartOrder = async () => {
    const response = await cartApi.post(`/payment/create/order`);
    return response.data;
};

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartApi.post(`/payment/verify/order`, 
        { razorpay_order_id, razorpay_payment_id, razorpay_signature });
    return response.data;
}
