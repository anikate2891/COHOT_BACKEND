import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { handleRegister } = useAuth()

  const submitForm = async (event) => {
    event.preventDefault()
    await handleRegister({ username, email, password })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .reg-root {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* ── Animated background grid ── */
        .reg-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(49,184,198,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(49,184,198,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Left decorative panel ── */
        .reg-left {
          display: none;
          position: relative;
          z-index: 1;
          flex: 1;
          background: linear-gradient(135deg, #0d1f22 0%, #091418 100%);
          border-right: 1px solid rgba(49,184,198,0.12);
          overflow: hidden;
          padding: 3rem;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 900px) { .reg-left { display: flex; } }

        .reg-left-glow {
          position: absolute;
          top: -120px;
          left: -80px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(49,184,198,0.18) 0%, transparent 70%);
          pointer-events: none;
          animation: pulseGlow 5s ease-in-out infinite;
        }
        .reg-left-glow2 {
          position: absolute;
          bottom: -100px;
          right: -60px;
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(49,184,198,0.10) 0%, transparent 70%);
          pointer-events: none;
          animation: pulseGlow 7s ease-in-out infinite reverse;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }

        .reg-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }
        .reg-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #31b8c6;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .reg-brand-icon svg { display: block; }
        .reg-brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.15rem;
          color: #f0fafb;
          letter-spacing: -0.02em;
        }

        .reg-left-center {
          position: relative;
          z-index: 2;
        }
        .reg-left-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #31b8c6;
          background: rgba(49,184,198,0.1);
          border: 1px solid rgba(49,184,198,0.25);
          border-radius: 100px;
          padding: 4px 14px;
          margin-bottom: 1.5rem;
        }
        .reg-left-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.03em;
          color: #f0fafb;
          margin: 0 0 1.25rem;
        }
        .reg-left-headline span {
          color: #31b8c6;
        }
        .reg-left-sub {
          font-size: 0.95rem;
          color: rgba(240,250,251,0.5);
          line-height: 1.6;
          max-width: 340px;
        }

        .reg-left-pills {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 2;
        }
        .reg-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(49,184,198,0.06);
          border: 1px solid rgba(49,184,198,0.14);
          border-radius: 12px;
          padding: 12px 16px;
        }
        .reg-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #31b8c6;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(49,184,198,0.6);
        }
        .reg-pill-text {
          font-size: 0.82rem;
          color: rgba(240,250,251,0.65);
          letter-spacing: 0.01em;
        }

        /* ── Right form panel ── */
        .reg-right {
          position: relative;
          z-index: 1;
          flex: 0 0 auto;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
        }
        @media (min-width: 900px) {
          .reg-right {
            width: 480px;
            padding: 3rem 3.5rem;
          }
        }

        .reg-card {
          width: 100%;
          max-width: 400px;
          animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .reg-card-header { margin-bottom: 2.25rem; }

        .reg-step-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #31b8c6;
          margin-bottom: 1rem;
        }
        .reg-step-line {
          display: inline-block;
          width: 24px;
          height: 2px;
          background: #31b8c6;
          border-radius: 2px;
        }

        .reg-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.035em;
          color: #f0fafb;
          margin: 0 0 0.5rem;
          line-height: 1.15;
        }
        .reg-subtitle {
          font-size: 0.88rem;
          color: rgba(240,250,251,0.45);
          line-height: 1.5;
        }

        .reg-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .reg-field { display: flex; flex-direction: column; gap: 7px; }

        .reg-label {
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(240,250,251,0.55);
        }

        .reg-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .reg-input-icon {
          position: absolute;
          left: 14px;
          color: rgba(49,184,198,0.5);
          pointer-events: none;
          display: flex;
        }
        .reg-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 14px 12px 42px;
          color: #f0fafb;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.93rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .reg-input::placeholder { color: rgba(240,250,251,0.22); }
        .reg-input:focus {
          border-color: #31b8c6;
          background: rgba(49,184,198,0.06);
          box-shadow: 0 0 0 3px rgba(49,184,198,0.15);
        }

        .reg-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(49,184,198,0.2), transparent);
          margin: 0.25rem 0;
        }

        .reg-btn {
          position: relative;
          width: 100%;
          border: none;
          border-radius: 10px;
          padding: 13px 24px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #0a0a0f;
          background: #31b8c6;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          margin-top: 0.4rem;
        }
        .reg-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%);
          pointer-events: none;
        }
        .reg-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(49,184,198,0.35);
        }
        .reg-btn:active { transform: translateY(0); }
        .reg-btn-arrow {
          display: inline-block;
          margin-left: 6px;
          transition: transform 0.2s;
        }
        .reg-btn:hover .reg-btn-arrow { transform: translateX(4px); }

        .reg-footer {
          margin-top: 1.75rem;
          text-align: center;
          font-size: 0.84rem;
          color: rgba(240,250,251,0.4);
        }
        .reg-footer a {
          color: #31b8c6;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }
        .reg-footer a:hover { color: #5dd2dd; }
      `}</style>

      <div className="reg-root">
        {/* ── Left panel ── */}
        <div className="reg-left">
          <div className="reg-left-glow" />
          <div className="reg-left-glow2" />

          <div className="reg-brand">
            <div className="reg-brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="#0a0a0f" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="10" cy="10" r="2.5" fill="#0a0a0f"/>
              </svg>
            </div>
            <span className="reg-brand-name">NexChat</span>
          </div>

          <div className="reg-left-center">
            <span className="reg-left-tag">Get Started</span>
            <h2 className="reg-left-headline">
              Build something<br /><span>extraordinary</span><br />today.
            </h2>
            <p className="reg-left-sub">
              Join thousands of creators and developers who ship faster with our platform.
            </p>
          </div>

          <div className="reg-left-pills">
            <div className="reg-pill">
              <div className="reg-pill-dot" />
              <span className="reg-pill-text">Free forever on the starter plan</span>
            </div>
            <div className="reg-pill">
              <div className="reg-pill-dot" />
              <span className="reg-pill-text">No credit card required to sign up</span>
            </div>
            <div className="reg-pill">
              <div className="reg-pill-dot" />
              <span className="reg-pill-text">Set up your account in under 2 minutes</span>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="reg-right">
          <div className="reg-card">
            <div className="reg-card-header">
              <div className="reg-step-badge">
                <span className="reg-step-line" />
                New Account
              </div>
              <h1 className="reg-title">Create your<br />account</h1>
              <p className="reg-subtitle">Fill in the details below to get started.</p>
            </div>

            <form onSubmit={submitForm} className="reg-form">
              {/* Username */}
              <div className="reg-field">
                <label htmlFor="username" className="reg-label">Username</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Choose a username"
                    required
                    className="reg-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="reg-field">
                <label htmlFor="email" className="reg-label">Email</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="reg-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="reg-field">
                <label htmlFor="password" className="reg-label">Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    required
                    className="reg-input"
                  />
                </div>
              </div>

              <div className="reg-divider" />

              <button type="submit" className="reg-btn">
                Create Account <span className="reg-btn-arrow">→</span>
              </button>
            </form>

            <p className="reg-footer">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
