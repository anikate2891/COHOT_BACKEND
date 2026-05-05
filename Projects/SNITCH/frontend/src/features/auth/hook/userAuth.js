import { setUser, setLoading, setError } from '../state/auth.Slice.js';
import { registerUser, loginUser, getMe, logoutUser } from '../services/auth.api.js';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react'; // ✅ add this

export const useUserAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = useCallback(async ({ email, password, contact, fullname, isseller = false }) => {
        try {
            dispatch(setLoading(true));
            const data = await registerUser({ email, password, contact, fullname, isseller });
            dispatch(setUser(data.user));
            return data.user;
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ email, password }) => {
        try {
            dispatch(setLoading(true));
            const data = await loginUser({ email, password });
            dispatch(setUser(data.user));
            return data.user;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handelGetMe = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            console.log("getMe calling..."); // ✅
            const data = await getMe();
            console.log("getMe response:", data); // ✅
            dispatch(setUser(data.user));
        } catch (error) {
            console.log("getMe ERROR:", error); // ✅
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
            console.log("setLoading(false) called"); // ✅
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            await logoutUser();
            dispatch(setUser(null));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return { handleRegister, handleLogin, handelGetMe, handleLogout };
}