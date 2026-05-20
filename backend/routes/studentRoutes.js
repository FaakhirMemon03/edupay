import express from "express";
import { getStudents, addStudent, updateStudent, deleteStudent } from "../controllers/studentController.js";
import { protect, adminOnly, teacherOrAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, teacherOrAdmin, getStudents)
  .post(protect, adminOnly, addStudent);

router.route("/:id")
  .put(protect, adminOnly, updateStudent)
  .delete(protect, adminOnly, deleteStudent);

export default router;
