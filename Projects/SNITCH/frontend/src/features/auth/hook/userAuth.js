import {setUser, setLoading, setError } from '../state/auth.Slice.js';
import { registerUser, loginUser, getMe } from '../services/auth.api.js';
import { useDispatch } from 'react-redux';


export const useUserAuth = () => {
    const dispatch = useDispatch();

    async function handleRegister({email, password, contact, fullname, isseller = false}) {
        try { 
            dispatch(setLoading(true));
            const data = await registerUser({email, password, contact, fullname, isseller});
            dispatch(setUser(data.user));
            return data.user;
        } catch (error) {
            dispatch(setError('User Registration', error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({email, password}) {
        const data = await loginUser({email, password});
        dispatch(setUser(data.user));
        return data.user;
    }

    async function handelGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError('Fetching User Details', error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleRegister, handleLogin, handelGetMe };
}   