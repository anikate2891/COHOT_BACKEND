import 'dotenv/config';
import express from "express"
import morgan from 'morgan';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import {userModel} from './models/user.model.js';

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

app.get("/users/:id", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});