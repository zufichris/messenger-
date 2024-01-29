import express from "express";
import {
  accessChat,
  updateGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
router
  .route("/")
  .post(authMiddleware, accessChat)
  .get(authMiddleware, fetchChats);
router.post("/create-group-chat", authMiddleware, createGroupChat);
router.route("/rename-group").put(authMiddleware, renameGroup);
router.route("/remove-from-group").put(authMiddleware, removeFromGroup);
router.route("/update-group/:chatId").put(authMiddleware, updateGroup);
export default router;
