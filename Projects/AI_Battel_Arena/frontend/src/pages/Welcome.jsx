import { Link } from 'react-router-dom'

const Welcome = () => {
 

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#f5efe2] via-[#efe5d5] to-[#f8f0e2] px-4 py-10">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-[#c4512d]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 animate-[pulse_7s_ease-in-out_infinite] rounded-full bg-[#627953]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col items-center justify-center text-center">
        <p
          className="reveal-in text-xs font-extrabold uppercase tracking-[0.2em] text-[#973d21]"
          style={{ animationDuration: '700ms' }}
        >
          AI Battle Arena
        </p>
        <h1
          className="reveal-up delay-1 mt-4 text-6xl font-black leading-tight text-[#221e1a] sm:text-7xl md:text-8xl"
          style={{ animationDuration: '700ms', animationDelay: '220ms' }}
        >
          Welcome To The Arena
        </h1>
        <p
          className="reveal-up delay-2 mt-4 max-w-2xl text-base text-[#6f6458] sm:text-lg"
          style={{ animationDuration: '700ms', animationDelay: '420ms' }}
        >
          Your next battle with AI starts here.
        </p>

        <Link
          to="/"
          className="reveal-up delay-3 mt-8 rounded-xl bg-[#c4512d] px-6 py-2.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#973d21]"
          style={{ animationDuration: '700ms', animationDelay: '620ms' }}
        >
          Go To Home
        </Link>
      </div>
    </div>
  )
}

export default Welcome
