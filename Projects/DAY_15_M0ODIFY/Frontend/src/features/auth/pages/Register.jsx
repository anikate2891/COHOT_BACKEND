import React from 'react'
import '../../shared/styles/register.css'
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router-dom' 

const Register = () => {
  return (
    <main className="register-page">
      <div className="register-container">
        <h2>Register</h2>
        <form>
          <FormGroup label="Username" placeholder="Enter your username" />
          <FormGroup label="Email" placeholder="Enter your email" />
          <FormGroup label="Password" placeholder="Enter your password" />

          <button className='registerBtn' type="submit">Register</button>
          <div className='register-login'>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Register
