import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()
        const payload = { email, password }
        await handleLogin(payload)
        navigate("/")
    }

    if (!loading && user) {
        return <Navigate to="/" replace />
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .login-root {
                    min-height: 100vh;
                    background: #0a0a0f;
                    display: flex;
                    font-family: 'DM Sans', sans-serif;
                    overflow: hidden;
                    position: relative;
                }

                .login-root::before {
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

                /* ── Left form panel ── */
                .login-left {
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
                    .login-left {
                        width: 480px;
                        padding: 3rem 3.5rem;
                    }
                }

                .login-card {
                    width: 100%;
                    max-width: 400px;
                    animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .login-card-header { margin-bottom: 2.25rem; }

                .login-step-badge {
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
                .login-step-line {
                    display: inline-block;
                    width: 24px;
                    height: 2px;
                    background: #31b8c6;
                    border-radius: 2px;
                }

                .login-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -0.035em;
                    color: #f0fafb;
                    margin: 0 0 0.5rem;
                    line-height: 1.15;
                }
                .login-subtitle {
                    font-size: 0.88rem;
                    color: rgba(240,250,251,0.45);
                    line-height: 1.5;
                }

                .login-form { display: flex; flex-direction: column; gap: 1.1rem; }
                .login-field { display: flex; flex-direction: column; gap: 7px; }

                .login-label {
                    font-size: 0.78rem;
                    font-weight: 500;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: rgba(240,250,251,0.55);
                }

                .login-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .login-input-icon {
                    position: absolute;
                    left: 14px;
                    color: rgba(49,184,198,0.5);
                    pointer-events: none;
                    display: flex;
                }
                .login-input {
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
                .login-input::placeholder { color: rgba(240,250,251,0.22); }
                .login-input:focus {
                    border-color: #31b8c6;
                    background: rgba(49,184,198,0.06);
                    box-shadow: 0 0 0 3px rgba(49,184,198,0.15);
                }

                .login-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(49,184,198,0.2), transparent);
                    margin: 0.25rem 0;
                }

                .login-btn {
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
                .login-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%);
                    pointer-events: none;
                }
                .login-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(49,184,198,0.35);
                }
                .login-btn:active { transform: translateY(0); }
                .login-btn-arrow {
                    display: inline-block;
                    margin-left: 6px;
                    transition: transform 0.2s;
                }
                .login-btn:hover .login-btn-arrow { transform: translateX(4px); }

                .login-footer {
                    margin-top: 1.75rem;
                    text-align: center;
                    font-size: 0.84rem;
                    color: rgba(240,250,251,0.4);
                }
                .login-footer a {
                    color: #31b8c6;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .login-footer a:hover { color: #5dd2dd; }

                /* ── Right decorative panel ── */
                .login-right {
                    display: none;
                    position: relative;
                    z-index: 1;
                    flex: 1;
                    background: linear-gradient(135deg, #0d1f22 0%, #091418 100%);
                    border-left: 1px solid rgba(49,184,198,0.12);
                    overflow: hidden;
                    padding: 3rem;
                    flex-direction: column;
                    justify-content: space-between;
                }
                @media (min-width: 900px) { .login-right { display: flex; } }

                .login-right-glow {
                    position: absolute;
                    top: -120px;
                    right: -80px;
                    width: 480px;
                    height: 480px;
                    background: radial-gradient(circle, rgba(49,184,198,0.18) 0%, transparent 70%);
                    pointer-events: none;
                    animation: pulseGlow 5s ease-in-out infinite;
                }
                .login-right-glow2 {
                    position: absolute;
                    bottom: -100px;
                    left: -60px;
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

                .login-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                    z-index: 2;
                }
                .login-brand-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    background: #31b8c6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .login-brand-name {
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    font-size: 1.15rem;
                    color: #f0fafb;
                    letter-spacing: -0.02em;
                }

                .login-right-center {
                    position: relative;
                    z-index: 2;
                }
                .login-right-tag {
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
                .login-right-headline {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(2rem, 3.5vw, 3rem);
                    font-weight: 800;
                    line-height: 1.12;
                    letter-spacing: -0.03em;
                    color: #f0fafb;
                    margin: 0 0 1.25rem;
                }
                .login-right-headline span { color: #31b8c6; }
                .login-right-sub {
                    font-size: 0.95rem;
                    color: rgba(240,250,251,0.5);
                    line-height: 1.6;
                    max-width: 340px;
                }

                .login-right-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;
                    z-index: 2;
                }
                .login-stat {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(49,184,198,0.06);
                    border: 1px solid rgba(49,184,198,0.14);
                    border-radius: 12px;
                    padding: 12px 16px;
                }
                .login-stat-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #31b8c6;
                    flex-shrink: 0;
                    box-shadow: 0 0 8px rgba(49,184,198,0.6);
                }
                .login-stat-text {
                    font-size: 0.82rem;
                    color: rgba(240,250,251,0.65);
                    letter-spacing: 0.01em;
                }
            `}</style>

            <div className="login-root">
                {/* ── Left form panel ── */}
                <div className="login-left">
                    <div className="login-card">
                        <div className="login-card-header">
                            <div className="login-step-badge">
                                <span className="login-step-line" />
                                Welcome Back
                            </div>
                            <h1 className="login-title">Sign in to<br />your account</h1>
                            <p className="login-subtitle">Enter your credentials to continue.</p>
                        </div>

                        <form onSubmit={submitForm} className="login-form">
                            {/* Email */}
                            <div className="login-field">
                                <label htmlFor="email" className="login-label">Email</label>
                                <div className="login-input-wrap">
                                    <span className="login-input-icon">
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
                                        className="login-input"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="login-field">
                                <label htmlFor="password" className="login-label">Password</label>
                                <div className="login-input-wrap">
                                    <span className="login-input-icon">
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
                                        placeholder="Enter your password"
                                        required
                                        className="login-input"
                                    />
                                </div>
                            </div>

                            <div className="login-divider" />

                            <button type="submit" className="login-btn">
                                Sign In <span className="login-btn-arrow">→</span>
                            </button>
                        </form>

                        <p className="login-footer">
                            Don&apos;t have an account?{' '}
                            <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>

                {/* ── Right decorative panel ── */}
                <div className="login-right">
                    <div className="login-right-glow" />
                    <div className="login-right-glow2" />

                    <div className="login-brand">
                        <div className="login-brand-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="#0a0a0f" strokeWidth="2" strokeLinejoin="round"/>
                                <circle cx="10" cy="10" r="2.5" fill="#0a0a0f"/>
                            </svg>
                        </div>
                        <span className="login-brand-name">NexChat</span>
                    </div>

                    <div className="login-right-center">
                        <span className="login-right-tag">Trusted Platform</span>
                        <h2 className="login-right-headline">
                            Good to see<br />you <span>again.</span>
                        </h2>
                        <p className="login-right-sub">
                            Pick up right where you left off. Your work, your progress — all waiting for you.
                        </p>
                    </div>

                    <div className="login-right-stats">
                        <div className="login-stat">
                            <div className="login-stat-dot" />
                            <span className="login-stat-text">Your data is always safe &amp; encrypted</span>
                        </div>
                        <div className="login-stat">
                            <div className="login-stat-dot" />
                            <span className="login-stat-text">Sessions secured with industry standards</span>
                        </div>
                        <div className="login-stat">
                            <div className="login-stat-dot" />
                            <span className="login-stat-text">24/7 uptime so you're never blocked</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
