import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import Notification from "../models/Notification.js";

// Helper to update late fees dynamically
const checkAndSetLateFees = async (schoolId) => {
  const today = new Date();
  const unpaidFees = await Fee.find({
    schoolId,
    status: "unpaid",
    dueDate: { $lt: today }
  });

  for (let fee of unpaidFees) {
    fee.status = "late";
    fee.fine = 100; // Rs. 100 fine for late payments
    await fee.save();
  }
};

// @desc    Get all fee records (Admin/Teacher gets all, Parent gets child's fees)
// @route   GET /api/fees
// @access  Private
export const getFees = async (req, res) => {
  try {
    if (req.user.role === "parent") {
      // Find all students for this parent
      const students = await Student.find({ parentId: req.user._id });
      const studentIds = students.map((s) => s._id);

      // Dynamically check and update late status for these kids before fetching
      const today = new Date();
      const unpaidFees = await Fee.find({
        studentId: { $in: studentIds },
        status: "unpaid",
        dueDate: { $lt: today }
      });
      for (let fee of unpaidFees) {
        fee.status = "late";
        fee.fine = 100;
        await fee.save();
      }

      const fees = await Fee.find({ studentId: { $in: studentIds } })
        .populate("studentId", "name class section monthlyFee")
        .sort({ createdAt: -1 });

      return res.json(fees);
    } else {
      // Admin or Teacher - run check first
      await checkAndSetLateFees(req.user.schoolId);

      const fees = await Fee.find({ schoolId: req.user.schoolId })
        .populate("studentId", "name class section monthlyFee")
        .sort({ createdAt: -1 });

      return res.json(fees);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Generate monthly fees for all students in school
// @route   POST /api/fees/generate
// @access  Private/Admin
export const generateMonthlyFees = async (req, res) => {
  try {
    const students = await Student.find({ schoolId: req.user.schoolId });
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric"
    });

    // Set due date to 10th of current month (or 10 days from today)
    const dueDate = new Date();
    dueDate.setDate(10); // Due on the 10th
    if (dueDate < new Date()) {
      dueDate.setMonth(dueDate.getMonth() + 1); // If 10th is already passed, set for next month
    }

    let createdCount = 0;

    for (let student of students) {
      const exists = await Fee.findOne({
        studentId: student._id,
        month: currentMonth
      });

      if (!exists) {
        await Fee.create({
          studentId: student._id,
          schoolId: req.user.schoolId,
          month: currentMonth,
          amount: student.monthlyFee,
          dueDate: dueDate,
          status: "unpaid"
        });
        createdCount++;
      }
    }

    return res.json({
      success: true,
      message: `Generated fees for ${createdCount} students for ${currentMonth}.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Mark fee as paid
// @route   PUT /api/fees/pay/:id
// @access  Private/Admin
export const markAsPaid = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("studentId");

    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    // Ensure belongs to same school
    if (fee.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this fee" });
    }

    fee.status = "paid";
    fee.paidDate = new Date();
    await fee.save();

    // Create confirmation notification for parent
    await Notification.create({
      userId: fee.studentId.parentId,
      message: `Assalam-o-Alaikum! Fee for ${fee.studentId.name} for the month of ${fee.month} has been successfully paid / فیس کامیابی سے ادا کر دی گئی ہے۔`,
      type: "paid"
    });

    return res.json(fee);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Send fee reminder alert
// @route   POST /api/fees/reminder/:id
// @access  Private/Admin or Teacher
export const sendReminder = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("studentId");

    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    // Create Notification
    await Notification.create({
      userId: fee.studentId.parentId,
      message: `Assalam-o-Alaikum! Fee of Rs. ${fee.amount + fee.fine} is pending for ${fee.studentId.name} for the month of ${fee.month}. Please pay before the due date / آپ کی فیس واجب الادا ہے۔`,
      type: "fee_due"
    });

    return res.json({ success: true, message: "Reminder notification sent to parent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
