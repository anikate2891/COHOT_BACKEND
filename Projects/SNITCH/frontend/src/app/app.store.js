import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.Slice.js';

// Configure the Redux store with the auth reducer
export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
}); 