import {setUser, setLoading, setError } from '../state/auth.Slice.js';
import { registerUser } from '../services/auth.api.js';
import { useDispatch } from 'react-redux';


export const useUserAuth = () => {
    const dispatch = useDispatch();

    async function handleRegister({email, password, contact, fullname, seller = false}) {
        try {            setLoading(true);
            const data = await registerUser({email, password, contact, fullname});
            dispatch(setUser(data));
        } catch (error) {
            dispatch(setError('User Registration', error.message));
        }
    }

    return { handleRegister };
}