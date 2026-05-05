import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetCartItems, useCart } from "../hook/useCart.js";
import { Link } from "react-router-dom";

const Cart = () => {
    const cartitems = useSelector((state) => state.cart.items);
    const { handleGetCartItems } = useGetCartItems();
    const { handleRemoveItem, handleUpdateQuantity } = useCart();

    useEffect(() => {
        handleGetCartItems();
    }, [handleGetCartItems]);

    const calculateSubtotal = () => {
        return cartitems?.reduce((total, item) => {
            return total + (item.price.amount * item.quantity);
        }, 0) || 0;
    };

    const subtotal = calculateSubtotal();

    const getVariantDetails = (item) => {
        return item.product.variants.find((v) => v._id === item.variant);
    };

    const suggestions = useMemo(() => {
        if (!cartitems?.length) return [];

        const items = [];

        cartitems.forEach((item) => {
            const variant = getVariantDetails(item);
            const variantImages = variant?.images || [];
            const productImages = item.product.images || [];
            const images = [...variantImages, ...productImages];

            images.slice(0, 2).forEach((img, index) => {
                items.push({
                    id: `${item._id}-${index}`,
                    title: item.product.title,
                    imageUrl: img.url,
                    price: item.price,
                });
            });
        });

        return items.slice(0, 3);
    }, [cartitems]);

    return (
        <main className="relative min-h-screen bg-[#f4f0e9] text-[#1f1b16]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#efe7db] blur-3xl" />
                <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-[#f7f3eb] blur-2xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-8 lg:px-12">
                <div className="mb-10 flex items-end justify-between border-b border-[#d7cebf] pb-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6c655a]">Cart</p>
                        <h1
                            className="mt-3 text-4xl sm:text-5xl"
                            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                        >
                            Your Selection
                        </h1>
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#6c655a]">
                        {cartitems?.length || 0} Items
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
                    {/* Left Column: Cart Items */}
                    <section>
                        <div className="space-y-10">
                            {cartitems?.length === 0 ? (
                                <p className="text-[#6c655a]">Your cart is currently empty.</p>
                            ) : (
                                cartitems?.map((item) => {
                                    const variant = getVariantDetails(item);
                                    const imageUrl = variant?.images?.[0]?.url || item.product.images?.[0]?.url;
                                    const size = variant?.attributes?.Size || 'N/A';
                                    const color = variant?.attributes?.color || 'N/A';
                                    const stock = variant?.stock || 0;

                                    return (
                                        <div key={item._id} className="grid grid-cols-[120px_1fr] gap-6 border-b border-[#d7cebf] pb-10 sm:grid-cols-[160px_1fr]">
                                            {/* Product Image */}
                                            <div className="aspect-3/4 bg-[#eae4d9] overflow-hidden">
                                                {imageUrl && (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.product.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex flex-col h-full">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3
                                                            className="text-xl sm:text-2xl"
                                                            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                                                        >
                                                            {item.product.title}
                                                        </h3>
                                                        <div className="mt-4 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6c655a]">
                                                            <span>Size: {size}</span>
                                                            <span>Color: {color}</span>
                                                        </div>
                                                        <div className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#6c655a]">
                                                            {stock} IN STOCK
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        {item.price.currency} {item.price.amount.toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex items-end justify-between pt-6">
                                                    {/* Quantity Control */}
                                                    <div className="flex items-center border border-[#d7cebf] bg-[#f7f3eb]">
                                                        <button
                                                            className="flex h-8 w-8 items-center justify-center transition hover:bg-[#eae4d9]"
                                                            onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="flex h-8 w-8 items-center justify-center transition hover:bg-[#eae4d9]"
                                                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c655a] transition hover:text-[#1f1b16] underline underline-offset-4"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {suggestions.length > 0 && (
                            <div className="mt-16">
                                <p className="text-[11px] uppercase tracking-[0.3em] text-[#6c655a]">
                                    Complete the silhouette
                                </p>
                                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {suggestions.map((item) => (
                                        <div key={item.id} className="bg-[#f7f3eb] border border-[#e1d8c9] p-4">
                                            <div className="aspect-4/5 overflow-hidden bg-[#eae4d9]">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#6c655a]">
                                                        Suggested
                                                    </p>
                                                </div>
                                                <p className="text-xs font-semibold">
                                                    {item.price.currency} {item.price.amount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Right Column: Order Summary */}
                    <section className="lg:pl-8">
                        <div className="sticky top-10 space-y-8 border border-[#e1d8c9] bg-[#f7f3eb] p-6">
                            <h2
                                className="text-2xl"
                                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                            >
                                The Total
                            </h2>

                            <div className="space-y-4 text-xs font-semibold uppercase tracking-widest text-[#1f1b16]">
                                <div className="flex justify-between items-center py-2 border-b border-[#d7cebf]/50">
                                    <span className="text-[#6c655a]">Subtotal</span>
                                    <span>INR {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-[#d7cebf]/50">
                                    <span className="text-[#6c655a]">Shipping</span>
                                    <span className="text-[#6c655a]">Complimentary</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-[#d7cebf]/50">
                                    <span className="text-[#6c655a]">Duties</span>
                                    <span className="text-[#6c655a]">Included</span>
                                </div>
                                <div className="flex justify-between items-center py-6 text-sm">
                                    <span>Total Value</span>
                                    <span className="text-lg">INR {subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <button className="h-12 w-full border border-[#1f1b16] bg-[#1f1b16] text-xs font-semibold uppercase tracking-[0.2em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]">
                                    Proceed to Checkout
                                </button>
                                <Link to="/" className="flex h-12 w-full items-center justify-center border border-[#d7cebf] bg-transparent text-xs font-semibold uppercase tracking-[0.2em] text-[#1f1b16] transition hover:bg-[#eae4d9]">
                                    Continue Shopping
                                </Link>
                            </div>

                            <div className="space-x-4 pt-8 text-center text-[10px] uppercase tracking-[0.2em] text-[#6c655a]">
                                <span>Free Shipping</span>
                                <span>&bull;</span>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Cart;    