import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useProduct } from '../hook/useProduct.js';
import { useNavigate } from 'react-router-dom';

const inputBase =
    'h-12 w-full rounded-xl border border-[#d7cebf] bg-[#f7f3eb] px-4 text-[#1f1b16] placeholder:text-[#8b8377] outline-none transition focus:border-[#1f1b16] focus:ring-2 focus:ring-[#1f1b16]/10'

const Product = () => {
    const { handelCreateProduct } = useProduct();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'USD',
        images: [],
    });

    const imageCountText = useMemo(() => `${formData.images.length} / 7`, [formData.images.length]);

    useEffect(() => {
        const previews = formData.images.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
        }));
        setImagePreviews(previews);
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [formData.images]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleImageChange(event) {
        const files = Array.from(event.target.files || []);
        if (files.length > 7) {
            setSubmitMessage('Please select up to 7 images only.');
            setSubmitSuccess(false);
            setFormData((prev) => ({ ...prev, images: files.slice(0, 7) }));
            return;
        }
        setSubmitMessage('');
        setFormData((prev) => ({ ...prev, images: files }));
    }

    function handleRemoveImage(removeIndex) {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== removeIndex),
        }));
    }

    function handleClearImages() {
        setFormData((prev) => ({ ...prev, images: [] }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitMessage('');
        setSubmitSuccess(false);

        if (formData.images.length > 7) {
            setSubmitMessage('You can upload a maximum of 7 images.');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = new FormData();
            payload.append('title', formData.title.trim());
            payload.append('description', formData.description.trim());
            payload.append('priceAmount', formData.priceAmount);
            payload.append('priceCurrency', formData.priceCurrency);
            formData.images.forEach((file) => payload.append('image', file));

            await handelCreateProduct(payload);
            setSubmitSuccess(true);
            setSubmitMessage('Product listed successfully.');
            setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'USD', images: [] });
            if (fileInputRef.current) fileInputRef.current.value = '';
            navigate('/');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setSubmitMessage(apiMessage || 'Unable to create product. Please try again.');
            setSubmitSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-dvh bg-[#f4f0e9] p-2 sm:p-4 lg:p-6">
            <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-[#ddd3c4] bg-[#f8f4ec] shadow-[0_24px_60px_-40px_rgba(41,33,21,0.45)]">

                {/* Top bar */}
                <div className="flex items-center gap-4 border-b border-[#e5ddd1] px-6 py-4 sm:px-8 lg:px-10">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-[#6c655a] transition hover:text-[#1f1b16]"
                        aria-label="Go back"
                    >
                        <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
                        Back
                    </button>
                    <span className="text-[#d7cebf]">/</span>
                    <span className="text-sm text-[#8b8377]">New Listing</span>
                </div>

                <div className="md:grid md:grid-cols-[1.05fr_0.95fr]">

                    {/* Left — image panel */}
                    <aside className="relative hidden h-full min-h-[520px] md:block">
                        <img
                            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80"
                            alt="Seller product showcase"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/25 to-black/10" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#f4f0e9]/85">SNITCH Atelier</p>
                            <h1
                                className="mt-3 max-w-md text-3xl leading-tight text-[#f4f0e9] lg:text-4xl"
                                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                            >
                                List Your Piece to the World
                            </h1>
                            <p className="mt-3 max-w-md text-sm leading-6 text-[#f4f0e9]/80">
                                Great listings start with clear details and honest visuals. Help buyers find what they love.
                            </p>
                        </div>
                    </aside>

                    {/* Right — form */}
                    <section className="flex h-full flex-col justify-center p-5 sm:p-7 lg:p-10">
                        <div className="w-full">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#766f63]">Seller Dashboard</p>
                            <h2
                                className="mt-2 text-3xl leading-tight text-[#1f1b16] sm:text-4xl"
                                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                            >
                                Create Product
                            </h2>
                            <p className="mt-2 text-sm text-[#6c655a]">
                                Add clean product details and keep your listing focused.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                                {/* Title */}
                                <label className="block space-y-1.5">
                                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Title</span>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Classic cotton shirt"
                                        className={inputBase}
                                        required
                                    />
                                </label>

                                {/* Description */}
                                <label className="block space-y-1.5">
                                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Description</span>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Soft fabric, regular fit, ideal for everyday wear."
                                        rows={4}
                                        className="w-full rounded-xl border border-[#d7cebf] bg-[#f7f3eb] px-4 py-3 text-[#1f1b16] placeholder:text-[#8b8377] outline-none transition focus:border-[#1f1b16] focus:ring-2 focus:ring-[#1f1b16]/10 resize-none"
                                        required
                                    />
                                </label>

                                {/* Price row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block space-y-1.5">
                                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Amount</span>
                                        <input
                                            type="number"
                                            name="priceAmount"
                                            min="0"
                                            step="0.01"
                                            value={formData.priceAmount}
                                            onChange={handleChange}
                                            placeholder="59.99"
                                            className={inputBase}
                                            required
                                        />
                                    </label>
                                    <label className="block space-y-1.5">
                                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Currency</span>
                                        <select
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleChange}
                                            className={inputBase}
                                            required
                                        >
                                            <option value="INR">INR</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </label>
                                </div>

                                {/* Images */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d665c]">Images</span>
                                        <span className="text-xs text-[#8b8377]">{imageCountText} selected</span>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="block w-full rounded-xl border border-[#d7cebf] bg-[#f7f3eb] px-4 py-3 text-sm text-[#1f1b16] file:mr-4 file:rounded-lg file:border-0 file:bg-[#1f1b16] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.1em] file:text-[#f4f0e9] hover:file:bg-[#3a3328] transition"
                                    />
                                    <p className="text-xs text-[#8b8377]">Up to 7 images. First image becomes the thumbnail.</p>

                                    {/* Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-2">
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b8377]">Preview</p>
                                                <button
                                                    type="button"
                                                    onClick={handleClearImages}
                                                    className="text-xs font-medium text-[#6c655a] underline-offset-2 hover:underline transition"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                            <div className="flex gap-2.5 overflow-x-auto pb-1">
                                                {imagePreviews.map((preview, index) => (
                                                    <div
                                                        key={`${preview.name}-${index}`}
                                                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#d7cebf] bg-[#f0ebe0]"
                                                    >
                                                        <img
                                                            src={preview.url}
                                                            alt={`Selected ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {index === 0 && (
                                                            <span className="absolute bottom-1 left-1 rounded bg-[#1f1b16]/80 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#f4f0e9]">
                                                                Cover
                                                            </span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1f1b16]/80 text-[10px] font-bold text-[#f4f0e9] transition hover:bg-[#1f1b16]"
                                                            aria-label={`Remove image ${index + 1}`}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Feedback message */}
                                {submitMessage && (
                                    <p className={`rounded-xl border px-4 py-2.5 text-sm ${
                                        submitSuccess
                                            ? 'border-green-300 bg-green-50 text-green-700'
                                            : 'border-red-300 bg-red-50 text-red-700'
                                    }`}>
                                        {submitMessage}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-1 inline-flex h-12 w-full items-center justify-center border border-[#1f1b16] bg-[#1f1b16] text-sm font-semibold uppercase tracking-[0.14em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Creating...' : 'List Product'}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Product
