import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserAuth } from '../hook/userAuth'

const inputBase =
  'h-12 w-full rounded-xl border border-[#d7cebf] bg-[#f7f3eb] px-4 text-[#1f1b16] placeholder:text-[#8b8377] outline-none transition focus:border-[#1f1b16] focus:ring-2 focus:ring-[#1f1b16]/10'

const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useUserAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const user = await handleLogin({ email: formData.email, password: formData.password })
      if (user.role === 'buyer') {
        navigate('/')
      } else if (user.role === 'seller') {
        navigate('/seller/dashboard')
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      setErrorMessage(apiMessage || 'Login failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#f4f0e9] p-2 sm:p-4 lg:p-6">
      <div className="mx-auto h-full w-full max-w-7xl overflow-hidden rounded-3xl border border-[#ddd3c4] bg-[#f8f4ec] shadow-[0_24px_60px_-40px_rgba(41,33,21,0.45)] md:grid md:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden h-full md:block">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80"
            alt="Fashion e-commerce showcase"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-black/65 via-black/25 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#f4f0e9]/85">SNITCH Atelier</p>
            <h1
              className="mt-3 max-w-md text-3xl leading-tight text-[#f4f0e9] lg:text-4xl"
              style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
            >
              Style Curated for Every Drop
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#f4f0e9]/80">
              Track trends, discover new arrivals, and manage your shopping in one clean place.
            </p>
          </div>
        </aside>

        <section className="flex h-full items-center p-5 sm:p-7 lg:p-10">
          <div className="w-full">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#766f63]">Welcome Back</p>
          <h2
            className="mt-2 text-3xl leading-tight text-[#1f1b16] sm:text-4xl"
            style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
          >
            Log In
          </h2>
          <p className="mt-2 text-sm text-[#6c655a]">Your account, orders, and saved picks are waiting.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputBase}
                required
              />
            </label>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Password</span>
                <Link to="/forgot-password" className="text-xs text-[#7d7569] transition hover:text-[#1f1b16]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputBase} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6d665c] transition hover:text-[#1f1b16]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 inline-flex h-12 w-full items-center justify-center border border-[#1f1b16] bg-[#1f1b16] text-sm font-semibold uppercase tracking-[0.14em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>

            <a
              href="/api/auth/google"
              className="inline-flex h-12 w-full items-center justify-center gap-3 border border-[#d7cebf] bg-[#f3ede1] text-sm font-semibold text-[#3b352d] transition hover:bg-[#ece4d6]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </a>

            <p className="pt-0.5 text-center text-sm text-[#6c655a]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-[#1f1b16] underline-offset-4 hover:underline">
                Register
              </Link>
            </p>
          </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
