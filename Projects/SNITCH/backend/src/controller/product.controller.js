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