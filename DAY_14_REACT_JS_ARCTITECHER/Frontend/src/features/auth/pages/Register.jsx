import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
 function handleSubmit(e) {
        e.preventDefault()
    }
    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit} >
                    <input
                        type="text"
                        name='username'
                        placeholder='Enter username' />
                      <input 
                        type="text"
                        name='email' 
                        placeholder='Enter Email' />
                    <input
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
