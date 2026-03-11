import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const Register = () => {
    const {loading , handelRegister} = useAuth()

    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const navigate = useNavigate()


    const handelSubmit = async function handleSubmit  (e) {
        e.preventDefault()

        await handelRegister(username,email,password)
        navigate('/')
    }

    // if(loading){
    //     return (<main><h1>Loading...</h1></main>)
    // }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handelSubmit} >
                    <input
                        onInput={(e)=>{setusername(e.target.value)}}
                        type="text"
                        name='username'
                        placeholder='Enter username' />
                    <input 
                        onInput={(e)=>{setemail(e.target.value)}}
                        type="text"
                        name='email' 
                        placeholder='Enter Email' />
                    <input
                        onInput={(e)=>{setpassword(e.target.value)}}
                        type="password"
                        name='password'
                        placeholder='Enter password' />

                    <button className='button primary-button'>Register</button>
                </form>
                <p>Already have an account? <Link to={'/login'}>Login now.</Link></p>
            </div>
        </main>
    )
}

export default Register
