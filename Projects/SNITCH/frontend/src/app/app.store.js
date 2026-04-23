import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.Slice.js';
import productReducer from '../features/products/state/product.slice.js';

// Configure the Redux store with the auth reducer
export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
    },
}); 