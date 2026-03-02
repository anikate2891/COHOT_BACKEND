import { useContext } from "react";
import { AuthContext } from "../auth.Contex";
import { register , login , getMe } from "../services/auth.api";


export const useAuth = function(){
    // useContext(context_name{in this case we crate a context, which is AuthContext in auth.Context.jsx})
    
    const context = useContext(AuthContext)
    const {user , setuser , loading , setloading} = context

//Api's part
    const handelLogin = async (username,password) => {
        setloading(true)

        const response = await login(username,password)
        setuser(response.user)

        setloading(false)
    }

    const handelRegister = async (username , email , password) => {
        setloading(true)

        const response = await register(username,email,password)
        setuser(response.user)

        setloading(false)
    }

    return {
    user,
    loading,
    handelLogin,
    handelRegister
    }
}
    