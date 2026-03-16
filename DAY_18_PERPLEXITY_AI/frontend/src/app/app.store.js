import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/auth.Slice'


export const store = configureStore({
    reducer:{
        auth:authReducer,
    }
})