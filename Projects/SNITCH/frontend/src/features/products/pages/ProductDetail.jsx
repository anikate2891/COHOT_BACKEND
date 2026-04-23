import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProduct } from '../hook/useProduct.js';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const { handelGetProductDetails } = useProduct();

    const images = useMemo(() => product?.images || [], [product]);
    const selectedImage = images[selectedImageIndex]?.url;

    function handlePreviousImage() {
      if (images.length <= 1) return;
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    function handleNextImage() {
      if (images.length <= 1) return;
      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }

    function getDisplayPrice(price) {
        if (!price) return 'N/A';
        const { amount, currency } = price;
        if (amount === undefined || amount === null) return 'N/A';
        return `${currency || 'INR'} ${amount}`;
    }

    useEffect(() => {
      async function fetchProductDetails() {
        try {
          setIsLoading(true);
          setErrorMessage('');
          const data = await handelGetProductDetails(productId);
          setProduct(data);
          setSelectedImageIndex(0);
        } catch (error) {
          const apiMessage = error?.response?.data?.message;
          setErrorMessage(apiMessage || 'Unable to load product details.');
        } finally {
          setIsLoading(false);
        }
      }

      fetchProductDetails();
    }, [productId, handelGetProductDetails]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#f4f0e9] px-5 py-8 text-[#1f1b16] sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl border border-[#ded5c8] bg-[#f7f3eb] p-6 text-sm">
                    Loading product details...
                </div>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="min-h-screen bg-[#f4f0e9] px-5 py-8 text-[#1f1b16] sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl border border-red-300 bg-red-100 p-6 text-sm text-red-700">
                    {errorMessage}
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-[#f4f0e9] px-5 py-8 text-[#1f1b16] sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl border border-[#ded5c8] bg-[#f7f3eb] p-6 text-sm">
                    Product not found.
                </div>
            </main>
        );
    }
    
  return (
    <main className="min-h-screen bg-[#f4f0e9] px-5 py-8 text-[#1f1b16] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between border-b border-[#ddd3c4] pb-4">
          <p className="text-[28px] tracking-[0.12em]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
            SNITCH.
          </p>
          <Link
            to="/"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f584e] transition hover:text-[#1f1b16]"
          >
            Back to Store
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.78fr_0.92fr] lg:gap-12">
          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex w-15 shrink-0 flex-col gap-2">
                {(images.length > 0 ? images : [{ url: '' }]).map((image, index) => (
                  <button
                    key={image._id || index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden border ${index === selectedImageIndex ? 'border-[#1f1b16]' : 'border-[#d7cebf]'} bg-[#e6ddcf] transition`}
                  >
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] uppercase text-[#746d61]">No image</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="group relative flex-1">
                <div className="aspect-4/5 overflow-hidden border border-[#ddd3c4] bg-[#dfd4c5]">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.14em] text-[#6f685d]">
                      No image
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePreviousImage}
                      className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#2f2921] bg-[#3a332a]/90 text-lg font-bold leading-none text-[#f4f0e9] opacity-0 shadow-sm transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-[#2c261f] focus-visible:opacity-100 focus-visible:outline-none"
                      aria-label="Previous image"
                    >
                      &larr;
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#2f2921] bg-[#3a332a]/90 text-lg font-bold leading-none text-[#f4f0e9] opacity-0 shadow-sm transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-[#2c261f] focus-visible:opacity-100 focus-visible:outline-none"
                      aria-label="Next image"
                    >
                      &rarr;
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <h1
                className="text-4xl leading-tight text-[#1f1b16] lg:text-5xl"
                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
              >
                {product.title}
              </h1>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#4f493f]">
                {getDisplayPrice(product.price)}
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b7368]">The Details</p>
              <p className="mt-3 text-sm leading-7 text-[#3f3930]">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center border border-[#1f1b16] bg-[#1f1b16] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center border border-[#cfc5b6] bg-[#f7f2e9] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f1b16] transition hover:border-[#1f1b16]"
              >
                Buy Now
              </button>
            </div>

            <div className="space-y-2 border-t border-[#ddd3c4] pt-5 text-[11px] uppercase tracking-[0.12em] text-[#6e675c]">
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Complimentary over INR 1,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Returns</span>
                <span>Within 14 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Authenticity</span>
                <span>100% Guaranteed</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProductDetail
