import '../style/form.scss'
import { Link } from 'react-router-dom'


const Login = () => {

    function handleSubmit(e) {
        e.preventDefault()
    }
    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit} >
                    <input
                        type="text"
                        name='username'
                        placeholder='Enter username' />
                    <input
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