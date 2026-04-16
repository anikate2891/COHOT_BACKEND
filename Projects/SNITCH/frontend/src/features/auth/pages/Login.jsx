import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { useUserAuth } from '../hook/userAuth'
import { useNavigate } from 'react-router-dom'

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}

const sidebarVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] } },
}

const fieldStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
}

const fieldVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
}

const inputBase =
  'h-12 w-full rounded-xl border border-zinc-800 bg-black/60 px-4 text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 hover:border-zinc-600'

const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useUserAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2600)
    console.log('Login payload:', formData)
    await handleLogin({ email: formData.email, password: formData.password })
    navigate('/')
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-black text-zinc-100"
    >
      {/* ── background orbs ── */}
      <motion.div
        animate={{ y: [0, -22, 0], scale: [1, 1.07, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-10 right-1/4 h-80 w-80 rounded-full bg-green-500/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="pointer-events-none absolute bottom-0 left-10 h-96 w-96 rounded-full bg-emerald-400/8 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute right-0 top-1/2 h-60 w-60 rounded-full bg-green-600/8 blur-3xl"
      />

      {/* dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,222,128,0.07)_1px,transparent_0)] [background-size:28px_28px]" />

      {/* scan line */}
      <motion.div
        initial={{ top: '-2%' }}
        animate={{ top: '102%' }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        className="pointer-events-none absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-green-400/30 to-transparent"
      />

      {/* ── layout ── */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="grid w-full overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/80 shadow-[0_0_80px_-20px_rgba(74,222,128,0.18)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]"
        >
          {/* ── left panel ── */}
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="relative hidden border-r border-zinc-800/70 p-10 lg:flex lg:flex-col lg:justify-between overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-600/5" />

            {/* accent bar */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ originY: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-green-400/70 to-transparent"
            />

            {/* pulsing dot */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute right-8 top-8 h-2 w-2 rounded-full bg-green-400"
            />

            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-green-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                SNITCH CLOTHES
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.65 }}
                className="mt-8 max-w-sm text-[2.8rem] font-black leading-[1.0] tracking-tight text-white"
              >
                Welcome
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85, duration: 0.5 }}
                  className="block bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent"
                >
                  back.
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-5 max-w-sm text-sm leading-7 text-zinc-400"
              >
                Your next fit is waiting. Log back in and pick up right where you left off — drops, orders, everything.
              </motion.p>

              {/* feature pills */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.14, delayChildren: 1.05 } } }}
                className="mt-10 space-y-3"
              >
                {[
                  { icon: '🔥', label: 'New Drops', desc: 'Exclusive restocks & launches' },
                  { icon: '📦', label: 'Your Orders', desc: 'Track every package live' },
                  { icon: '❤️', label: 'Wishlist', desc: 'Saved styles, ready to cart' },
                ].map(({ icon, label, desc }) => (
                  <motion.div
                    key={label}
                    variants={{
                      hidden: { opacity: 0, x: -24 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                    }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-black/50 px-4 py-3 cursor-default hover:border-green-400/30 transition-colors"
                  >
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 group-hover:text-green-400 transition-colors">{label}</p>
                      <p className="text-sm font-semibold text-zinc-100">{desc}</p>
                    </div>
                    <span className="ml-auto text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* bottom stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="relative z-10 mt-10 flex gap-6"
            >
              {[['2M+', 'Styles'], ['180+', 'Brands'], ['24h', 'Delivery']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-xl font-black text-green-300">{num}</p>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.aside>

          {/* ── right form panel ── */}
          <section className="p-6 sm:p-8 lg:p-10">
            {/* mobile logo */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-6 flex items-center gap-2 lg:hidden"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                SNITCH CLOTHES
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Welcome Back</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-white">Log In</h2>
              <p className="mt-1 text-sm text-zinc-500">Your next fit is one click away.</p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              variants={fieldStagger}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Email */}
              <motion.label variants={fieldVariant} className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</span>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@example.com"
                  className={inputBase} required
                />
              </motion.label>

              {/* Password */}
              <motion.div variants={fieldVariant} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</span>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-zinc-500 transition hover:text-green-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.15 }}
                    type={showPassword ? 'text' : 'password'}
                    name="password" value={formData.password}
                    onChange={handleChange} placeholder="Enter your password"
                    className={`${inputBase} pr-12`} required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-green-400"
                  >
                    <AnimatePresence mode="wait">
                      {showPassword ? (
                        <motion.svg key="hide"
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"
                        >
                          <path d="M3 3l14 14M8.5 8.6A3 3 0 0011.4 11.5M6.4 6.5C4.8 7.6 3.5 9 3 10c1.2 2.8 4.2 5 7 5a7.2 7.2 0 003.6-.98M9.9 5.08C9.93 5.05 9.96 5.03 10 5c2.8 0 5.8 2.2 7 5-.4.9-1 1.8-1.7 2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      ) : (
                        <motion.svg key="show"
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"
                        >
                          <path d="M10 4C6.5 4 3.5 6.5 2 10c1.5 3.5 4.5 6 8 6s6.5-2.5 8-6c-1.5-3.5-4.5-6-8-6z" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="10" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>

              {/* Remember me */}
              <motion.label
                variants={fieldVariant}
                whileHover={{ scale: 1.01 }}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-black/50 px-4 py-3 transition-colors hover:border-green-400/30"
              >
                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 appearance-none rounded-md border border-zinc-700 bg-zinc-900 transition checked:border-green-400 checked:bg-green-400"
                  />
                  <svg className="pointer-events-none absolute h-3 w-3 opacity-0 peer-checked:opacity-100 transition-opacity"
                    viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l2.8 2.8L10 3.5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-zinc-200">Keep me logged in</span>
              </motion.label>

              {/* Submit */}
              <motion.div variants={fieldVariant}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative mt-2 h-12 w-full overflow-hidden rounded-xl bg-green-400 font-bold tracking-wide text-black"
                >
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.span key="done"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 350 }}
                          className="h-5 w-5" viewBox="0 0 20 20" fill="none"
                        >
                          <path d="M4 10l4.5 4.5L16 6" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                        Welcome Back!
                      </motion.span>
                    ) : (
                      <motion.span key="idle"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      >
                        Log In
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* shimmer */}
                  <motion.span
                    initial={{ x: '-120%' }}
                    whileHover={{ x: '220%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                </motion.button>
              </motion.div>

              {/* divider */}
              <motion.div variants={fieldVariant} className="relative flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-xs text-zinc-600">or</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </motion.div>

              {/* Google OAuth placeholder */}
              <motion.div variants={fieldVariant}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01, borderColor: 'rgba(74,222,128,0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-black/50 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-900"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </motion.button>
              </motion.div>

              <motion.p variants={fieldVariant} className="text-center text-sm text-zinc-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-green-400 transition hover:text-green-300">
                  Register
                </Link>
              </motion.p>
            </motion.form>
          </section>
        </motion.div>
      </div>
    </motion.main>
  )
}

export default Login
