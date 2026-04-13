import React from "react";

const Register = () => {
  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE (Brand / Image Section) */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center flex-col p-10">
        <h1 className="text-5xl font-bold tracking-wide mb-4">SNITCH</h1>
        <p className="text-gray-400 text-center max-w-sm">
          Join the movement. Discover premium fashion crafted for modern men.
        </p>
      </div>

      {/* RIGHT SIDE (Form Section) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-semibold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">
            Sign up to get started
          </p>

          <form className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition duration-300"
            >
              Register
            </button>

          </form>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <span className="text-black font-medium cursor-pointer hover:underline">
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;