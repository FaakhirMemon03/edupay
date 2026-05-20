import express from "express";
import { loginUser, registerUser, getUserProfile } from "../controllers/authController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", protect, adminOnly, registerUser);
router.get("/profile", protect, getUserProfile);

export default router;
