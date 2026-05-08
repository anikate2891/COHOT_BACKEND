import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserAuth } from "../auth/hook/userAuth.js";

const Nav = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const allProducts = useSelector((state) => state.product.allProducts);
  const { handleLogout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hideNav = location.pathname === "/login" || location.pathname === "/register";
  const cartCount = cartItems?.length || 0;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const userMenuRef = useRef(null);
  const toastTimerRef = useRef(null);
  const searchValue = searchParams.get("q") || "";
  const suggestions = searchValue.trim().length === 0
  ? []
  : allProducts
      .filter(p => p.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
      .slice(0, 6);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const pendingToast = sessionStorage.getItem('authToast');
    if (pendingToast === 'logged-in') {
      sessionStorage.removeItem('authToast');
      setTimeout(() => {
        setToastMessage('Logged in');
        setShowToast(true);
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }, 0);
    }
  }, [user]);

  function handleLogoutWithToast() {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setToastMessage('Logged out');
    setShowToast(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2000);
    handleLogout();
  }

  return (
    <div className="min-h-screen bg-[#f4f0e9] text-[#1f1b16]">
      <div
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full border border-[#caa85a] bg-[#e9b65a] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f1b16] shadow-[0_12px_30px_rgba(31,27,22,0.12)] transition-all duration-300 ease-out ${
          showToast ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {toastMessage}
      </div>
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
              {isHome && (
                <div className="relative hidden md:flex">
                  <label className="group relative">
                    {/* existing search input — koi change nahi */}
                    <input
                      value={searchValue}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      onChange={(event) => {
                        const next = event.target.value;
                        const nextParams = new URLSearchParams(searchParams);
                        if (next.trim().length === 0) {
                          nextParams.delete("q");
                        } else {
                          nextParams.set("q", next);
                        }
                        setSearchParams(nextParams);
                        setShowSuggestions(true);
                      }}
                      placeholder="Search products"
                      className="w-56 rounded-full border border-[#d7cebf] bg-[#f7f3eb] py-2 pl-9 pr-10 text-[11px] uppercase tracking-[0.18em] text-[#1f1b16] transition-all duration-300 ease-out placeholder:text-[#8a8276] focus:w-96 focus:border-[#1f1b16] focus:bg-[#f4f0e9] focus:outline-none focus:shadow-lg"
                    />
                    {searchValue && (
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          const nextParams = new URLSearchParams(searchParams);
                          nextParams.delete("q");
                          setSearchParams(nextParams);
                          setShowSuggestions(false);
                        }}
                        className="absolute inset-y-0 right-2 flex items-center justify-center text-[#7c7469] transition hover:text-[#1f1b16]"
                        aria-label="Clear search"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </label>

  {/* Dropdown */}
  {showSuggestions && suggestions.length > 0 && (
    <div className="absolute left-0 top-full z-50 mt-2 w-96 border border-[#ddd3c4] bg-[#f8f4ec] shadow-lg">
      {suggestions.map((product) => (
        <button
          key={product._id}
          type="button"
          onMouseDown={() => {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("q", product.title);
            setSearchParams(nextParams);
            setShowSuggestions(false);
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#ede6d8]"
        >
          {product?.images?.[0]?.url && (
            <img
              src={product.images[0].url}
              alt={product.title}
              className="h-8 w-8 object-cover border border-[#ddd3c4]"
            />
          )}
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#1f1b16]">
            {product.title}
          </span>
        </button>
      ))}
    </div>
  )}
                </div>
              )}
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
                          handleLogoutWithToast();
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
                {isHome && (
                  <label className="relative">
                    <span className="sr-only">Search products</span>
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8a8276]">
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
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.35-4.35" />
                      </svg>
                    </span>
                    <input
                      value={searchValue}
                      onChange={(event) => {
                        const next = event.target.value;
                        const nextParams = new URLSearchParams(searchParams);
                        if (next.trim().length === 0) {
                          nextParams.delete("q");
                        } else {
                          nextParams.set("q", next);
                        }
                        setSearchParams(nextParams);
                      }}
                      placeholder="Search products"
                      className="w-full rounded-full border border-[#d7cebf] bg-[#f4f0e9] py-2 pl-9 pr-10 text-[11px] uppercase tracking-[0.18em] text-[#1f1b16] transition-all duration-300 ease-out placeholder:text-[#8a8276] focus:border-[#1f1b16] focus:outline-none"
                    />
                    {searchValue && (
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          const nextParams = new URLSearchParams(searchParams);
                          nextParams.delete("q");
                          setSearchParams(nextParams);
                        }}
                        className="absolute inset-y-0 right-2 flex items-center justify-center text-[#7c7469] transition hover:text-[#1f1b16]"
                        aria-label="Clear search"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </label>
                )}
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
                      handleLogoutWithToast();
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
