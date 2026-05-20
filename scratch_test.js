import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./backend/models/User.js";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/edupay");
    console.log("Connected to MongoDB");

    // Clean up previous test users
    await User.deleteMany({ email: "test@example.com" });

    const password = "password123";
    console.log("Creating user with password:", password);

    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: password,
      role: "parent"
    });

    console.log("Created User Document:", user);
    console.log("Password in DB:", user.password);

    // Fetch from DB again to verify hook did not run twice or change it
    const fetchedUser = await User.findById(user._id);
    console.log("Fetched User Document:", fetchedUser);
    console.log("Fetched Password in DB:", fetchedUser.password);

    const isMatch = await fetchedUser.matchPassword(password);
    console.log("Password matches enterPassword?", isMatch);

    // Test a wrong password
    const isWrongMatch = await fetchedUser.matchPassword("wrongpassword");
    console.log("Wrong password matches?", isWrongMatch);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Test failed:", err);
  }
};

test();
