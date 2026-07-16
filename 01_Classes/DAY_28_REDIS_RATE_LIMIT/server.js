import 'dotenv/config';
import express from "express"
import morgan from 'morgan';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import {userModel} from './models/user.model.js';
import rateLimit from 'express-rate-limit';

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

connectToMongoDB();

const redis = new Redis(process.env.REDIS_URI);

redis.once("ready", () => {
    console.log("Connected to Redis");
});

const app = express();
app.use(morgan('dev'));
app.use(express.json());


const globalRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {error: "Too many requests, please try again later."},
    statusCode: 429,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.get("/users/:id", async (req, res) => {
    try {
        const userFromCache = await redis.get(`user:${req.params.id}`);
        if (userFromCache) {
            return res.json({
                message: "User retrieved from cache",
                data: JSON.parse(userFromCache)
            });
        }

        const user = await userModel.findById(req.params.id);
        await redis.set(`user:${req.params.id}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user); 

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}); 

app.post("/users", async (req, res) => {
    try {
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: "Bad Request" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});