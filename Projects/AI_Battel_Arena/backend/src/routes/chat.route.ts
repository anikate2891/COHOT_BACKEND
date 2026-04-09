import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { saveChat, getChats } from "../controllers/chat.controller.js";

const router = Router();

// 🔹 Save chat (AI response ke baad)
router.post("/", protect, saveChat);

// 🔹 Get last 10 chats
router.get("/", protect, getChats);

export default router;