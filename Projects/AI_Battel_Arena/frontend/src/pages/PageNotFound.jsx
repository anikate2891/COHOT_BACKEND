import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#f5efe2] via-[#efe5d5] to-[#f8f0e2] px-4 py-10">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#c4512d]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#627953]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col items-center justify-center text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#973d21]">AI Battle Arena</p>
        <h1 className="mt-3 text-8xl font-black leading-none text-[#221e1a] sm:text-9xl">404</h1>
        <p className="mt-4 text-2xl font-bold text-[#2b2620] sm:text-3xl">Page Not Found</p>
        <p className="mt-3 max-w-xl text-sm text-[#6f6458] sm:text-base">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/login"
          className="mt-8 rounded-xl bg-[#c4512d] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#973d21]"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound
