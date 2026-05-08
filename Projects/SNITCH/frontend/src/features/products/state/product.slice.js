import {createSlice} from '@reduxjs/toolkit';


const productSlice = createSlice({
    name: 'product',
    initialState: { sellerProducts: [], allProducts: [],categories: [], isLoading: true },
    reducers: {
    setSellerProducts(state, action) {
        state.sellerProducts = action.payload;
        state.isLoading = false; 
    },
    setAllProducts(state, action) {
        state.allProducts = action.payload;
        state.isLoading = false; 
    },
    setCategories(state, action) {
        state.categories = action.payload;
    }
}
})

export const {setSellerProducts, setAllProducts, setCategories} = productSlice.actions;
export default productSlice.reducer;