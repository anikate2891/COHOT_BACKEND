import mongoose from "mongoose";
import { config } from "../config/config.js";

function connectToDB() {
    try {
        mongoose.connect(config.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectToDB;