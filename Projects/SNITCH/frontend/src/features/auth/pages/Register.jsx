import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserAuth } from '../hook/userAuth'

const inputBase =
  'h-12 w-full rounded-xl border border-[#d7cebf] bg-[#f7f3eb] px-4 text-[#1f1b16] placeholder:text-[#8b8377] outline-none transition focus:border-[#1f1b16] focus:ring-2 focus:ring-[#1f1b16]/10'

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useUserAuth()

  const [formData, setFormData] = useState({
    contactNumber: '', fullName: '', email: '', password: '', isSeller: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const user = await handleRegister({
        email: formData.email,
        password: formData.password,
        fullname: formData.fullName,
        contact: formData.contactNumber,
        isseller: formData.isSeller,
      })

      if (user?.role === 'seller') {
        navigate('/seller/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      setErrorMessage(apiMessage || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#f4f0e9] p-2 sm:p-4 lg:p-6">
      <div className="mx-auto h-full w-full max-w-7xl overflow-hidden rounded-3xl border border-[#ddd3c4] bg-[#f8f4ec] shadow-[0_24px_60px_-40px_rgba(41,33,21,0.45)] md:grid md:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden h-full md:block">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
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
              Build Your Fashion Profile
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#f4f0e9]/80">
              Join to track orders, discover curated drops, and start selling your products.
            </p>
          </div>
        </aside>

        <section className="flex h-full items-center p-5 sm:p-7 lg:p-10">
          <div className="w-full">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#766f63]">Create Account</p>
            <h2
              className="mt-2 text-3xl leading-tight text-[#1f1b16] sm:text-4xl"
              style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
            >
              Register
            </h2>
            <p className="mt-2 text-sm text-[#6c655a]">Create your profile to start shopping or selling.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Full Name</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputBase}
                    required
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Contact</span>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className={inputBase}
                    required
                  />
                </label>

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

                <label className="block space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Password</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create your password"
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
                </label>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#d7cebf] bg-[#f3ede1] px-4 py-3 text-sm text-[#3b352d]">
                <input
                  type="checkbox"
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#b5aa9a] text-[#1f1b16] focus:ring-[#1f1b16]"
                />
                <span>Register as Seller</span>
              </label>

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
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="pt-0.5 text-center text-sm text-[#6c655a]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#1f1b16] underline-offset-4 hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Register
