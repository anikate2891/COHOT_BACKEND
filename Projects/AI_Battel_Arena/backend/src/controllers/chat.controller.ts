import Chat from "../models/chatModel.js";
import type { Request, Response } from "express";

// 🔹 Save Chat
export const saveChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { problem, solution_1, solution_2, judge } = req.body;

        await Chat.create({
        userId,
        problem,
        solution_1,
        solution_2,
        judge,
        });

        // 👉 keep only last 10 chats
        const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

        if (chats.length > 10) {
        const idsToDelete = chats.slice(10).map(c => c._id);
        await Chat.deleteMany({ _id: { $in: idsToDelete } });
        }

        return res.status(201).json({ message: "Chat saved" });
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Get Chats (last 10)
export const getChats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const chats = await Chat.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

        return res.json(chats);
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};