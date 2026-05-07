import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useProduct } from '../hook/useProduct'
import { useParams } from 'react-router-dom'
import Loader from '../../auth/components/Loader.jsx';

const baseInput =
    'h-11 w-full rounded-lg border border-[#d7cebf] bg-[#f8f4ec] px-3 text-sm text-[#1f1b16] outline-none transition focus:border-[#1f1b16] focus:ring-2 focus:ring-[#1f1b16]/10';

const colorOptions = ['Black', 'White', 'Brown', 'Beige', 'Blue', 'Green', 'Red', 'Grey', 'Yellow'];

const SellerProductDetails = () => {
    const { productId } = useParams();
    const {
        handelGetProductDetails,
        handelCreateProductVariant,
        handelUpdateProductVariantStock,
        handelUpdateProductVariant,
        handelUpdateProductImages,
        handelDeleteProductVariant,
    } = useProduct();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);
    const [variantImagePreviews, setVariantImagePreviews] = useState([]);
    const [stockDrafts, setStockDrafts] = useState({});
    const [updatingVariantId, setUpdatingVariantId] = useState('');
    const [deletingVariantId, setDeletingVariantId] = useState('');
    const [pendingDeleteVariantId, setPendingDeleteVariantId] = useState('');
    const [isVariantPanelOpen, setIsVariantPanelOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [editingVariantId, setEditingVariantId] = useState('');
    const [editingVariant, setEditingVariant] = useState(null);
    const [isUpdatingVariant, setIsUpdatingVariant] = useState(false);
    const [editVariantImageDrafts, setEditVariantImageDrafts] = useState([]);
    const [isEditingImages, setIsEditingImages] = useState(false);
    const [isUpdatingImages, setIsUpdatingImages] = useState(false);
    const [imageDrafts, setImageDrafts] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [imageFilePreviews, setImageFilePreviews] = useState([]);
    const variantImageInputRef = useRef(null);
    const editImageInputRef = useRef(null);
    const productImageInputRef = useRef(null);

    const [variantForm, setVariantForm] = useState({
        stock: 0,
        priceAmount: '',
        priceCurrency: 'INR',
        color: '',
        colorCustom: '',
        attributes: [{ key: '', value: '' }],
        imageFiles: [],
    });

    const [editVariantForm, setEditVariantForm] = useState({
        stock: 0,
        priceAmount: '',
        priceCurrency: 'INR',
        color: '',
        colorCustom: '',
        attributes: [{ id: crypto.randomUUID(), key: '', value: '' }],
        imageFiles: [],
    });
    const [editImagePreviews, setEditImagePreviews] = useState([]);

    const productImages = useMemo(() => product?.images || [], [product]);
    const selectedImage = productImages[selectedImageIndex]?.url;

    function getDisplayPrice(price) {
        if (!price) return 'N/A';
        if (price?.amount === undefined || price?.amount === null) return 'N/A';
        return `${price.currency || 'INR'} ${price.amount}`;
    }

    function seedStockDrafts(variants = []) {
        const drafts = variants.reduce((acc, variant) => {
            acc[variant._id] = variant.stock ?? 0;
            return acc;
        }, {});
        setStockDrafts(drafts);
    }

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                setIsLoading(true);
                setErrorMessage('');
                const data = await handelGetProductDetails(productId);
                setProduct(data);
                setVariantForm((prev) => ({
                    ...prev,
                    priceCurrency: data?.price?.currency || 'INR',
                    priceAmount: '',
                    color: '',
                    colorCustom: '',
                }));
                seedStockDrafts(data?.variants || []);
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

    useEffect(() => {
        const previews = (variantForm.imageFiles || []).map((file) => ({
            key: `${file.name}-${file.lastModified}`,
            url: URL.createObjectURL(file),
        }));
        setVariantImagePreviews(previews);

        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [variantForm.imageFiles]);

    useEffect(() => {
        const previews = (editVariantForm.imageFiles || []).map((file) => ({
            key: `${file.name}-${file.lastModified}`,
            url: URL.createObjectURL(file),
        }));
        setEditImagePreviews(previews);

        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [editVariantForm.imageFiles]);

    useEffect(() => {
        const previews = (newImageFiles || []).map((file) => ({
            key: `${file.name}-${file.lastModified}`,
            url: URL.createObjectURL(file),
        }));
        setImageFilePreviews(previews);

        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [newImageFiles]);

    function updateAttributeRow(index, field, value) {
        setVariantForm((prev) => {
            const nextAttributes = [...prev.attributes];
            nextAttributes[index] = { ...nextAttributes[index], [field]: value };
            return { ...prev, attributes: nextAttributes };
        });
    }

    function addAttributeRow() {
        setVariantForm((prev) => ({
            ...prev,
            attributes: [...prev.attributes, { key: '', value: '' }],
        }));
    }

    function removeAttributeRow(index) {
        setVariantForm((prev) => {
            if (prev.attributes.length === 1) {
                return { ...prev, attributes: [{ key: '', value: '' }] };
            }
            return {
                ...prev,
                attributes: prev.attributes.filter((_, currentIndex) => currentIndex !== index),
            };
        });
    }

    function updateEditAttributeRow(index, field, value) {
        setEditVariantForm((prev) => {
            const nextAttributes = [...prev.attributes];
            nextAttributes[index] = { ...nextAttributes[index], [field]: value };
            return { ...prev, attributes: nextAttributes };
        });
    }

    function addEditAttributeRow() {
        setEditVariantForm((prev) => ({
            ...prev,
            attributes: [...prev.attributes, { id: crypto.randomUUID(), key: '', value: '' }],
        }));
    }

    function removeEditAttributeRow(index) {
        setEditVariantForm((prev) => {
            if (prev.attributes.length === 1) {
                return { ...prev, attributes: [{ id: crypto.randomUUID(), key: '', value: '' }] };
            }
            return {
                ...prev,
                attributes: prev.attributes.filter((_, currentIndex) => currentIndex !== index),
            };
        });
    }

    function handleVariantImageSelect(event) {
        const incomingFiles = Array.from(event.target.files || []);
        if (incomingFiles.length === 0) return;

        setVariantForm((prev) => {
            const mergedFiles = [...prev.imageFiles, ...incomingFiles].slice(0, 7);
            return { ...prev, imageFiles: mergedFiles };
        });

        if (incomingFiles.length > 7) {
            setSubmitMessage('You can upload up to 7 variant images.');
        }

        if (variantImageInputRef.current) {
            variantImageInputRef.current.value = '';
        }
    }

    function removeVariantImage(index) {
        setVariantForm((prev) => ({
            ...prev,
            imageFiles: prev.imageFiles.filter((_, imageIndex) => imageIndex !== index),
        }));
    }

    function handleEditImageSelect(event) {
        const incomingFiles = Array.from(event.target.files || []);
        if (incomingFiles.length === 0) return;

        setEditVariantForm((prev) => {
            const mergedFiles = [...prev.imageFiles, ...incomingFiles].slice(0, 7);
            return { ...prev, imageFiles: mergedFiles };
        });

        if (incomingFiles.length > 7) {
            setSubmitMessage('You can upload up to 7 variant images.');
        }

        if (editImageInputRef.current) {
            editImageInputRef.current.value = '';
        }
    }

    function removeEditImage(index) {
        setEditVariantForm((prev) => ({
            ...prev,
            imageFiles: prev.imageFiles.filter((_, imageIndex) => imageIndex !== index),
        }));
    }

    function openEditVariant(variant) {
        const entries = Object.entries(variant.attributes || {});
        let colorValue = '';
        const attributeRows = [];

        entries.forEach(([key, value]) => {
            if (key.toLowerCase() === 'color') {
                colorValue = value;
                return;
            }
            attributeRows.push({ id: crypto.randomUUID(), key, value });
        });

        if (attributeRows.length === 0) {
            attributeRows.push({ id: crypto.randomUUID(), key: '', value: '' });
        }

        const isListedColor = colorOptions.includes(colorValue);

        setEditVariantForm({
            stock: variant.stock ?? 0,
            priceAmount: variant.price?.amount ?? '',
            priceCurrency: variant.price?.currency || 'INR',
            color: colorValue ? (isListedColor ? colorValue : 'Other') : '',
            colorCustom: colorValue && !isListedColor ? colorValue : '',
            attributes: attributeRows,
            imageFiles: [],
        });
        setEditVariantImageDrafts((variant.images || []).map((image) => ({
            id: image._id || crypto.randomUUID(),
            url: image.url,
        })));
        setEditingVariantId(variant._id);
        setEditingVariant(variant);
        setSubmitMessage('');
    }

    function closeEditVariant() {
        setEditingVariantId('');
        setEditingVariant(null);
        setEditVariantImageDrafts([]);
        setEditVariantForm({
            stock: 0,
            priceAmount: '',
            priceCurrency: product?.price?.currency || 'INR',
            color: '',
            colorCustom: '',
            attributes: [{ id: crypto.randomUUID(), key: '', value: '' }],
            imageFiles: [],
        });
        if (editImageInputRef.current) {
            editImageInputRef.current.value = '';
        }
    }

    function removeEditVariantDraftImage(id) {
        setEditVariantImageDrafts((prev) => prev.filter((image) => image.id !== id));
    }

    function openImageEditor() {
        setImageDrafts(productImages.map((image) => ({ id: image._id || crypto.randomUUID(), url: image.url })));
        setNewImageFiles([]);
        setIsEditingImages(true);
        setSubmitMessage('');
    }

    function closeImageEditor() {
        setIsEditingImages(false);
        setImageDrafts([]);
        setNewImageFiles([]);
        if (productImageInputRef.current) {
            productImageInputRef.current.value = '';
        }
    }

    function removeDraftImage(id) {
        setImageDrafts((prev) => prev.filter((image) => image.id !== id));
    }

    function handleProductImageSelect(event) {
        const incomingFiles = Array.from(event.target.files || []);
        if (incomingFiles.length === 0) return;

        setNewImageFiles((prev) => [...prev, ...incomingFiles].slice(0, 7));

        if (productImageInputRef.current) {
            productImageInputRef.current.value = '';
        }
    }

    function removeNewImage(index) {
        setNewImageFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    }

    async function handleCreateVariant(event) {
        event.preventDefault();
        setSubmitMessage('');

        const normalizedAttributes = variantForm.attributes.reduce((acc, entry) => {
            const key = entry.key.trim();
            const value = entry.value.trim();
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});

        const colorValue = variantForm.color === 'Other'
            ? variantForm.colorCustom.trim()
            : variantForm.color.trim();

        if (colorValue) {
            normalizedAttributes.color = colorValue;
        }

        if (Object.keys(normalizedAttributes).length === 0) {
            setSubmitMessage('Please add at least one attribute (example: size = M).');
            return;
        }

        try {
            setIsSubmittingVariant(true);
            const payload = new FormData();
            payload.append('stock', String(variantForm.stock || 0));
            payload.append('priceCurrency', variantForm.priceCurrency);
            payload.append('attributes', JSON.stringify(normalizedAttributes));

            if (String(variantForm.priceAmount).trim() !== '') {
                payload.append('priceAmount', String(variantForm.priceAmount));
            }

            variantForm.imageFiles.forEach((file) => payload.append('image', file));

            const createdVariant = await handelCreateProductVariant(productId, payload);
            console.log('Created variant:', createdVariant);
            setProduct((prev) => ({
                ...prev,
                variants: [...(prev?.variants || []), createdVariant],
            }));
            setStockDrafts((prev) => ({ ...prev, [createdVariant._id]: createdVariant.stock ?? 0 }));

            setVariantForm({
                stock: 0,
                priceAmount: '',
                priceCurrency: product?.price?.currency || 'INR',
                color: '',
                colorCustom: '',
                attributes: [{ key: '', value: '' }],
                imageFiles: [],
            });
            setIsVariantPanelOpen(false);
            setSubmitMessage('Variant created successfully.');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setSubmitMessage(apiMessage || 'Unable to create variant.');
        } finally {
            setIsSubmittingVariant(false);
        }
    }

    async function handleUpdateStock(variantId) {
        try {
            setUpdatingVariantId(variantId);
            const updatedVariant = await handelUpdateProductVariantStock(
                productId,
                variantId,
                Number(stockDrafts[variantId] || 0)
            );

            setProduct((prev) => ({
                ...prev,
                variants: (prev?.variants || []).map((variant) =>
                    variant._id === variantId ? { ...variant, stock: updatedVariant.stock } : variant
                ),
            }));
            setSubmitMessage('Variant stock updated.');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setSubmitMessage(apiMessage || 'Unable to update stock.');
        } finally {
            setUpdatingVariantId('');
        }
    }

    async function handleDeleteVariant(variantId) {
        setPendingDeleteVariantId(variantId);
    }

    async function confirmDeleteVariant() {
        if (!pendingDeleteVariantId) return;

        try {
            setDeletingVariantId(pendingDeleteVariantId);
            await handelDeleteProductVariant(productId, pendingDeleteVariantId);

            setProduct((prev) => ({
                ...prev,
                variants: (prev?.variants || []).filter((variant) => variant._id !== pendingDeleteVariantId),
            }));

            setStockDrafts((prev) => {
                const next = { ...prev };
                delete next[pendingDeleteVariantId];
                return next;
            });

            setSubmitMessage('Variant deleted successfully.');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setSubmitMessage(apiMessage || 'Unable to delete variant.');
        } finally {
            setPendingDeleteVariantId('');
            setDeletingVariantId('');
        }
    }

    async function handleUpdateVariant(event) {
        event.preventDefault();
        setSubmitMessage('');

        const totalImages = editVariantImageDrafts.length + editVariantForm.imageFiles.length;
        if (totalImages === 0) {
            setSubmitMessage('Please keep or upload at least one image.');
            return;
        }

        if (totalImages > 7) {
            setSubmitMessage('You can upload a maximum of 7 images.');
            return;
        }

        const normalizedAttributes = editVariantForm.attributes.reduce((acc, entry) => {
            const key = entry.key.trim();
            const value = entry.value.trim();
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});

        const colorValue = editVariantForm.color === 'Other'
            ? editVariantForm.colorCustom.trim()
            : editVariantForm.color.trim();

        if (colorValue) {
            normalizedAttributes.color = colorValue;
        }

        try {
            setIsUpdatingVariant(true);
            const payload = new FormData();
            payload.append('stock', String(editVariantForm.stock ?? 0));
            payload.append('priceCurrency', editVariantForm.priceCurrency);
            payload.append('attributes', JSON.stringify(normalizedAttributes));
            payload.append('existingImages', JSON.stringify(editVariantImageDrafts.map((image) => ({ url: image.url }))));

            if (String(editVariantForm.priceAmount).trim() !== '') {
                payload.append('priceAmount', String(editVariantForm.priceAmount));
            }

            editVariantForm.imageFiles.forEach((file) => payload.append('image', file));

            const updatedVariant = await handelUpdateProductVariant(productId, editingVariantId, payload);

            setProduct((prev) => ({
                ...prev,
                variants: (prev?.variants || []).map((variant) =>
                    variant._id === updatedVariant._id ? updatedVariant : variant
                ),
            }));

            closeEditVariant();
            setSubmitMessage('Variant updated successfully.');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setSubmitMessage(apiMessage || 'Unable to update variant.');
        } finally {
            setIsUpdatingVariant(false);
        }
    }

    async function handleUpdateImages(event) {
        event.preventDefault();
        setSubmitMessage('');

        const totalImages = imageDrafts.length + newImageFiles.length;
        if (totalImages === 0) {
            setSubmitMessage('Please keep or upload at least one image.');
            return;
        }

        if (totalImages > 7) {
            setSubmitMessage('You can upload a maximum of 7 images.');
            return;
        }

        try {
            setIsUpdatingImages(true);
            const payload = new FormData();
            payload.append('existingImages', JSON.stringify(imageDrafts.map((image) => ({ url: image.url }))));
            newImageFiles.forEach((file) => payload.append('image', file));

            const updatedImages = await handelUpdateProductImages(productId, payload);
            setProduct((prev) => ({
                ...prev,
                images: updatedImages,
            }));
            setSelectedImageIndex(0);
            closeImageEditor();
            setSubmitMessage('Product images updated successfully.');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setSubmitMessage(apiMessage || 'Unable to update product images.');
        } finally {
            setIsUpdatingImages(false);
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#f4f0e9] p-5 text-[#1f1b16] sm:p-8 lg:p-10">
                <div className="mx-auto max-w-6xl border border-[#ddd3c4] bg-[#f8f4ec] p-6">
                    <Loader />
                </div>
            </main>
        );
    }

    if (errorMessage || !product) {
        return (
            <main className="min-h-screen bg-[#f4f0e9] p-5 text-[#1f1b16] sm:p-8 lg:p-10">
                <div className="mx-auto max-w-6xl border border-red-300 bg-red-100 p-6 text-sm text-red-700">
                    {errorMessage || 'Product not found.'}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f4f0e9] px-4 py-5 text-[#1f1b16] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-6xl space-y-9">
                <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div className="space-y-4">
                        <div className="overflow-hidden border border-[#ddd3c4] bg-[#e5dacb]">
                            {selectedImage ? (
                                <img src={selectedImage} alt={product.title} className="aspect-4/5 w-full object-cover" />
                            ) : (
                                <div className="flex aspect-4/5 items-center justify-center text-xs uppercase tracking-[0.14em] text-[#6f685d]">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {(productImages.length ? productImages : [{ url: '' }]).map((image, index) => (
                                <button
                                    key={image._id || index}
                                    type="button"
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`h-16 w-16 overflow-hidden border transition ${
                                        selectedImageIndex === index ? 'border-[#1f1b16]' : 'border-[#d7cebf] opacity-55 hover:opacity-90'
                                    }`}
                                >
                                    {image.url ? (
                                        <img
                                            src={image.url}
                                            alt={`${product.title} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[10px] uppercase text-[#6f685d]">No image</span>
                                    )}
                                </button>
                            ))}
                        </div>

                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl leading-tight sm:text-5xl" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                            {product.title}
                        </h1>
                        <button
                            type="button"
                            onClick={openImageEditor}
                            className="inline-flex h-9 items-center justify-center border border-[#1f1b16] bg-[#1f1b16] px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
                        >
                            Update Images
                        </button>
                        <p className="text-sm text-[#4b4438]">{product.description}</p>
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4f493f]">
                            Base Price: {getDisplayPrice(product.price)}
                        </p>
                        <div className="rounded-xl border border-[#ddd3c4] bg-[#f8f4ec] p-4 sm:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-2xl" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                                    Variants & Inventory
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setIsVariantPanelOpen((prev) => !prev)}
                                    className="inline-flex h-9 items-center justify-center border border-[#1f1b16] bg-[#1f1b16] px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16]"
                                >
                                    {isVariantPanelOpen ? 'Close Create Panel' : '+ Add Variant'}
                                </button>
                            </div>

                            {submitMessage && (
                                <p className="mt-3 border border-[#d7cebf] bg-[#f0e8da] px-3 py-2 text-sm text-[#4f493f]">
                                    {submitMessage}
                                </p>
                            )}

                            {isVariantPanelOpen && (
                                <form onSubmit={handleCreateVariant} className="mt-4 space-y-4 border-t border-[#ddd3c4] pt-4">
                                    <div className="grid gap-5 lg:grid-cols-2">
                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Color</span>
                                                <select
                                                    value={variantForm.color}
                                                    onChange={(event) =>
                                                        setVariantForm((prev) => ({
                                                            ...prev,
                                                            color: event.target.value,
                                                            colorCustom: event.target.value === 'Other' ? prev.colorCustom : '',
                                                        }))
                                                    }
                                                    className={baseInput}
                                                >
                                                    <option value="">Select color</option>
                                                    <option value="Black">Black</option>
                                                    <option value="White">White</option>
                                                    <option value="Brown">Brown</option>
                                                    <option value="Beige">Beige</option>
                                                    <option value="Blue">Blue</option>
                                                    <option value="Green">Green</option>
                                                    <option value="Red">Red</option>
                                                    <option value="Grey">Grey</option>
                                                    <option value="Yellow">Yellow</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {variantForm.color === 'Other' && (
                                                    <input
                                                        type="text"
                                                        value={variantForm.colorCustom}
                                                        onChange={(event) => setVariantForm((prev) => ({ ...prev, colorCustom: event.target.value }))}
                                                        placeholder="Enter custom color"
                                                        className={baseInput}
                                                    />
                                                )}
                                                <p className="text-[11px] text-[#8d8477]">Stored in variant attributes as <span className="font-semibold">color</span>.</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Attributes</p>
                                                <button
                                                    type="button"
                                                    onClick={addAttributeRow}
                                                    className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5e564a] transition hover:text-[#1f1b16]"
                                                >
                                                    + Add Attribute
                                                </button>
                                            </div>

                                            {variantForm.attributes.map((attribute, index) => (
                                                <div key={`attribute-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Key (size)"
                                                        value={attribute.key}
                                                        onChange={(event) => updateAttributeRow(index, 'key', event.target.value)}
                                                        className={baseInput}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Value (M)"
                                                        value={attribute.value}
                                                        onChange={(event) => updateAttributeRow(index, 'value', event.target.value)}
                                                        className={baseInput}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttributeRow(index)}
                                                        className="h-11 rounded-lg border border-[#d7cebf] px-3 text-xs uppercase tracking-[0.14em] text-[#6f685d] transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Variant Images</p>
                                                    <p className="text-[11px] text-[#8d8477]">{variantForm.imageFiles.length}/7</p>
                                                </div>
                                                <input
                                                    ref={variantImageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleVariantImageSelect}
                                                    className="block w-full rounded-lg border border-[#d7cebf] bg-[#f8f4ec] px-3 py-2.5 text-sm text-[#1f1b16] file:mr-3 file:rounded-md file:border-0 file:bg-[#1f1b16] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-[#f4f0e9]"
                                                />
                                                <p className="text-xs text-[#8d8477]">Upload up to 7 images for this variant.</p>

                                                {variantImagePreviews.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {variantImagePreviews.map((preview, index) => (
                                                            <div key={preview.key} className="relative">
                                                                <img
                                                                    src={preview.url}
                                                                    alt={`Variant upload ${index + 1}`}
                                                                    className="h-14 w-14 rounded-md border border-[#d7cebf] object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeVariantImage(index)}
                                                                    className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1f1b16] text-[10px] text-[#f4f0e9]"
                                                                >
                                                                    x
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <label className="space-y-1.5">
                                            <span className="text-xs uppercase tracking-[0.14em] text-[#6f685d]">Initial Stock</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={variantForm.stock}
                                                onChange={(event) => setVariantForm((prev) => ({ ...prev, stock: event.target.value }))}
                                                className={baseInput}
                                                required
                                            />
                                        </label>
                                        <label className="space-y-1.5">
                                            <span className="text-xs uppercase tracking-[0.14em] text-[#6f685d]">Price Amount</span>
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Optional"
                                                value={variantForm.priceAmount}
                                                onChange={(event) => setVariantForm((prev) => ({ ...prev, priceAmount: event.target.value }))}
                                                className={baseInput}
                                            />
                                        </label>
                                        <label className="space-y-1.5">
                                            <span className="text-xs uppercase tracking-[0.14em] text-[#6f685d]">Currency</span>
                                            <select
                                                value={variantForm.priceCurrency}
                                                onChange={(event) => setVariantForm((prev) => ({ ...prev, priceCurrency: event.target.value }))}
                                                className={baseInput}
                                                required
                                            >
                                                <option value="INR">INR</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                                <option value="JPY">JPY</option>
                                                <option value="CNY">CNY</option>
                                            </select>
                                        </label>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-xs text-[#6f685d]">Create attribute combinations like color, size, fit and manage stock per variant.</p>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingVariant}
                                            className="inline-flex h-11 items-center justify-center border border-[#1f1b16] bg-[#1f1b16] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {isSubmittingVariant ? 'Saving...' : 'Save Variant'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="space-y-3">
                            {(product.variants || []).length === 0 && (
                                <p className="rounded-xl border border-[#ddd3c4] bg-[#f8f4ec] px-4 py-4 text-sm text-[#6f685d]">
                                    No variants have been created yet.
                                </p>
                            )}

                            {(product.variants || []).map((variant, index) => (
                                <article key={variant._id} className="rounded-xl border border-[#ddd3c4] bg-[#f8f4ec] p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-[0.14em] text-[#7b7368]">Variant {index + 1}</p>
                                            <p className="text-sm font-semibold text-[#4b4438]">{getDisplayPrice(variant.price)}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(variant.attributes || {}).map(([key, value]) => (
                                                <span
                                                    key={`${variant._id}-${key}`}
                                                    className="rounded-full border border-[#d7cebf] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[#5f584d]"
                                                >
                                                    {key}: {value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-end gap-2.5">
                                        <label className="w-full max-w-44 space-y-1.5">
                                            <span className="text-xs uppercase tracking-[0.12em] text-[#6f685d]">Stock</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={stockDrafts[variant._id] ?? variant.stock ?? 0}
                                                onChange={(event) =>
                                                    setStockDrafts((prev) => ({
                                                        ...prev,
                                                        [variant._id]: event.target.value,
                                                    }))
                                                }
                                                className={baseInput}
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => handleUpdateStock(variant._id)}
                                            disabled={updatingVariantId === variant._id}
                                            aria-label="Update stock"
                                            title="Update stock"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#1f1b16] bg-[#1f1b16] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {updatingVariantId === variant._id ? (
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#f4f0e9] border-t-transparent" />
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                                    <path d="M21 3v6h-6" />
                                                </svg>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openEditVariant(variant)}
                                            aria-label="Edit variant"
                                            title="Edit variant"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#1f1b16] text-[#1f1b16] transition hover:bg-[#1f1b16] hover:text-[#f4f0e9]"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVariant(variant._id)}
                                            disabled={deletingVariantId === variant._id}
                                            aria-label="Delete variant"
                                            title="Delete variant"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-700 bg-red-700 text-[#f4f0e9] transition hover:bg-transparent hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {deletingVariantId === variant._id ? (
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#f4f0e9] border-t-transparent" />
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M3 6h18" />
                                                    <path d="M8 6V4h8v2" />
                                                    <path d="M19 6l-1 14H6L5 6" />
                                                    <path d="M10 11v6" />
                                                    <path d="M14 11v6" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {variant.images?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {variant.images.slice(0, 5).map((image, imageIndex) => (
                                                <img
                                                    key={`${variant._id}-img-${imageIndex}`}
                                                    src={image.url}
                                                    alt={`Variant ${index + 1} image ${imageIndex + 1}`}
                                                    className="h-14 w-14 rounded-md border border-[#d7cebf] object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {editingVariantId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-[#d7cebf] bg-[#f8f4ec] p-5 shadow-xl">
                        <h3 className="text-lg font-semibold" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                            Update Variant
                        </h3>
                        <p className="mt-2 text-sm text-[#5f584d]">
                            Update variant attributes, pricing, stock, and images. Uploading images replaces existing ones.
                        </p>

                        <form onSubmit={handleUpdateVariant} className="mt-4 space-y-4">
                            <div className="grid gap-5 lg:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Color</span>
                                        <select
                                            value={editVariantForm.color}
                                            onChange={(event) =>
                                                setEditVariantForm((prev) => ({
                                                    ...prev,
                                                    color: event.target.value,
                                                    colorCustom: event.target.value === 'Other' ? prev.colorCustom : '',
                                                }))
                                            }
                                            className={baseInput}
                                        >
                                            <option value="">Select color</option>
                                            {colorOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                            <option value="Other">Other</option>
                                        </select>
                                        {editVariantForm.color === 'Other' && (
                                            <input
                                                type="text"
                                                value={editVariantForm.colorCustom}
                                                onChange={(event) => setEditVariantForm((prev) => ({ ...prev, colorCustom: event.target.value }))}
                                                placeholder="Enter custom color"
                                                className={baseInput}
                                            />
                                        )}
                                        <p className="text-[11px] text-[#8d8477]">Stored in variant attributes as <span className="font-semibold">color</span>.</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Attributes</p>
                                        <button
                                            type="button"
                                            onClick={addEditAttributeRow}
                                            className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5e564a] transition hover:text-[#1f1b16]"
                                        >
                                            + Add Attribute
                                        </button>
                                    </div>

                                    {editVariantForm.attributes.map((attribute, index) => (
                                        <div key={attribute.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                                            <input
                                                type="text"
                                                placeholder="Key (size)"
                                                value={attribute.key}
                                                onChange={(event) => updateEditAttributeRow(index, 'key', event.target.value)}
                                                className={baseInput}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value (M)"
                                                value={attribute.value}
                                                onChange={(event) => updateEditAttributeRow(index, 'value', event.target.value)}
                                                className={baseInput}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeEditAttributeRow(index)}
                                                className="h-11 rounded-lg border border-[#d7cebf] px-3 text-xs uppercase tracking-[0.14em] text-[#6f685d] transition hover:border-[#1f1b16] hover:text-[#1f1b16]"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Variant Images</p>
                                            <p className="text-[11px] text-[#8d8477]">{editVariantForm.imageFiles.length}/7</p>
                                        </div>
                                        <input
                                            ref={editImageInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleEditImageSelect}
                                            className="block w-full rounded-lg border border-[#d7cebf] bg-[#f8f4ec] px-3 py-2.5 text-sm text-[#1f1b16] file:mr-3 file:rounded-md file:border-0 file:bg-[#1f1b16] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-[#f4f0e9]"
                                        />
                                        <p className="text-xs text-[#8d8477]">Upload new images to replace the current set.</p>

                                        {editVariantImageDrafts.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {editVariantImageDrafts.map((image, index) => (
                                                    <div key={image.id} className="relative">
                                                        <img
                                                            src={image.url}
                                                            alt={`Existing variant ${index + 1}`}
                                                            className="h-12 w-12 rounded-md border border-[#d7cebf] object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEditVariantDraftImage(image.id)}
                                                            className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1f1b16] text-[10px] text-[#f4f0e9]"
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {editImagePreviews.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {editImagePreviews.map((preview, index) => (
                                                    <div key={preview.key} className="relative">
                                                        <img
                                                            src={preview.url}
                                                            alt={`New variant upload ${index + 1}`}
                                                            className="h-12 w-12 rounded-md border border-[#d7cebf] object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEditImage(index)}
                                                            className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1f1b16] text-[10px] text-[#f4f0e9]"
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <label className="space-y-1.5">
                                    <span className="text-xs uppercase tracking-[0.14em] text-[#6f685d]">Stock</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editVariantForm.stock}
                                        onChange={(event) => setEditVariantForm((prev) => ({ ...prev, stock: event.target.value }))}
                                        className={baseInput}
                                        required
                                    />
                                </label>
                                <label className="space-y-1.5">
                                    <span className="text-xs uppercase tracking-[0.14em] text-[#6f685d]">Price Amount</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Optional"
                                        value={editVariantForm.priceAmount}
                                        onChange={(event) => setEditVariantForm((prev) => ({ ...prev, priceAmount: event.target.value }))}
                                        className={baseInput}
                                    />
                                </label>
                                <label className="space-y-1.5">
                                    <span className="text-xs uppercase tracking-[0.14em] text-[#6f685d]">Currency</span>
                                    <select
                                        value={editVariantForm.priceCurrency}
                                        onChange={(event) => setEditVariantForm((prev) => ({ ...prev, priceCurrency: event.target.value }))}
                                        className={baseInput}
                                        required
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="JPY">JPY</option>
                                        <option value="CNY">CNY</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeEditVariant}
                                    disabled={isUpdatingVariant}
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-[#c8bdaa] px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#5f584d] transition hover:border-[#1f1b16] hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingVariant}
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-[#1f1b16] bg-[#1f1b16] px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isUpdatingVariant ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditingImages && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-[#d7cebf] bg-[#f8f4ec] p-5 shadow-xl">
                        <h3 className="text-lg font-semibold" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                            Update Product Images
                        </h3>
                        <p className="mt-2 text-sm text-[#5f584d]">
                            Keep, remove, or add images. Total images must be between 1 and 7.
                        </p>

                        <form onSubmit={handleUpdateImages} className="mt-4 space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Current Images</p>
                                {imageDrafts.length === 0 && (
                                    <p className="mt-2 text-sm text-[#8d8477]">No current images selected.</p>
                                )}
                                {imageDrafts.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {imageDrafts.map((image) => (
                                            <div key={image.id} className="relative">
                                                <img
                                                    src={image.url}
                                                    alt="Product"
                                                    className="h-16 w-16 rounded-md border border-[#d7cebf] object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeDraftImage(image.id)}
                                                    className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1f1b16] text-[10px] text-[#f4f0e9]"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f685d]">Add New Images</p>
                                    <p className="text-[11px] text-[#8d8477]">{newImageFiles.length}/7</p>
                                </div>
                                <input
                                    ref={productImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleProductImageSelect}
                                    className="block w-full rounded-lg border border-[#d7cebf] bg-[#f8f4ec] px-3 py-2.5 text-sm text-[#1f1b16] file:mr-3 file:rounded-md file:border-0 file:bg-[#1f1b16] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-widest file:text-[#f4f0e9]"
                                />
                                <p className="text-xs text-[#8d8477]">Uploads are added to the remaining list.</p>

                                {imageFilePreviews.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {imageFilePreviews.map((preview, index) => (
                                            <div key={preview.key} className="relative">
                                                <img
                                                    src={preview.url}
                                                    alt={`New product ${index + 1}`}
                                                    className="h-16 w-16 rounded-md border border-[#d7cebf] object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1f1b16] text-[10px] text-[#f4f0e9]"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeImageEditor}
                                    disabled={isUpdatingImages}
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-[#c8bdaa] px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#5f584d] transition hover:border-[#1f1b16] hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingImages}
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-[#1f1b16] bg-[#1f1b16] px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f0e9] transition hover:bg-transparent hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isUpdatingImages ? 'Saving...' : 'Save Images'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {pendingDeleteVariantId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-[#d7cebf] bg-[#f8f4ec] p-5 shadow-xl">
                        <h3 className="text-lg font-semibold" style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
                            Delete Variant
                        </h3>
                        <p className="mt-2 text-sm text-[#5f584d]">
                            Are you sure you want to delete this variant? This action cannot be undone.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPendingDeleteVariantId('')}
                                disabled={Boolean(deletingVariantId)}
                                className="inline-flex h-9 items-center justify-center rounded-md border border-[#c8bdaa] px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#5f584d] transition hover:border-[#1f1b16] hover:text-[#1f1b16] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteVariant}
                                disabled={Boolean(deletingVariantId)}
                                className="inline-flex h-9 items-center justify-center rounded-md border border-red-700 bg-red-700 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#f4f0e9] transition hover:bg-transparent hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deletingVariantId ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default SellerProductDetails
