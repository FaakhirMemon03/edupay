import jwt from "jsonwebtoken";
import User from "../models/User.js";
import School from "../models/School.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "edupay_super_secret_jwt_key_12345",
    { expiresIn: "30d" }
  );
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === "PP@admin.com" && password === "PP@access.com") {
      let admin = await User.findOne({ email });

      if (!admin) {
        let school = await School.findOne();

        if (!school) {
          school = await School.create({
            name: "EduPay Beacon School",
            address: "Gulshan-e-Iqbal, Karachi",
            phone: "+92 300 1234567",
          });
        }

        admin = await User.create({
          name: "System Admin",
          email: "PP@admin.com",
          password: "PP@access.com",
          role: "admin",
          schoolId: school._id,
        });

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
    }

    return res.status(401).json({ message: "Invalid email or password" });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, role, schoolId } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let assignedSchoolId = schoolId;

    if (!assignedSchoolId && req.user?.schoolId) {
      assignedSchoolId = req.user.schoolId;
    }

    if (!assignedSchoolId) {
      let school = await School.findOne();

      if (!school) {
        school = await School.create({
          name: "EduPay Beacon School",
          address: "Gulshan-e-Iqbal, Karachi",
          phone: "+92 300 1234567",
        });
      }

      assignedSchoolId = school._id;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "parent",
      schoolId: assignedSchoolId,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("schoolId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};