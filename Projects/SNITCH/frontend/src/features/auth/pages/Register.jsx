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
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } },
}

const fieldVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
}

const inputBase =
  'h-12 w-full rounded-xl border border-zinc-800 bg-black/60 px-4 text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 hover:border-zinc-600'

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useUserAuth()
  
  const [formData, setFormData] = useState({
    contactNumber: '', fullName: '', email: '', password: '', isSeller: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2600)
    // console.log('Register payload:', formData)
    await handleRegister({
      email: formData.email,
      password: formData.password,
      fullname: formData.fullName,   // ✅ lowercase
      contact: formData.contactNumber,
      isseller: formData.isSeller,     // ✅ rename
    })
    navigate('/')
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-black text-zinc-100"
    >
      {/* ── background glow orbs ── */}
      <motion.div
        animate={{ y: [0, -22, 0], scale: [1, 1.07, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-10 left-1/4 h-80 w-80 rounded-full bg-green-500/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-emerald-400/8 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute left-0 top-1/2 h-60 w-60 rounded-full bg-green-600/8 blur-3xl"
      />

      {/* dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,222,128,0.07)_1px,transparent_0)] [background-size:28px_28px]" />

      {/* horizontal scan line */}
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
            className="relative hidden border-r border-zinc-800/70 p-10 lg:block overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-600/5" />

            {/* animated accent bar */}
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
                Wear your
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85, duration: 0.5 }}
                  className="block bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent"
                >
                  next mood.
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-5 max-w-sm text-sm leading-7 text-zinc-400"
              >
                Build your profile once and unlock curated drops, smoother orders, and a cleaner fashion shopping experience.
              </motion.p>

              {/* benefit cards */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.14, delayChildren: 1.05 } } }}
                className="mt-10 space-y-3"
              >
                {[
                  { tag: 'Members', title: 'Fast lane checkout', icon: '⚡' },
                  { tag: 'Sellers', title: 'Showcase your collection', icon: '🛍' },
                ].map(({ tag, title, icon }) => (
                  <motion.div
                    key={tag}
                    variants={{
                      hidden: { opacity: 0, x: -24 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                    }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-black/50 px-4 py-3 cursor-default hover:border-green-400/30 transition-colors"
                  >
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 group-hover:text-green-400 transition-colors">{tag}</p>
                      <p className="text-sm font-semibold text-zinc-100">{title}</p>
                    </div>
                    <span className="ml-auto text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="mt-10 flex gap-6"
              >
                {[['2M+', 'Styles'], ['180+', 'Brands'], ['24h', 'Delivery']].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-xl font-black text-green-300">{num}</p>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.aside>

          {/* ── right form panel ── */}
          <section className="p-6 sm:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">Create Account</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-white">Register</h2>
              <p className="mt-1 text-sm text-zinc-500">Join Snitch. Fresh drops await.</p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              variants={fieldStagger}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">

                <motion.label variants={fieldVariant} className="space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</span>
                  <motion.input whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }}
                    type="text" name="fullName" value={formData.fullName}
                    onChange={handleChange} placeholder="Enter your full name"
                    className={inputBase} required
                  />
                </motion.label>

                <motion.label variants={fieldVariant} className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Contact</span>
                  <motion.input whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }}
                    type="tel" name="contactNumber" value={formData.contactNumber}
                    onChange={handleChange} placeholder="98765 43210"
                    className={inputBase} required
                  />
                </motion.label>

                <motion.label variants={fieldVariant} className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</span>
                  <motion.input whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }}
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="you@example.com"
                    className={inputBase} required
                  />
                </motion.label>

                <motion.label variants={fieldVariant} className="space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</span>
                  <motion.input whileFocus={{ scale: 1.01 }} transition={{ duration: 0.15 }}
                    type="password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Create your password"
                    className={inputBase} required
                  />
                </motion.label>
              </div>

              {/* Seller checkbox */}
              <motion.label
                variants={fieldVariant}
                whileHover={{ scale: 1.01 }}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-black/50 px-4 py-3 transition-colors hover:border-green-400/30"
              >
                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox" name="isSeller" checked={formData.isSeller}
                    onChange={handleChange}
                    className="peer h-5 w-5 appearance-none rounded-md border border-zinc-700 bg-zinc-900 transition checked:border-green-400 checked:bg-green-400"
                  />
                  <AnimatePresence>
                    {formData.isSeller && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18, type: 'spring', stiffness: 350 }}
                        className="pointer-events-none absolute h-3 w-3"
                        viewBox="0 0 12 12" fill="none"
                      >
                        <path d="M2 6l2.8 2.8L10 3.5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm text-zinc-200">Register as Seller</span>
                <AnimatePresence>
                  {formData.isSeller && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8, x: -8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -8 }}
                      className="ml-auto rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-300"
                    >
                      Seller
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.label>

              {/* Submit button */}
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
                        Account Created!
                      </motion.span>
                    ) : (
                      <motion.span key="idle"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      >
                        Create Account
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

              <motion.p variants={fieldVariant} className="text-center text-sm text-zinc-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-green-400 transition hover:text-green-300">
                  Log in
                </Link>
              </motion.p>
            </motion.form>


          </section>
        </motion.div>
      </div>
    </motion.main>
  )
}

export default Register
