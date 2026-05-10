import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  return (
    <main className="relative min-h-screen bg-[#f4f0e9] text-[#1f1b16]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#efe7db] blur-3xl" />
        <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-[#f7f3eb] blur-2xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-12 pt-10 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between border-b border-[#d7cebf] pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#6c655a]">Order</p>
            <h1
              className="mt-3 text-4xl sm:text-5xl"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              Payment Confirmed
            </h1>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#6c655a]">Thank you</p>
        </div>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#e1d8c9] bg-[#f7f3eb] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1f1b16]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="#1f1b16"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6c655a]">Order Success</p>
                  <h2
                    className="mt-2 text-2xl"
                    style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  >
                    Your order is placed.
                  </h2>
                  <p className="mt-3 text-sm text-[#6c655a]">
                    We have sent a confirmation to your registered email. You can track the shipment once it is dispatched.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {['Processing', 'Packed', 'Out for delivery'].map((step) => (
                <div
                  key={step}
                  className="rounded-2xl border border-[#e1d8c9] bg-[#f7f3eb] p-5"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c655a]">Next</p>
                  <p className="mt-3 text-sm" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#e1d8c9] bg-[#f7f3eb] p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#6c655a]">Receipt</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-[#d7cebf]/70 pb-3">
                  <span className="text-[#6c655a]">Order ID</span>
                  <span className="font-semibold text-[#1f1b16]">{orderId || 'Unavailable'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6c655a]">Status</span>
                  <span className="font-semibold text-[#1f1b16]">Confirmed</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/"
                className="flex h-12 w-full items-center justify-center border border-[#1f1b16] bg-[#1f1b16] text-xs font-semibold uppercase tracking-[0.2em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
              >
                Continue Shopping
              </Link>
              <Link
                to="/cart"
                className="flex h-12 w-full items-center justify-center border border-[#d7cebf] bg-transparent text-xs font-semibold uppercase tracking-[0.2em] text-[#1f1b16] transition hover:bg-[#eae4d9]"
              >
                Back to Cart
              </Link>
            </div>

            <div className="space-x-4 text-center text-[10px] uppercase tracking-[0.2em] text-[#6c655a]">
              <span>Secure Checkout</span>
              <span>&bull;</span>
              <span>Fast Dispatch</span>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default OrderSuccess;
