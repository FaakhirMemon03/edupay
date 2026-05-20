import express from "express";
import { getDashboardStats, getDetailedReport } from "../controllers/reportController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);
router.get("/summary", protect, adminOnly, getDetailedReport);

export default router;
