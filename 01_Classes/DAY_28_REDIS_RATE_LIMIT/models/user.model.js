import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        email: String,
    }
});

export const userModel = mongoose.model("Users", userSchema);