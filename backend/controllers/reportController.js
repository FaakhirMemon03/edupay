import Student from "../models/Student.js";
import Fee from "../models/Fee.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  const schoolId = req.user.schoolId;

  try {
    // 1. Total Students
    const totalStudents = await Student.countDocuments({ schoolId });

    // 2. Total Collected Revenue
    const collectedRevenueResult = await Fee.aggregate([
      { $match: { schoolId: new mongoose.Types.ObjectId(schoolId), status: "paid" } },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$amount", "$fine"] } }
        }
      }
    ]);
    const totalCollected = collectedRevenueResult[0]?.total || 0;

    // 3. Pending Fees
    const pendingFeesResult = await Fee.aggregate([
      {
        $match: {
          schoolId: new mongoose.Types.ObjectId(schoolId),
          status: { $in: ["unpaid", "late"] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$amount", "$fine"] } }
        }
      }
    ]);
    const totalPending = pendingFeesResult[0]?.total || 0;

    // 4. Monthly Fee Collection (For Bar Chart)
    const monthlyCollection = await Fee.aggregate([
      { $match: { schoolId: new mongoose.Types.ObjectId(schoolId), status: "paid" } },
      {
        $group: {
          _id: "$month",
          collected: { $sum: { $add: ["$amount", "$fine"] } }
        }
      },
      { $sort: { _id: 1 } } // sort by month
    ]);

    // Format monthlyCollection for ease of use in frontend charts
    // If empty, supply default month
    const chartData = monthlyCollection.map(item => ({
      month: item._id,
      collected: item.collected
    }));

    // 5. Recent Activity Log
    // We can fetch recently paid fees and format them as activities
    const recentPayments = await Fee.find({ schoolId, status: "paid" })
      .populate("studentId", "name class")
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentStudents = await Student.find({ schoolId })
      .sort({ createdAt: -1 })
      .limit(3);

    const activities = [];

    recentPayments.forEach(pay => {
      activities.push({
        id: pay._id,
        type: "payment",
        message: `${pay.studentId?.name || "Student"} (Class ${pay.studentId?.class || ""}) ne fee pay ki - Rs. ${pay.amount + pay.fine}`,
        time: pay.paidDate || pay.updatedAt
      });
    });

    recentStudents.forEach(student => {
      activities.push({
        id: student._id,
        type: "student_added",
        message: `${student.name} Class ${student.class}-${student.section} me add hua`,
        time: student.createdAt
      });
    });

    // Sort combined activities by time desc
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    return res.json({
      totalStudents,
      totalCollected,
      totalPending,
      chartData: chartData.length > 0 ? chartData : [{ month: new Date().toLocaleString("default", { month: "long", year: "numeric" }), collected: 0 }],
      recentActivities: activities.slice(0, 5)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed breakdown reports
// @route   GET /api/reports/summary
// @access  Private/Admin
export const getDetailedReport = async (req, res) => {
  const schoolId = req.user.schoolId;

  try {
    // 1. Paid vs Unpaid counts
    const statusCounts = await Fee.aggregate([
      { $match: { schoolId: new mongoose.Types.ObjectId(schoolId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: { $add: ["$amount", "$fine"] } }
        }
      }
    ]);

    // 2. Class-wise Report
    const classReport = await Fee.aggregate([
      { $match: { schoolId: new mongoose.Types.ObjectId(schoolId) } },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $group: {
          _id: "$studentInfo.class",
          totalFees: { $sum: { $add: ["$amount", "$fine"] } },
          paidFees: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, { $add: ["$amount", "$fine"] }, 0]
            }
          },
          pendingFees: {
            $sum: {
              $cond: [{ $in: ["$status", ["unpaid", "late"]] }, { $add: ["$amount", "$fine"] }, 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json({
      statusCounts,
      classReport
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
