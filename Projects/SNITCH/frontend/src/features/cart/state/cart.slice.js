import {createSlice} from '@reduxjs/toolkit';

// ✅ Fix - cart.slice.js
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalPrice: 0,      // ← ADD
        currency: "INR",    // ← ADD
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload.items;           // ← CHANGE
            state.totalPrice = action.payload.totalPrice; // ← ADD
            state.currency = action.payload.currency;     // ← ADD
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        updateItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item._id === id);
            if (item) {
                item.quantity = quantity;
            }
        }
    }
});
export const {setItems, addItem, removeItem, updateItemQuantity} = cartSlice.actions;
export default cartSlice.reducer;