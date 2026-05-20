import jwt from "jsonwebtoken";
import User from "../models/User.js";
import School from "../models/School.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "edupay_super_secret_jwt_key_12345", {
    expiresIn: "30d",
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Special admin login fallback/seeding
    if (email === "PP@admin.com" && password === "PP@access.com") {
      let admin = await User.findOne({ email });
      if (!admin) {
        // Create a default school if none exists
        let school = await School.findOne();
        if (!school) {
          school = await School.create({
            name: "EduPay Beacon School",
            address: "Gulshan-e-Iqbal, Karachi",
            phone: "+92 300 1234567"
          });
        }

        admin = await User.create({
          name: "System Admin",
          email: "PP@admin.com",
          password: "PP@access.com", // will be hashed by pre-save hook
          role: "admin",
          schoolId: school._id
        });

        // Set admin ID on school
        school.adminId = admin._id;
        await school.save();
      }

      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        schoolId: admin.schoolId,
        token: generateToken(admin._id),
      });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user (parent or teacher)
// @route   POST /api/auth/register
// @access  Private/Admin
    // Find a default school if schoolId is not passed
    let assignedSchoolId = schoolId;
    if (!assignedSchoolId) {
      if (req.user && req.user.schoolId) {
        assignedSchoolId = req.user.schoolId;
      } else {
        let school = await School.findOne();
        if (!school) {
          school = await School.create({
            name: "EduPay Beacon School",
            address: "Gulshan-e-Iqbal, Karachi",
            phone: "+92 300 1234567"
          });
        }
        assignedSchoolId = school._id;
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "parent",
      schoolId: assignedSchoolId,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("schoolId");

    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
