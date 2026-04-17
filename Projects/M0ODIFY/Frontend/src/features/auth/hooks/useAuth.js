import {login , register, logout, getMe} from '../services/auth.api' // Api's
import { AuthContext } from '../auth.Comtext' // Context
import { useContext } from 'react'


export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context;


    async function handleregister({username,email,password}) {
        setLoading(true)
        const data = await register({email,password,username})
        setUser(data.user)
        setLoading(false)
    }

    async function handlelogin({username,email,password}) {
        setLoading(true)
        const data = await login({username,email,password})
        setUser(data.user)
        setLoading(false)
    }

    async function handlegetMe() {
        setLoading(true)
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }

    async function handlelogout() {
        setLoading(true)
        await logout()
        setUser(null)
        setLoading(false)
    }

    return ({handleregister, handlelogin, handlegetMe, handlelogout , user, loading})
}
