import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { 
        type: String,
        required: true,
        enum: ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'CNY'],
        default: 'INR'
    }
}, {_id: false, __v: false}, { timestamps: true });

export default priceSchema;