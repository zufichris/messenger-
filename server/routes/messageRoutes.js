import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageControllers.js";
const router = express.Router();
router.post("/", authMiddleware, sendMessage);
router.get("/:chatId", authMiddleware, getMessages);
export default router;
