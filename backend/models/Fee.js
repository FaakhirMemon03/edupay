import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School"
  },
  month: { type: String, required: true }, // e.g. "May 2026"
  amount: { type: Number, required: true },
  fine: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["paid", "unpaid", "late"],
    default: "unpaid"
  },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("Fee", feeSchema);
