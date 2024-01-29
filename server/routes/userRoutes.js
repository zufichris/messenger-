import express from "express";
import { mediaUpload } from "../multer.js";
import {
  channgeBackground,
  getAllUsers,
  logUser,
  register,
} from "../controllers/userControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.route("/").post(mediaUpload.single("avatar"), register).get(getAllUsers);
router.post("/login", logUser);
router.post(
  "/change-background",

  authMiddleware,
  mediaUpload.single("background"),
  channgeBackground
);
export default router;
