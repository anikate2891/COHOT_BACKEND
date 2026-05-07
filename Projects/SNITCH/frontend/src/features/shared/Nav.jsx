import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserAuth } from "../auth/hook/userAuth.js";

const Nav = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const { handleLogout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hideNav = location.pathname === "/login" || location.pathname === "/register";
  const cartCount = cartItems?.length || 0;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f0e9] text-[#1f1b16]">
      {!hideNav && (
        <header className="border-b border-[#d7cebf]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4">
              {!isHome && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7cebf] text-[#6c655a] transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
                  aria-label="Go back"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}
              <Link to="/" className="text-lg font-semibold tracking-[0.2em] uppercase">
                Snitch
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7cebf] text-[#6c655a] transition hover:border-[#1f1b16] hover:text-[#1f1b16] md:hidden"
                aria-label="Toggle navigation"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </svg>
              </button>
              <nav className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6c655a] md:flex">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#d7cebf] px-4 py-2 transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 11.5L12 4l9 7.5" />
                  <path d="M5 10.5V20h14v-9.5" />
                </svg>
                Home
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-[#d7cebf] px-4 py-2 transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
              >
                <span className="relative">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1f1b16] px-1 text-[9px] font-semibold text-[#f4f0e9]">
                      {cartCount}
                    </span>
                  )}
                </span>
                Cart
              </Link>
              {user?.role === "seller" && (
                <Link
                  to="/seller/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d7cebf] px-4 py-2 transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
                >
                  Dashboard
                </Link>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1f1b16] bg-[#1f1b16] px-4 py-2 text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
                >
                  Login
                </Link>
              )}
              {user && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#1f1b16] bg-[#1f1b16] px-4 py-2 text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <span>{user.fullname || user.email}</span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={`transition ${isUserMenuOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 3.5L5 6.5L8 3.5" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-[#e1d8c9] bg-[#f7f3eb] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5f584e] shadow-[0_12px_30px_rgba(31,27,22,0.12)]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#efe7db]"
                        role="menuitem"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d7cebf]">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <path d="M16 17l5-5-5-5" />
                            <path d="M21 12H9" />
                          </svg>
                        </span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="border-t border-[#e1d8c9] bg-[#f7f3eb] px-4 py-4 sm:px-8 lg:px-12 md:hidden">
              <div className="flex flex-col gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6c655a]">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d7cebf] px-4 py-2 transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 11.5L12 4l9 7.5" />
                    <path d="M5 10.5V20h14v-9.5" />
                  </svg>
                  Home
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d7cebf] px-4 py-2 transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
                >
                  <span className="relative">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1f1b16] px-1 text-[9px] font-semibold text-[#f4f0e9]">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  Cart
                </Link>
                {user?.role === "seller" && (
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d7cebf] px-4 py-2 transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
                  >
                    Dashboard
                  </Link>
                )}
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#1f1b16] bg-[#1f1b16] px-4 py-2 text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
                  >
                    Login
                  </Link>
                )}
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-[#1f1b16] bg-[#1f1b16] px-4 py-2 text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      <Outlet />
    </div>
  );
};

export default Nav;
