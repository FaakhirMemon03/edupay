import express from "express";
import { getFees, generateMonthlyFees, markAsPaid, sendReminder } from "../controllers/feeController.js";
import { protect, adminOnly, teacherOrAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getFees);

router.post("/generate", protect, adminOnly, generateMonthlyFees);
router.put("/pay/:id", protect, adminOnly, markAsPaid);
router.post("/reminder/:id", protect, teacherOrAdmin, sendReminder);

export default router;
