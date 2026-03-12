import React from 'react'
import '../../shared/styles/login.css'
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'


const Login = () => {

  const {loading , handlelogin} = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault()
    await handlelogin({email,password})
    navigate('/') // Redirect to home page after login
  }

  return (
    <main className='loginpage'>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <FormGroup
           value={email}
            onChange={(e) => setEmail(e.target.value)}
          label="Username" placeholder="Enter your username" />
          <FormGroup 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password" placeholder="Enter your password" />

          <button className='loginBtn' type="submit">Login</button>
          <div className='login-register'>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>

      </div>
    </main>
  )
}

export default Login
