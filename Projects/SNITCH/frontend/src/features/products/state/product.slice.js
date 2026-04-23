import {createSlice} from '@reduxjs/toolkit';


const productSlice = createSlice({
    name: 'product',
    initialState: { sellerProducts: [], allProducts: [], isLoading: true },
    reducers: {
    setSellerProducts(state, action) {
        state.sellerProducts = action.payload;
        state.isLoading = false; 
    },
    setAllProducts(state, action) {
        state.allProducts = action.payload;
        state.isLoading = false; 
    }
}
})

export const {setSellerProducts, setAllProducts} = productSlice.actions;
export default productSlice.reducer;