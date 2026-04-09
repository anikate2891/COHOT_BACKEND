import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#f5efe2] via-[#efe5d5] to-[#f8f0e2] px-4 py-10">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#c4512d]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#627953]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-[#d9ccb7] bg-[#fffaf1]/95 p-7 shadow-[0_16px_34px_rgba(55,35,21,0.15)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#973d21]">AI Battle Arena</p>
          <h1 className="mt-2 text-3xl font-black text-[#221e1a]">Login</h1>
          <p className="mt-1 text-sm text-[#6f6458]">Continue to your arena dashboard.</p>

          <form className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-[#2b2620]">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                className="w-full rounded-xl border border-[#d9ccb7] bg-white px-4 py-2.5 text-[#221e1a] outline-none transition focus:border-[#c4512d] focus:ring-2 focus:ring-[#c4512d]/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#2b2620]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                className="w-full rounded-xl border border-[#d9ccb7] bg-white px-4 py-2.5 text-[#221e1a] outline-none transition focus:border-[#c4512d] focus:ring-2 focus:ring-[#c4512d]/30"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#c4512d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#973d21]"
            >
              Submit
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#6f6458]">
            Not registered yet?{' '}
            <Link to="/register" className="font-semibold text-[#973d21] underline decoration-2 underline-offset-2">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
