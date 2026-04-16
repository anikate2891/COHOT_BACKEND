import {setUser, setLoading, setError } from '../state/auth.Slice.js';
import { registerUser, loginUser } from '../services/auth.api.js';
import { useDispatch } from 'react-redux';


export const useUserAuth = () => {
    const dispatch = useDispatch();

    async function handleRegister({email, password, contact, fullname, isseller = false}) {
        try { dispatch(setLoading(true));
            const data = await registerUser({email, password, contact, fullname, isseller});
            dispatch(setUser(data));
        } catch (error) {
            dispatch(setError('User Registration', error.message));
        }
    }

    async function handleLogin({email, password}) {
        const data = await loginUser({email, password});
        dispatch(setUser(data.user));
    }

    return { handleRegister, handleLogin };
}