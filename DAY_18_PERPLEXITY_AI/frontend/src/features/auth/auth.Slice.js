import {createSlice} from '@reduxjs/toolkit'

const aurhSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:true,
        error:null,
    },
    reducers:{
        setUser(state, action){
            state.user = action.payload
        },
        setLoading(state, action){
            state.loading = action.payload
        },
        setError(state, action){
            state.error = action.payload
        }
    },
})

export const {setUser, setLoading, setError} = aurhSlice.actions
export default aurhSlice.reducer