import axios from 'axios';

const cartApi = axios.create({
    baseURL: 'http://localhost:3000/api/cart',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

export const addItem = async ({productId, variantId}) => {
    const response = await cartApi.post(`/add/${productId}/${variantId}`, {quantity: 1});
    return response.data;
};
    