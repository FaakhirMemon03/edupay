import cron from "node-cron";
import Student from "../models/Student.js";
import Fee from "../models/Fee.js";
import Notification from "../models/Notification.js";

// 1. Generate Monthly Fees Pipeline - Runs at 00:00 on the 1st of every month
export const startCronJobs = () => {
  console.log("Initializing Scheduler Pipelines...");

  // Generate fees automatically on the 1st of every month
  cron.schedule("0 0 1 * *", async () => {
    console.log("[Pipeline] Starting Auto Fee Generation...");
    try {
      const students = await Student.find();
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric"
      });

      const dueDate = new Date();
      dueDate.setDate(10); // due on the 10th of current month
      if (dueDate < new Date()) {
        dueDate.setMonth(dueDate.getMonth() + 1);
      }

      let count = 0;
      for (let student of students) {
        const exists = await Fee.findOne({
          studentId: student._id,
          month: currentMonth
        });

        if (!exists) {
          await Fee.create({
            studentId: student._id,
            schoolId: student.schoolId,
            month: currentMonth,
            amount: student.monthlyFee,
            dueDate: dueDate,
            status: "unpaid"
          });
          count++;
        }
      }
      console.log(`[Pipeline] Auto Fee Generation completed: Created ${count} records for ${currentMonth}`);
    } catch (error) {
      console.error("[Pipeline] Auto Fee Generation Error:", error.message);
    }
  });

  // Daily Late Check Pipeline - Runs at 00:00 every day
  cron.schedule("0 0 * * *", async () => {
    console.log("[Pipeline] Starting Late Fee Verification...");
    try {
      const today = new Date();
      const unpaidFees = await Fee.find({
        status: "unpaid",
        dueDate: { $lt: today }
      });

      let count = 0;
      for (let fee of unpaidFees) {
        fee.status = "late";
        fee.fine = 100; // Rs. 100 late fee fine
        await fee.save();
        count++;
      }
      console.log(`[Pipeline] Late Fee Verification completed: Flagged ${count} late records`);
    } catch (error) {
      console.error("[Pipeline] Late Fee Verification Error:", error.message);
    }
  });

  // Daily Reminder Pipeline - Runs at 09:00 AM every day
  cron.schedule("0 9 * * *", async () => {
    console.log("[Pipeline] Sending automated fee reminders...");
    try {
      const unpaidFees = await Fee.find({
        status: { $in: ["unpaid", "late"] }
      }).populate("studentId");

      let count = 0;
      for (let fee of unpaidFees) {
        if (fee.studentId && fee.studentId.parentId) {
          // Check if a reminder for this month was already sent in the last 24 hrs to avoid spamming
          const message = `Assalam-o-Alaikum! Aap ki fee due hai for ${fee.studentId.name} for the month of ${fee.month}. Total Amount: Rs. ${fee.amount + fee.fine} / فیس واجب الادا ہے۔`;

          // Generate System Notification
          await Notification.create({
            userId: fee.studentId.parentId,
            message,
            type: "fee_due"
          });
          count++;
        }
      }
      console.log(`[Pipeline] Automated fee reminders completed: Logged ${count} notification alerts`);
    } catch (error) {
      console.error("[Pipeline] Automated fee reminders Error:", error.message);
    }
  });
};
