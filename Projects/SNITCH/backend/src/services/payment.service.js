import razorpay from 'razorpay';
import {config} from '../config/config.js';

const razorpayInstance = new razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (amount, currency = 'INR') => {
    try {
        const options = {
            amount: amount * 100, // Convert to paise
            currency,
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpayInstance.orders.create(options);
        return order;

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw new Error('Payment Failed to create order');
    }
};