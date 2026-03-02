import '../style/form.scss'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


const Login = () => {

    const {user , loading, handelLogin} = useAuth()

    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");

    const navigate = useNavigate()

    const handelSubmit = async function handleSubmit(e) {
        e.preventDefault()

        await handelLogin(username , password)
        navigate('/')
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handelSubmit} >
                    <input
                        onInput={(e)=>{setusername(e.target.value)}}
                        type="text"
                        name='username'
                        placeholder='Enter username' />
                    <input
                        onInput={(e)=>{setpassword(e.target.value)}}
                        type="password"
                        name='password'
                        placeholder='Enter password' />
                    <button className='button primary-button'>Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"}>Register now.</Link></p>
            </div>
        </main>
    )
}

export default Login