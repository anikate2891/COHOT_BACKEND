import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useProduct } from '../hook/useProduct.js';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const { handelCreateProduct } = useProduct();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '', 
        priceAmount: '',
        priceCurrency: 'USD',
        images: [],
    });

    const imageCountText = useMemo(() => `${formData.images.length}/7 selected`, [formData.images.length]);

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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitMessage('');

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

            formData.images.forEach((file) => {
                payload.append('image', file);
            });

            await handelCreateProduct(payload);
            setSubmitMessage('Product created successfully.');
            setFormData({
                title: '',
                description: '',
                priceAmount: '',
                priceCurrency: 'USD',
                images: [],
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            navigate('/');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setSubmitMessage(apiMessage || 'Unable to create product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-black px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <section className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6 shadow-[0_24px_80px_-28px_rgba(250,204,21,0.45)] sm:p-8 lg:p-10">
                    <div className="max-w-4xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">Seller</p>
                        <div className="mt-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="group inline-flex items-center text-3xl font-black leading-none text-yellow-200 transition hover:-translate-x-0.5 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/60"
                                aria-label="Go back"
                            >
                                <span
                                    aria-hidden="true"
                                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                                >
                                    &larr;
                                </span>
                            </button>
                            <h1 className="text-3xl font-semibold tracking-tight text-yellow-50 sm:text-4xl">Create Product</h1>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-yellow-100/75">
                            Add clean product details and keep the listing focused.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                                <div className="space-y-6">
                                    <label className="space-y-2 block">
                                        <span className="text-sm font-medium text-yellow-100">Title</span>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Classic cotton shirt"
                                            className="h-12 w-full rounded-xl border border-yellow-400/35 bg-black/60 px-4 text-yellow-50 placeholder:text-yellow-200/45 outline-none transition focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/20"
                                            required
                                        />
                                    </label>

                                    <label className="space-y-2 block">
                                        <span className="text-sm font-medium text-yellow-100">Description</span>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Soft fabric, regular fit, ideal for everyday wear."
                                            rows={5}
                                            className="w-full rounded-xl border border-yellow-400/35 bg-black/60 px-4 py-3 text-yellow-50 placeholder:text-yellow-200/45 outline-none transition focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/20"
                                            required
                                        />
                                    </label>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <label className="space-y-2 block">
                                            <span className="text-sm font-medium text-yellow-100">Price Amount</span>
                                            <input
                                                type="number"
                                                name="priceAmount"
                                                min="0"
                                                step="0.01"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                placeholder="59.99"
                                                className="h-12 w-full rounded-xl border border-yellow-400/35 bg-black/60 px-4 text-yellow-50 placeholder:text-yellow-200/45 outline-none transition focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/20"
                                                required
                                            />
                                        </label>

                                        <label className="space-y-2 block">
                                            <span className="text-sm font-medium text-yellow-100">Price Currency</span>
                                            <select
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="h-12 w-full rounded-xl border border-yellow-400/35 bg-black/60 px-4 text-yellow-50 outline-none transition focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/20"
                                                required
                                            >
                                                <option value="INR">INR</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <label className="space-y-2 block xl:pl-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-medium text-yellow-100">Images</span>
                                        <span className="text-xs text-yellow-200/70">{imageCountText}</span>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="block w-full rounded-xl border border-yellow-400/35 bg-black/60 px-4 py-3 text-sm text-yellow-100 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-yellow-300"
                                    />
                                    <p className="text-xs text-yellow-200/70">Upload up to 7 images. First image will be used as default thumbnail.</p>

                                    {imagePreviews.length > 0 && (
                                        <div className="mt-3">
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <p className="text-xs font-medium uppercase tracking-[0.14em] text-yellow-300/80">Preview</p>
                                                <button
                                                    type="button"
                                                    onClick={handleClearImages}
                                                    className="rounded-md border border-yellow-400/35 px-2.5 py-1 text-xs font-medium text-yellow-100 transition hover:bg-yellow-400/15"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                {imagePreviews.map((preview, index) => (
                                                    <div
                                                        key={`${preview.name}-${index}`}
                                                        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-yellow-400/25 bg-black/40"
                                                    >
                                                        <img
                                                            src={preview.url}
                                                            alt={`Selected ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-xs font-bold text-yellow-200 ring-1 ring-yellow-300/40 transition hover:bg-yellow-400 hover:text-black"
                                                            aria-label={`Remove image ${index + 1}`}
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>

                        {submitMessage && (
                            <p className="rounded-lg border border-yellow-400/35 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">
                                {submitMessage}
                            </p>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}

export default Product
