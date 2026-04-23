import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct.js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Home = () => {
        const navigate = useNavigate();

    const allProducts = useSelector((state) => state.product.allProducts);
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const { handelGetAllProducts } = useProduct();

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                await handelGetAllProducts();
            } catch (error) {
                if (isMounted) {
                    const apiMessage = error?.response?.data?.message;
                    setErrorMessage(apiMessage || 'Unable to load products right now.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProducts();
        return () => {
            isMounted = false;
        };
    }, [handelGetAllProducts]);

    function getDisplayPrice(price) {
        if (!price) return 'N/A';
        const { amount, currency } = price;
        if (amount === undefined || amount === null) return 'N/A';
        return `${currency || 'INR'} ${amount}`;
    }

    function formatDate(value) {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    return (
        <main className="min-h-screen bg-[#f4f0e9] text-[#1f1b16]">
            <div className="mx-auto max-w-350 px-5 py-8 sm:px-8 lg:px-10">
                <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd3c4] pb-6">
                    <div className="flex items-center gap-8">
                        <p className="text-[28px] tracking-[0.12em]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                            SNITCH.
                        </p>
                        <div className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.14em] text-[#615a4f] md:flex">
                            <span>Collections</span>
                            <span>New Arrivals</span>
                            <span>Atelier</span>
                        </div>
                    </div>

                    {!authLoading && !user && (
                        <Link
                            to="/login"
                            className="inline-flex h-10 items-center justify-center border border-[#1f1b16] px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f1b16] transition hover:bg-[#1f1b16] hover:text-[#f4f0e9]"
                        >
                            Login
                        </Link>
                    )}

                    {!authLoading && user && (
                        <div className="inline-flex h-10 items-center justify-center border border-[#cfc4b4] bg-[#eee7da] px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3b352d]">
                            {user.fullname || user.email}
                        </div>
                    )}
                </header>

                <section className="mt-8">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7f776b]">Atelier Selections</p>
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <h1 className="text-5xl leading-none sm:text-6xl" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                            All Products
                        </h1>
                        <p className="text-xs uppercase tracking-[0.14em] text-[#6c655b]">
                            {allProducts.length} item{allProducts.length === 1 ? '' : 's'}
                        </p>
                    </div>
                </section>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-[#ddd3c4] py-3 text-[11px] uppercase tracking-[0.14em] text-[#655f56]">
                    <div className="flex items-center gap-4">
                        <span>Storefront</span>
                        <span className="text-[#9b9386]">|</span>
                        <span>Latest Products</span>
                    </div>
                    <span>Showing all products</span>
                </div>

                {isLoading && (
                    <div className="mt-8 border border-[#d9cebe] bg-[#eee7da] p-5 text-sm text-[#3f3930]">
                        Loading products...
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="mt-8 border border-red-300 bg-red-100 p-5 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !errorMessage && allProducts.length === 0 && (
                    <div className="mt-8 border border-[#d9cebe] bg-[#eee7da] p-5 text-sm text-[#3f3930]">
                        No products found yet.
                    </div>
                )}

                {!isLoading && !errorMessage && allProducts.length > 0 && (
                    <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {allProducts.map((product) => {
                            const imageUrl = product?.images?.[0]?.url;
                            return (
                                <article
                                onClick={() => navigate(`/product/${product._id}`)}
                                key={product._id} className="space-y-3">
                                    <div className="aspect-square overflow-hidden bg-[#dbd1c3]">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={product.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.14em] text-[#5f584d]">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <h2 className="line-clamp-2 text-[20px] leading-tight" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                                            {product.title || 'Untitled Product'}
                                        </h2>
                                        <p className="line-clamp-1 text-xs text-[#6f685d]">
                                            {product.description || 'No description'}
                                        </p>
                                        <div className="flex items-center justify-between pt-1">
                                            <p className="text-sm">{getDisplayPrice(product.price)}</p>
                                            <p className="text-[11px] uppercase tracking-[0.08em] text-[#7c7469]">
                                                {formatDate(product.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main> 
    )
}

export default Home
