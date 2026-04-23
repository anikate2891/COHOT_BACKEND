import React, { useEffect, useState } from 'react'
import { useProduct } from '../hook/useProduct.js';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashBoard = () => {
    const { handelGetSellerProducts } = useProduct();
    const sellerProducts = useSelector((state) => state.product.sellerProducts);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                await handelGetSellerProducts();
            } catch (error) {
                if (isMounted) {
                    const apiMessage = error?.response?.data?.message;
                    setErrorMessage(apiMessage || 'Unable to fetch products right now.');
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
    }, [handelGetSellerProducts]);

    function formatDate(value) {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    function getDisplayPrice(price) {
        if (!price) return 'N/A';
        const { amount, currency } = price;
        if (amount === undefined || amount === null) return 'N/A';
        return `${currency || 'INR'} ${amount}`;
    }

    return (
        <main className="min-h-screen bg-[#f4f0e9] text-[#1f1b16]">
            <div className="mx-auto grid min-h-screen max-w-350 lg:grid-cols-[230px_1fr]">
                <aside className="border-b border-[#e1d8ca] bg-[#efe8dc] p-6 lg:border-b-0 lg:border-r">
                    <div>
                        <p className="text-lg font-semibold tracking-[0.07em]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                            SNITCH ATELIER
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#686155]">Seller Merchant</p>
                    </div>

                    <nav className="mt-10 space-y-1.5">
                        {['Dashboard', 'Inventory', 'Mail', 'Analytics', 'Settings'].map((item) => (
                            <div
                                key={item}
                                className={`rounded-md px-3 py-2 text-sm ${item === 'Dashboard' ? 'bg-[#1f1b16] text-[#f4f0e9]' : 'text-[#3e382f] hover:bg-[#e4dccf]'}`}
                            >
                                {item}
                            </div>
                        ))}
                    </nav>
                </aside>

                <section className="p-5 sm:p-8 lg:p-10">
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd3c4] pb-6">
                        <div className="flex items-center gap-8">
                            <p className="text-[28px] tracking-[0.12em]" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                                SNITCH.
                            </p>
                            <div className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.14em] text-[#615a4f] md:flex">
                                <span>Collections</span>
                                <span>Archive</span>
                                <span>Atelier</span>
                            </div>
                        </div>

                        <Link
                            to="/seller/create-product"
                            className="inline-flex h-10 items-center justify-center border border-[#1f1b16] bg-[#1f1b16] px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
                        >
                            Create Product
                        </Link>
                    </header>

                    <div className="mt-8">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#7f776b]">Atelier Selections</p>
                        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                            <h1 className="text-5xl leading-none sm:text-6xl" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                                Your Vault
                            </h1>
                            <p className="text-xs uppercase tracking-[0.14em] text-[#6c655b]">
                                {sellerProducts.length} product{sellerProducts.length === 1 ? '' : 's'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-[#ddd3c4] py-3 text-[11px] uppercase tracking-[0.14em] text-[#655f56]">
                        <div className="flex items-center gap-4">
                            <span>Filter</span>
                            <span className="text-[#9b9386]">|</span>
                            <span>Date Added</span>
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

                    {!isLoading && !errorMessage && sellerProducts.length === 0 && (
                        <div className="mt-8 border border-[#d9cebe] bg-[#eee7da] p-5 text-sm text-[#3f3930]">
                            No products found. Start by creating your first product.
                        </div>
                    )}

                    {!isLoading && !errorMessage && sellerProducts.length > 0 && (
                        <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
                            {sellerProducts.map((product) => {
                                const imageUrl = product?.images?.[0]?.url;
                                return (
                                    <article key={product._id} className="space-y-3">
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

                            <Link
                                to="/seller/create-product"
                                className="flex aspect-square items-center justify-center border border-dashed border-[#cabfad] text-xs uppercase tracking-[0.16em] text-[#5e564d] transition hover:bg-[#eee7da]"
                            >
                                + Add New Item
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default DashBoard
