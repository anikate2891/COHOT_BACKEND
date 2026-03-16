import { useDispatch } from "react-redux";
import{register,login,getMe} from '../service/auth.api'
import { setUser, setLoading, setError } from "../auth.Slice";


export function useAuth() {
    const dispatch = useDispatch()

    async function handelregister({email, password , username}){
        try{
            dispatch(setLoading(true))
            await register({email, username, password})
        }catch(err){
            dispatch(setError(err.message))
        } finally{
            dispatch(setLoading(false))
        }
    }

    async function handelLogin({email, password}){
        try{
            dispatch(setLoading(true))
            const data = await login({email, password})
            dispatch(setUser(data))
        } catch(err){
            dispatch(setError(err.message))
        } finally{
            dispatch(setLoading(false))
        }
    }

    async function handelGetMe(){
        try{
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data))
        } catch(err){
            dispatch(setError(err.message))
        } finally{
            dispatch(setLoading(false))
    }
}

    return(
        {handelregister, handelLogin, handelGetMe}
    )


}
