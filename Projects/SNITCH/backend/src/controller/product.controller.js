import productModel from "../model/product.model.js";
import { uploadImageToStorage } from "../services/storage.service.js";

export async function createProductController(req, res) {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    try {
        const images = await Promise.all(
            req.files.map(async (file) => {
                const url = await uploadImageToStorage({
                    buffer: file.buffer,
                    filename: file.originalname,
                    folder: 'products'
                });
                return { url }; // ✅ Object return karo, sirf string nahi
            })
        );

        const product = await productModel.create({
            title,
            description,
            price: { amount: priceAmount, currency: priceCurrency || 'INR' },
            seller: seller._id,
            images, // ✅ Ab [{url: '...'}, {url: '...'}] hoga
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('ProductController - Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
}


export async function getSellerProductsController(req, res) {
    const seller = req.user;

    try {
        const products = await productModel.find({ seller: seller._id });
        res.status(200).json({ message: 'Products fetched successfully', success: true, products });
    } catch (error) {
        console.error('getSellerProductsController:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
}

export async function getAllProductsController(req, res) {
    try {
        const products = await productModel.find();
        res.status(200).json({ message: 'Products fetched successfully', success: true, products });
    } catch (error) {
        console.error('getAllProductsController:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
}

export async function getProductDetailsController(req, res) {
    const { id } = req.params;

    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product details fetched successfully', success: true, product });
    
    } catch (error) {
        console.error('getProductDetailsController:', error);
        res.status(500).json({ message: 'Failed to fetch product details' });
    }
}

export async function addProductVariantController(req, res) {
    try {
        const { productId } = req.params;
        const product = await productModel.findOne({ _id: productId, seller: req.user._id });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const files = req.files;
        const uploadedImages = await Promise.all((files || []).map(async (file) => {
            const image = await uploadImageToStorage({
                buffer: file.buffer,
                filename: file.originalname,
            });
            return { url : image }; // ✅ Object return karo, sirf string nahi
        }));

        const rawPriceAmount = req.body.priceAmount;
        const hasPriceAmount = rawPriceAmount !== undefined && rawPriceAmount !== null && String(rawPriceAmount).trim() !== '';
        const parsedPriceAmount = hasPriceAmount ? Number(rawPriceAmount) : Number(product.price?.amount);

        if (Number.isNaN(parsedPriceAmount) || parsedPriceAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Price amount must be greater than 0 when provided.' });
        }

        const parsedStock = Number(req.body.stock ?? 0);
        if (Number.isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ success: false, message: 'Stock must be a non-negative number.' });
        }

        let parsedAttributes = {};
        try {
            parsedAttributes = JSON.parse(req.body.attributes || '{}');
        } catch {
            return res.status(400).json({ success: false, message: 'Attributes must be valid JSON.' });
        }

        product.variants.push({
            images: uploadedImages,
            stock: parsedStock,
            attributes: parsedAttributes,
            price: {
                amount: parsedPriceAmount,
                currency: hasPriceAmount
                    ? (req.body.priceCurrency || product.price?.currency || 'INR')
                    : (product.price?.currency || 'INR')
            }
        });

        await product.save();
        return res.status(201).json({
            success: true,
            message: 'Variant added successfully',
            variant: product.variants[product.variants.length - 1]
        });
        console.log({ price,currency,stock,attributes,images, });

    } catch (error) {
        console.error('Variant creation error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function updateProductVariantStockController(req, res) {
    try {
        const { productId, variantId } = req.params;
        const { stock } = req.body;

        const parsedStock = Number(stock);
        if (Number.isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ success: false, message: 'Stock must be a non-negative number.' });
        }

        const product = await productModel.findOne({ _id: productId, seller: req.user._id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        variant.stock = parsedStock;
        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Variant stock updated successfully',
            variant,
        });
    } catch (error) {
        console.error('Variant stock update error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteProductVariantController(req, res) {
    try {
        const { productId, variantId } = req.params;

        const product = await productModel.findOne({ _id: productId, seller: req.user._id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        variant.deleteOne();
        await product.save();

        return res.status(200).json({
            success: true,
            message: 'Variant deleted successfully',
            variantId,
        });
    } catch (error) {
        console.error('Variant delete error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
    